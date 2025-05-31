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

function Stock(
  Name,
  OpenPrice,
  HighPrice,
  LowPrice,
  CurrentPrice,
  PClosePrice,
  Time1,
  Time2
) {
  this.Name = Name;
  this.OpenPrice = OpenPrice;
  this.HighPrice = HighPrice;
  this.LowPrice = LowPrice;
  this.CurrentPrice = CurrentPrice;
  this.PClosePrice = PClosePrice;
  this.Time = new Date(Time1 * 1000).toISOString();
}

app.post("/stock-monitoring", (req, res) => {
  let { min, sec, symbol } = req.body;
  if (
    //ensure there are no missing fields, then makes sure min and sec are non negative and numbers
    //and makes sure symbol is a string (how)
    !min ||
    !sec ||
    !symbol ||
    min < 0 ||
    sec < 0 ||
    min != parseInt(min, 10) ||
    sec != parseInt(sec, 10)
  ) {
    res.send("Error");
  } else {
    api_key.apiKey = apiKey;
    const finnhubClient = new finnhub.DefaultApi();
    finnhubClient.quote(symbol, (error, data, response) => {
      const newStock = new Stock(
        symbol,
        Object.values(data)[0],
        Object.values(data)[1],
        Object.values(data)[2],
        Object.values(data)[3],
        Object.values(data)[4],
        Object.values(data)[5],
        Object.values(data)[6],
        Object.values(data)[7]
      );
      var stockNum = -1;
      for (var j = 0; j < stocks.length; j++) {
        console.log(stocks[j][0]);
        if (stocks[j][0] != null && stocks[j][0].Name === newStock.Name) {
          stockNum = j;
        }
      }
      if (stockNum === -1) {
        stockNum = stocks.length;
      }

      if (!stocks[stockNum]) {
        stocks[stockNum] = []; // Ensure the row exists
      }
      //console.log(newStock);
      //var i = stocks[stockNum].length;
      stocks[stockNum].push(newStock);
      console.log(stocks);
      return res.json(stocks);
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
    /*
    let i = 0;
    for (var j = 0; j < Object.keys(data).length - 2; j++) {
      if (!stocks[numOfStocks]) {
        stocks[numOfStocks] = []; // Ensure the row exists
      }
      if (data[prop] === null) {
        stocks[numOfStocks][i] = "null";
      } else {
        stocks[numOfStocks][i] = data[j];
      }
      i++;
      
    }
      */
    const newStock = new Stock(
      stockSymbol,
      Object.values(data)[0],
      Object.values(data)[1],
      Object.values(data)[2],
      Object.values(data)[3],
      Object.values(data)[4],
      Object.values(data)[5],
      Object.values(data)[6],
      Object.values(data)[7]
    );
    console.log(newStock);
    res.json(stocks);
  });
});

app.get("/api", (req, res) => {
  res.send("?");
});

app.listen(8080, () => {
  console.log("Server started on port 8080");
});
