const express = require("express");
const app = express();
const cors = require("cors");
const corsOption = {
  origin: ["http://localhost:5173"],
};
const finnhub = require("finnhub");

const api_key = finnhub.ApiClient.instance.authentications["api_key"];
api_key.apiKey = "cut7lihr01qrsirl7g50cut7lihr01qrsirl7g5g"; // Replace this
const finnhubClient = new finnhub.DefaultApi();

app.use(cors(corsOption));
app.use(express.json());
app.get("/api", (req, res) => {
  if (req.query.symbol === "") {
    res.json("error");
  } else {
    finnhubClient.quote("AAP", (error, data, response) => {
      res.json(data);
    });
  }
});

app.listen(8080, () => {
  console.log("port started on 8080");
});
