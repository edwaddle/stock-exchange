const express = require("express");
const app = express();
const cors = require("cors");
const corsOptions = {
  origin: ["http://localhost:5173"],
};
const finnhub = require("finnhub");
const api_key = finnhub.ApiClient.instance.authentications["api_key"];

app.use(cors(corsOptions)); //necessary for get
app.use(express.json()); //necessary for post
const fruits = ["apple", "orange", "banana"];

app.post("/start-monitoring", (req, res) => {
  res.json({ fruits: fruits });
  const { min, sec, symbol } = req.body;
});

app.get("/history", (req, res) => {
  api_key.apiKey = "cut7lihr01qrsirl7g50cut7lihr01qrsirl7g5g";
  const finnhubClient = new finnhub.DefaultApi();
  const stockSymbol = req.query.symbol;
  if (!stockSymbol) {
    return res.status(400).json({ error: "Missing symbol query parameter" });
  }
  finnhubClient.quote(stockSymbol, (error, data, response) => {
    res.json(data);
  });
});

app.listen(8080, () => {
  console.log("Server started on port 8080");
});
