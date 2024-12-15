const express = require("express");
const app = express();

// CORS middleware
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
  next(req.method === "OPTIONS" ? null : undefined);
});

app.use(express.json());
app.use(express.static("public"));

// Initial game state
const data = {
  game: {
    board: Array(6)
      .fill()
      .map(() => Array(7).fill("")),
    currentPlayer: "r",
  },
};

// API key validation middleware
const validateApiKey = (req, res, next) => {
  if (req.query["api-key"] !== "c4game") {
    return res.status(401).json({ error: "Invalid API key" });
  }
  next();
};

// API routes
app.get("/api/data/:key", validateApiKey, (req, res) => {
  const gameData = data[req.params.key];
  res.json(gameData ?? { error: "Game not found" });
});

app.put("/api/data/:key", validateApiKey, (req, res) => {
  data[req.params.key] = req.body;
  res.json({ status: "ok" });
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
