import { useState, useRef, useEffect } from "react";
import "./App.css";
import axios from "axios";

function App() {
  const SYMBOL = useRef("");
  const MIN = useRef("");
  const SEC = useRef("");
  const intervalRef = useRef();
  const [stockList, setStockList] = useState([]);

  function Stock(op, hp, lp, cp, pcp, t) {
    this.op = op;
    this.hp = hp;
    this.lp = lp;
    this.cp = cp;
    this.pcp = pcp;
    this.t = t;
  }

  const startLoop = () => {
    setStockList([]);
    const currSymbol = SYMBOL.current.value;
    const currMin = MIN.current.value;
    const currSec = SEC.current.value;
    fetchAPI(currSymbol, currMin, currSec);
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    intervalRef.current = setInterval(() => {
      fetchAPI(currSymbol, currMin, currSec);
    }, 5000);
  };

  const fetchAPI = async (symbol, min, sec) => {
    axios
      .get("http://localhost:8080/api", {
        params: {
          symbol: symbol.toUpperCase(), // Pass symbol as a query parameter, default to AAPL
          min: min,
          sec: sec,
        },
      })
      .then(function (res) {
        if (res.data === "error") {
          //ensure symbol is correct
          alert("Make sure to fill out all fields");
          if (intervalRef.current !== null) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
        } else if (
          //ensure that minutes work
          MIN.current.value === "" ||
          SEC.current.value === "" ||
          isNaN(MIN.current.value) ||
          isNaN(SEC.current.value)
        ) {
          console.log(MIN.current.value);
          alert("Make sure to properly fill out seconds and minutes");
          if (intervalRef.current !== null) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
        } else {
          console.log("clicked");
          const tempStock = new Stock(
            res.data.o,
            res.data.h,
            res.data.l,
            res.data.c,
            res.data.pc,
            MIN.current.value + " : " + SEC.current.value
          );
          setStockList((prevList) => [...prevList, tempStock]);
        }
      })
      .catch(function (error) {
        console.log("error in fetching api, " + error);
      });
  };

  return (
    <>
      <div className="row-one">
        <h1> SCE stock tracking app</h1>
        <input className="minutes" placeholder="Seconds" ref={SEC}></input>
        <input className="seconds" placeholder="Minutes" ref={MIN}></input>
        <input className="symbol" placeholder="Symbol" ref={SYMBOL}></input>
        <button className="search-button" onClick={() => startLoop()}>
          Search
        </button>
      </div>
      {stockList.length === 0 ? (
        <div>Please fill in the stock you want to track</div>
      ) : (
        <table>
          <tr className="table-head">
            <th>Open price of the day</th>
            <th>High price of the day</th>
            <th>Low price of the day</th>
            <th>Current price</th>
            <th>Previous close price</th>
            <th>Time of the entry</th>
          </tr>
          {stockList.map((element, index) => (
            <tr key={index}>
              <td>{element.op}</td>
              <td>{element.hp}</td>
              <td>{element.lp}</td>
              <td>{element.cp}</td>
              <td>{element.pcp}</td>
              <td>{element.t}</td>
            </tr>
          ))}
        </table>
      )}
    </>
  );
}

export default App;
