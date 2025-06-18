import express from "express";
import cors from "cors";
import dotenv from "dotenv";


dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Register user with Stream Chat
// @ts-ignore
app.post("/register-user", async (req, res): Promise<any> => {
	const { name, email } = req.body;

	if (!name || !email) {
		res.status(400).json({
			error: "Name and email are required!",
		});
	}

	res.status(200).json({
		message: "Successfully registered user!",
	});
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
	console.log(`Server started on port ${PORT}`);
});
