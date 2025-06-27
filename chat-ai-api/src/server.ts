import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { StreamChat } from 'stream-chat';
import { OpenAI } from "openai";
import { eq } from "drizzle-orm";
import { ChatCompletionMessage } from "openai/resources";

import { db } from "./config/database.js";
import { chats, users } from './db/schema.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Initialize Stream Client
const chatClient = StreamChat.getInstance(
	process.env.STREAM_API_KEY!,
	process.env.STREAM_API_SECRET!
);

// Initialize OpenAI
const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY!,
});

// Register user with Stream Chat
// @ts-ignore
app.post("/register-user", async (req, res): Promise<any> => {
	const { name, email } = req.body;

	if (!name || !email) {
		res.status(400).json({
			error: "Name and email are required!",
		});
	}

	try {
		const userId = email.replace(/[^a-zA-Z0-9_-]/g, "_");

		const userResponse = await chatClient.queryUsers({
			id: { $eq: userId },
		});

		if (!userResponse.users.length) {
			await chatClient.upsertUser({
				id: userId,
				name,
				// @ts-ignore
				email,
				role: 'user',
			});
		}

		// Check for existing user in db
		const existingUser = await db
			.select()
			.from(users)
			.where(eq(users.userId, userId));

		if (!existingUser.length) {
			console.log(`User ${userId} does not exist in the database. Adding them...`);

			await db.insert(users).values({
				userId,
				name,
				email,
			});
		}

		res.status(200).json({
			userId,
			name,
			email,
		});
	} catch (error) {
		res.status(500).json({
			error: "Internal Server Error!",
		});
	}

});

// Send message to AI
app.post("/chat", async (req, res): Promise<any> => {
	const { message, userId } = req.body;

	if (!message || !userId) {
		res.status(400).json({
			error: "Message and User are required!",
		});
	}

	try {
		// Verify user exists
		const userResponse = await chatClient.queryUsers({
			id: userId,
		});

		if (!userResponse.users.length) {
			return res.status(404).json({
				error: "User Not Found. Please register first",
			});
		}

		// Check user in db
		const existingUser = await db
			.select()
			.from(users)
			.where(eq(users.userId, userId));

		if (!existingUser.length) {
			return res.status(404).json({
				error: "User Not Found. Please register first",
			});
		}

		// Send message to OpenAI GPT-4
		const response = await openai.chat.completions.create({
			model: 'gpt-4',
			messages: [
				{ role: 'user', content: message },
			],
		});

		const aiMessage: string = response.choices[0].message?.content ?? 'No response from AI';

		// Save chat to db
		await db.insert(chats).values({
			userId,
			message,
			reply: aiMessage,
		});

		// Create or get channel
		const channel = chatClient.channel('messaging', `chat-${userId}`, {
			// @ts-ignore
			name: 'AI Chat',
			created_by_id: 'ai_bot'
		});

		await channel.create();
		await channel.sendMessage({
			text: aiMessage,
			user_id: 'ai_bot',
		});

		res.status(200).json({
			reply: aiMessage,
		});
	} catch (error) {
		console.log(error, 'error');
		res.status(500).json({
			error: "Internal Server Error!",
		});
	}
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
	console.log(`Server started on port ${PORT}`);
});
