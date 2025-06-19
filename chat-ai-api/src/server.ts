import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { StreamChat } from 'stream-chat';

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

		res.status(200).json({
			message: "Successfully registered user!",
		});
	} catch (error) {
		res.status(500).json({
			error: "Internal Server Error!",
		});
	}

});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
	console.log(`Server started on port ${PORT}`);
});
