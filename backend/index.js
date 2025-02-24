const express = require("express");
const app = express();
const cors = require("cors");
const corsOptions = {
  origin: ["http://localhost:5173"],
};
require("dotenv").config();
const finnhub = require("finnhub");
const api_key = finnhub.ApiClient.instance.authentications["api_key"];
const apiKey = "cut7lihr01qrsirl7g50cut7lihr01qrsirl7g5g"; //how do I make this work with env

app.use(cors(corsOptions)); //necessary for get
app.use(express.json()); //necessary for post
const fruits = ["apple", "orange", "banana"];
const stocks = [[]];
let numOfStocks = 0;

app.post("/stock-monitoring", (req, res) => {
  const { min, sec, symbol } = req.body;
  if (!min || !sec || !symbol) {
    res.send("Error");
  } else {
    api_key.apiKey = apiKey;
    const finnhubClient = new finnhub.DefaultApi();
    finnhubClient.quote(symbol, (error, data, response) => {
      let i = 0;
      for (var prop in data) {
        if (!stocks[numOfStocks]) {
          stocks[numOfStocks] = []; // Ensure the row exists
        }
        if (data[prop] === null) {
          stocks[numOfStocks][i] = "null";
        } else {
          stocks[numOfStocks][i] = data[prop];
        }
        i++;
      }
      res.json(stocks);
      numOfStocks = numOfStocks + 1;
      console.log(stocks);
    });
  }
});

app.get("/history", (req, res) => {
  api_key.apiKey = apiKey;
  const finnhubClient = new finnhub.DefaultApi();
  const stockSymbol = req.query.symbol;
  if (!stockSymbol) {
    return res.status(400).json({ error: "Missing symbol query parameter" });
  }
  finnhubClient.quote(stockSymbol, (error, data, response) => {
    let i = 0;
    for (var prop in data) {
      if (!stocks[numOfStocks]) {
        stocks[numOfStocks] = []; // Ensure the row exists
      }
      if (data[prop] === null) {
        stocks[numOfStocks][i] = "null";
      } else {
        stocks[numOfStocks][i] = data[prop];
      }
      i++;
    }
    res.json(stocks);
    numOfStocks = numOfStocks + 1;
    console.log(stocks);
  });
  console.log(numOfStocks);
});

app.listen(8080, () => {
  console.log("Server started on port 8080");
});
