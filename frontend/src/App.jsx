import { useState, useEffect, useRef } from "react";
import "./App.css";
import axios from "axios";

function App() {
  const [array, setArray] = useState([]);

  const monitorStocks = async () => {
    return axios
      .post("http://localhost:8080/stock-monitoring", {
        min: currMin,
        sec: currSec,
        symbol: currSymbol,
      })
      .then(function (req) {
        if (req.data === "Error") {
          alert(
            "Make Sure to fill out all fields correctly (no negative numbers or blank fields)"
          );
          console.log("error");
          return false;
        } else {
          console.log("Response:", req.data);
          const copyArray = req.data.map((prop) => Object.values(prop));

          /*
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
            */
          console.log(copyArray);
          console.log("aray is : ", Object.values(copyArray));
          setArray(copyArray);

          return true;
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
        /*
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
        */
      })
      .catch(function (error) {
        console.error("Error in retrieving history: " + error);
      });
  };

  const handleClick = async () => {
    clearInterval(monitorStocks);
    retrieveHistory();
    currMin = MIN.current.value;
    currSec = SEC.current.value;
    currSymbol = SYMBOL.current.value;
    if (await monitorStocks()) {
      let time = currSec * 1000;
      time += currMin * 1000 * 60;
      setInterval(monitorStocks, time);
    }
  };

  return (
    <div className="App">
      <h1>Honk Honk hit the klaxon</h1>
      <div className="inputGroup">
        <input ref={MIN} type="text" placeholder="MIN"></input>
        <input ref={SEC} type="text" placeholder="SEC"></input>
        <input ref={SYMBOL} type="text" placeholder="SYMBOL"></input>
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
          {array.map((innerArray, i) =>
            Object.values(innerArray).map((row, j) => {
              let newStock = Object.values(row);
              console.log("newStock is = ", newStock[0], SYMBOL.current.value);
              if (newStock[0] != null && newStock[0] === SYMBOL.current.value) {
                return (
                  <tr key={j}>
                    <th>{newStock[1]}</th>
                    <th>{newStock[2]}</th>
                    <th>{newStock[3]}</th>
                    <th>{newStock[4]}</th>
                    <th>{newStock[5]}</th>
                    <th>{newStock[6]}</th>
                  </tr>
                );
              }
            })
          )}
        </table>
      ) : (
        <>Fill out inputs</>
      )}
    </div>
  );
}

export default App;
