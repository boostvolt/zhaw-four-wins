const express = require("express");
const app = express();
const port = 3000;

// Add CORS middleware
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());
app.use(express.static("public"));

let data = {
  game: {
    board: Array(6)
      .fill("")
      .map(() => Array(7).fill("")),
    currentPlayer: "r",
  },
};

// Add API endpoints
app.get("/api/data/:key", (req, res) => {
  if (req.query["api-key"] !== "c4game") {
    return res.status(401).json({ error: "Invalid API key" });
  }
  const gameData = data[req.params.key];
  if (!gameData) {
    return res.status(404).json({ error: "Game not found" });
  }
  res.json(gameData);
});

app.put("/api/data/:key", (req, res) => {
  if (req.query["api-key"] !== "c4game") {
    return res.status(401).json({ error: "Invalid API key" });
  }
  data[req.params.key] = req.body;
  res.json({ status: "ok" });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
