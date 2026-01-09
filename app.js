import fs, { read } from "node:fs";
import express from "express";

const posts_path = "./data/posts.json";
const comments_path = "./data/comments.json";

const app = express();
app.use(express.json());

function readJSON(path) {
	return JSON.parse(fs.readFileSync(path, "utf-8"));
}

function writeJSON(path, data) {
	fs.writeFileSync(path, JSON.stringify(data));
}

function displayFile(path) {
	console.table(readJSON(path));
}

// GET /POSTS
app.get("/posts", (req, res, next) => {
	let posts;
	try {
		posts = readJSON(posts_path);
	} catch (error) {
		next(error);
	}
	res.send(posts);
});

// GET /POSTS/:ID
app.get("/posts/:id", (req, res, next) => {
	let posts;
	try {
		posts = readJSON(posts_path);
	} catch (error) {
		next(error);
	}

	const id = Number.parseInt(req.params.id);
	const post = posts.find((p) => p["id"] == id);

	if (post) res.send(post);
	else res.status(404).send("No post found");
});

// POST /POSTS
app.post("/posts", (req, res, next) => {
	let posts;
	try {
		posts = readJSON(posts_path);
	} catch (error) {
		next(error);
	}

	const new_post = req.body;
	posts.push(new_post);

	try {
		writeJSON(posts_path, posts);
	} catch (error) {
		next(error);
	}

	res.status(201).send(new_post);
});

// PATCH /POST/:ID
app.patch("/posts/:id", (req, res, next) => {
	let posts;
	try {
		posts = readJSON(posts_path);
	} catch (error) {
		next(error);
	}

	const id = Number.parseInt(req.params.id);
	const post = posts.find((p) => p["id"] == id);
	const modified = req.body;

	if (post) {
		for (const key in modified) {
			post[key] = modified[key];
		}
		try {
			writeJSON(posts_path, posts);
		} catch (error) {
			next(error);
		}

		res.status(200).send(post);
	} else {
		res.status(404).send("No post found");
	}
});

// DELETE /POSTS/:ID
app.delete("/posts/:id", (req, res, next) => {
	let posts;
	try {
		posts = readJSON(posts_path);
	} catch (error) {
		next(error);
	}

	const id = Number.parseInt(req.params.id);
	const post = posts.find((p) => p["id"] == id);

	if (post) {
		const index = posts.indexOf(post);
		posts.splice(index, 1);
		try {
			writeJSON(posts_path, posts);
		} catch (error) {
			next(error);
		}

		res.status(204);
		res.end();
	} else {
		res.status(404).send("No post found");
	}
});

// GET /POSTS/:ID/COMMENTS
app.get("/posts/:id/comments", (req, res, next) => {
	let comments;
	try {
		comments = readJSON(comments_path);
	} catch (error) {
		next(error);
	}

	const post_id = Number.parseInt(req.params.id);
	const filtered_comments = comments.filter((c) => c["postId"] == post_id);
	res.send(filtered_comments);
});

// POST /POSTS/:ID/COMMENTS
app.post("/posts/:id/comments", (req, res, next) => {
	let comments;
	try {
		comments = readJSON(comments_path);
	} catch (error) {
		next(error);
	}

	const new_comment = req.body;
	const post_id = Number.parseInt(req.params.id);
	new_comment["postId"] = post_id;
	comments.push(new_comment);
	try {
		writeJSON(comments_path, comments);
	} catch (error) {
		next(error);
	}

	res.status(201).send(new_comment);
});

// DELETE /COMMENTS/:ID
app.delete("/comments/:id", (req, res, next) => {
	let comments;
	try {
		comments = readJSON(comments_path);
	} catch (error) {
		next(error);
	}

	const id = Number.parseInt(req.params.id);
	const comment = comments.find((c) => c["id"] == id);

	if (comment) {
		const index = comments.indexOf(comment);
		comments.splice(index, 1);
		try {
			writeJSON(comments_path, comments);
		} catch (error) {
			next(error);
		}

		res.status(204);
		res.end();
	} else {
		res.status(404).send("No comment found");
	}
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
	console.log(`Serveur BlogAPI démarré sur http://localhost:${PORT}`);
});
