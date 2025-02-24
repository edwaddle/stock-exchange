import { useState, useEffect, useRef } from "react";
import "./App.css";
import axios from "axios";

function App() {
  const [array, setArray] = useState([]);

  const monitorStocks = async () => {
    axios
      .post("http://localhost:8080/stock-monitoring", {
        min: currMin,
        sec: currSec,
        symbol: currSymbol,
      })
      .then(function (req) {
        if (req.data === "Error") {
          alert("Make Sure to fill out all fields");
        } else {
          console.log("Response:", req.data);
          const copyArray = [[]];

          let i = 0;
          for (var prop in req.data) {
            console.log("prop is: " + prop);
            if (!copyArray[prop]) {
              copyArray[prop] = [];
            }
            for (var propInner in req.data[prop]) {
              console.log(req.data[prop][propInner]);
              if (req.data[prop][propInner] === null) {
                copyArray[prop][i] = "null";
              } else {
                copyArray[prop][i] = req.data[prop][propInner];
                console.log(req.data[prop][propInner]);
              }
              i++;
            }
          }

          console.log("aray is : " + copyArray);
          setArray(copyArray);
          setInterval(monitorStocks, 10000);
        }
      })
      .catch(function (error) {
        console.error("Error in retrieving history: " + error);
      });
  };

  useEffect(() => {
    //monitorStocks();
    //return () => setInterval(retrieveHistory, 10000);
  }, []);

  const MIN = useRef("");
  const SEC = useRef("");
  const SYMBOL = useRef("");
  let currMin = "";
  let currSec = "";
  let currSymbol = "";
  const retrieveHistory = async () => {
    axios
      .get("http://localhost:8080/history", {
        params: {
          symbol: SYMBOL.current.value, // Pass symbol as a query parameter
        },
      })
      .then(function (req) {
        console.log("Response:", req.data);
        const copyArray = [[]];

        //How do I make this work with multiple
        let i = 0;
        for (var prop in req.data) {
          console.log("prop is: " + prop);
          if (!copyArray[prop]) {
            copyArray[prop] = [];
          }
          for (var propInner in req.data[prop]) {
            console.log(req.data[prop][propInner]);
            if (req.data[prop][propInner] === null) {
              copyArray[prop][i] = "null";
            } else {
              copyArray[prop][i] = req.data[prop][propInner];
              console.log(req.data[prop][propInner]);
            }
            i++;
          }
        }

        console.log("aray is : " + copyArray);
        setArray(copyArray);
      })
      .catch(function (error) {
        console.error("Error in retrieving history: " + error);
      });
  };

  const handleClick = () => {
    currMin = MIN.current.value;
    currSec = SEC.current.value;
    currSymbol = SYMBOL.current.value;
    monitorStocks();
  };

  return (
    <div className="App">
      <h1>Honk Honk hit the klaxon</h1>
      <div className="inputGroup">
        <input ref={MIN} type="text" placeholder="MIN"></input>
        <input ref={SEC} type="text" placeholder="SEC"></input>
        <input
          ref={SYMBOL}
          type="text"
          placeholder="SYMBOL"
          defaultValue="AAPL"
        ></input>
        <button id="EnterButton" onClick={handleClick}>
          Enter
        </button>
      </div>

      {array.length > 0 ? (
        <table className="outputGroup">
          <tr>
            <th>Open Price</th>
            <th>High Price</th>
            <th>Low Price</th>
            <th>Current Price</th>
            <th>Previous Close Price</th>
            <th>Time</th>
          </tr>
          {array.map((row, index) => (
            <tr key={index}>
              {row.map((col, index) => (
                <th key={index}>{col}</th>
              ))}
            </tr>
          ))}
        </table>
      ) : (
        <>hi</>
      )}
    </div>
  );
}

export default App;
