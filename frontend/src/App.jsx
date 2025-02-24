import { useState, useEffect, useRef } from "react";
import "./App.css";
import axios from "axios";

function App() {
  const [count, setCount] = useState(0);
  const [array, setArray] = useState([]);

  const monitorStocks = async () => {
    axios
      .post("http://localhost:8080/start-monitoring", {
        min: MIN.current.value,
        sec: SEC.current.value,
        symbol: SYMBOL.current.value,
      })
      .then(function (req) {
        console.log("Response:", req.data);
        retrieveHistory();
      })
      .catch(function (error) {
        console.log("Error:", error.req.data);
      });
  };

  useEffect(() => {
    retrieveHistory();
  }, []);

  const MIN = useRef("");
  const SEC = useRef("");
  const SYMBOL = useRef("");
  const retrieveHistory = async () => {
    axios
      .get("http://localhost:8080/history", {
        params: {
          symbol: SYMBOL.current.value, // Pass symbol as a query parameter
        },
      })
      .then(function (req) {
        console.log("Response:", req.data);
        const rowLength = Object.keys(req.data).length;
        const colLength = 1;
        const copyArray = Array.from(
          { length: rowLength },
          () => new Array(colLength)
        );

        /*
        const colLength = Object.keys(req.data[0]).length;
        const copyArray = [rowLength][colLength];
        for (let i = 0; i < rowLength; i++) {
          for (let j = 0; j < colLength; j++) {
            copyArray[i][j] = req.data[i][j];
          }
        }
          */
        let i = 0;
        for (var prop in req.data) {
          console.log(req.data[prop]);
          if (req.data[prop] === null) {
            copyArray[0][i] = "null";
          } else {
            copyArray[0][i] = req.data[prop];
          }
          i++;
        }
        setArray(copyArray);
      })
      .catch(function (error) {
        console.error("Error in retrieving history: " + error);
      });
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
        <button id="EnterButton" onClick={monitorStocks}>
          Enter
        </button>
      </div>
      <table className="outputGroup">
        {array.map((row, index) => (
          <tr key={index}>
            {row.map((col, index) => (
              <th key={index}>{col}</th>
            ))}
          </tr>
        ))}
      </table>
    </div>
  );
}

export default App;
