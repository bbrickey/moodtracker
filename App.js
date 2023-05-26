/**
 * Mood Tracker App
 * Author: Ben Brickey
 * May 2023
 * Frontend, allows user to add daily entry and pull summary results
 */

import "./App.css";
import React, { useState, useEffect } from "react";
import Axios from "axios";
import axios from "axios";
import Results from "./Results";
import "./styles.css";

/// REMOVE PASSWORD BEFORE UPLOADING///////////////////////////////////////////

function App() {
  //variables for user entry
  const [mood, setMood] = useState(2);
  const [sleep, setSleep] = useState(0);
  const [alcohol, setAlcohol] = useState(0);
  const [coffee, setCoffee] = useState(0);
  const [vitamin, setVitamin] = useState(0);
  const [exercise, setExercise] = useState(0);
  const [chessScore, setChessScore] = useState(0);

  //results from database
  //const [show, setShow] = useState(false);
  const [feelWorst, setFeelWorst] = useState([]);
  const [feelBest, setFeelBest] = useState([]);
  const [performWorst, setPerformWorst] = useState([]);
  const [performBest, setPerformBest] = useState([]);

  // used to store date of previous entries for data validation
  const [entryDates, setEntryDates] = useState([]);

  //date data
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const current = new Date();
  let yesterday = new Date(current);
  yesterday.setDate(yesterday.getDate() - 1);
  let month = yesterday.getMonth();
  let year = yesterday.getFullYear();
  let date = yesterday.getDate();
  //console.log("CURRENT " + yesterday);
  //const year = current.getFullYear();
  //const date = current.getDate();
  //const month = current.getMonth();
  //const time = `${current.getHours()}:${current.getMinutes()}:${current.getSeconds()}`;

  //const submitDate = `${year}-${month}-${date} ${time}`;
  const displayDate = `${monthNames[month]} ${date} ${year}`;
  const checkDate = `${year}-${month < 10 ? `0${month + 1}` : `${month + 1}`}-${
    date < 10 ? `0${date}` : `${date}`
  }T07:00:00.000Z`;

  const chessURL = `https://api.chess.com/pub/player/bubbasparx666/games/${year}/${
    month < 10 ? `0${month + 1}` : `${month + 1}`
  }`;
  //const chessURL = `https://api.chess.com/pub/player/bubbasparx666/games/2022/09`

  useEffect(() => {
    //startUp();
    addChessScores();
    //getEntryDates();
    getChessScore();
  }, []);

  async function startUp() {
    console.log("1. adding entry, getting chess scores from server...");
    await addChessScores();
    console.log("2. added chess scores, getting entry dates...");
    await getEntryDates();
  }

  //pulls recent chess scores from chess.com API and adds to database
  async function addChessScores() {
    axios
      .get(chessURL)
      .then((response) => {
        const json = response.data;

        //log my rating, date, & timestamp for all "Bullet" (daily) chess games
        for (let i = 0; i < json.games.length; i++) {
          if (json.games[i].time_class === "bullet") {
            let timestamp = json.games[i].end_time;
            //convert timestamp to date format
            let date = new Date(timestamp * 1000);
            let month = date.getMonth() + 1;
            let year = date.getFullYear();
            let day = date.getDate();
            let dateOutput = `${year}/${month}/${day}`; //game date
            let previousDate = new Date();
            let prevTemp = yesterday.getDate() - 2;
            previousDate.setDate(prevTemp);

            //get chess rating & add to database
            if (json.games[i].black.username === "bubbasparx666") {
              let rating = json.games[i].black.rating; // game rating
              try {
                Axios.post("http://localhost:3001/addChess", {
                  rating: rating,
                  timestamp: timestamp,
                  date: dateOutput,
                });
              } catch (err) {
                console.log(err);
              }
              /*
            
              Axios.post("http://localhost:3001/addChess", {
                rating: rating,
                timestamp: timestamp,
                date: dateOutput,
              })
                .then(() => {
                  console.log("success");
                })
                .catch((error) => console.log(error));
                */
            } else if (json.games[i].white.username === "bubbasparx666") {
              let rating = json.games[i].white.rating; // game rating
              //add to database
              try {
                Axios.post("http://localhost:3001/addChess", {
                  rating: rating,
                  timestamp: timestamp,
                  date: dateOutput,
                });
              } catch (err) {
                console.log(err);
              }
              /*
              
              Axios.post("http://localhost:3001/addChess", {
                rating: rating,
                timestamp: timestamp,
                date: dateOutput,
              })
                .then(() => {
                  console.log("success");
                })
                .catch((error) => console.log(error));
                */
            }
          }
        }
      })
      .catch((err) => console.log(err));
  }

  //calculate Chess Score for daily performance metric
  async function getChessScore() {
    Axios.get("http://localhost:3001/chessScore").then((response) => {
      setChessScore(response.data);
      console.log("score" + response.data);
    });
  }

  //get previous entry dates to prevent duplicate entry
  const getEntryDates = () => {
    Axios.get("http://localhost:3001/getEntryDates").then((response) => {
      setEntryDates(response.data);
    });
  };

  // add user inputs to database
  const addEntry = () => {
    let entryFound = false;
    getEntryDates();
    //check if entry has already been made to prevent duplicate
    entryDates.forEach((key) => {
      if (key.DATE === checkDate) {
        //console.log(key.DATE);
        //console.log("found");
        entryFound = true;
        previousEntryAlert();
        //alert(`Today's entry has already been made, try again tomorrow`);
        return;
      }
    });
    if (!entryFound) {
      //add user entries to database
      Axios.post("http://localhost:3001/inputData", {
        mood: mood,
        sleep: sleep,
        alcohol: alcohol,
        coffee: coffee,
        vitamin: vitamin,
        exercise: exercise,
        chessScore: chessScore,
      }).then(() => {
        //alert(`Entry has been logged!`);
        entryAlert();
      });
    }
  };

  const entryAlert = () => {
    let popup = document.getElementById("alert");
    popup.classList.add("active");
    //overlay.classList.add("active");
  };

  const previousEntryAlert = () => {
    let popup = document.getElementById("previousEntry");
    popup.classList.add("active");
    //overlay.classList.add("active");
  };

  const closeAlert = () => {
    let popup = document.getElementById("alert");
    popup.classList.remove("active");
    overlay.classList.remove("active");
  };

  const closePrevious = () => {
    let popup = document.getElementById("previousEntry");
    popup.classList.remove("active");
    overlay.classList.remove("active");
  };

  //get summary results from database
  const getResults = () => {
    Axios.get("http://localhost:3001/feelWorst").then((response) => {
      setFeelWorst(response.data[0]);
    });
    Axios.get("http://localhost:3001/feelBest").then((response) => {
      setFeelBest(response.data[0]);
    });
    Axios.get("http://localhost:3001/performWorst").then((response) => {
      setPerformWorst(response.data[0]);
    });
    Axios.get("http://localhost:3001/performBest").then((response) => {
      setPerformBest(response.data[0]);
    });
    //setShow(true); //make results visible to user
  };

  //functions to display results popup
  const openResults = document.querySelectorAll("[data-modal-target]");
  const closeResults = document.querySelectorAll("[data-close-button]");
  const overlay = document.getElementById("overlay");

  openResults.forEach((button) => {
    button.addEventListener("click", () => {
      const modal = document.querySelector(button.dataset.modalTarget);
      openModal(modal);
    });
  });

  closeResults.forEach((button) => {
    button.addEventListener("click", () => {
      const modal = button.closest(".results");
      closeModal(modal);
    });
  });

  function openModal(modal) {
    if (modal == null) return;
    modal.classList.add("active");
    overlay.classList.add("active");
  }

  function closeModal(modal) {
    if (modal == null) return;
    modal.classList.remove("active");
    overlay.classList.remove("active");
  }

  return (
    <div className="App">
      <div className="information">
        <div className="header">
          <h1 className="primary">My Big Mood</h1>
          <div className="signature">
            <p>Ben Brickey 2023</p>
            <a href="mailto:benjaminbrickeyiii@gmail.com">
              benjaminbrickeyiii@gmail.com
            </a>
          </div>
        </div>
        <div className="description"> 
          Please
          record your health metrics in the form below and click on
          "Results" to view the habits that are positively influencing your mood
          and performance. Your performance in daily chess games on Chess.com
          will be measured by comparing your score to the previous day's score.
        </div>
        <div className="form">
          <h2>Entry for {displayDate}</h2>
          <div className="formItem">
            <label>How do you feel today? </label>
            <select
              name="moods"
              id="moods"
              onChange={(event) => {
                setMood(event.target.value);
              }}
            >
              <option value="1">🙁</option>
              <option value="2">😐</option>
              <option value="3">😃</option>
            </select>
          </div>
          <div className="formItem">
            <label>How many hours did you sleep last night? </label>
            <input
              type="number"
              name="sleep"
              min="0"
              onChange={(event) => {
                setSleep(event.target.value);
              }}
            />
          </div>
          <div className="formItem">
            <label>How many drinks did you have yesterday? </label>
            <input
              type="number"
              min="0"
              onChange={(event) => {
                setAlcohol(event.target.value);
              }}
            />
          </div>
          <div className="formItem">
            <label>How many cups of coffee did you have yesterday? </label>
            <input
              type="number"
              min="0"
              onChange={(event) => {
                setCoffee(event.target.value);
              }}
            />
          </div>
          <div className="formItem">
            <label>Did you take your multivitamin? </label>
            <select
              name="vitamin"
              id="vitamin"
              onChange={(event) => {
                setVitamin(event.target.value);
              }}
            >
              <option value="0">No</option>
              <option value="1">Yes</option>
            </select>
          </div>
          <div className="formItem">
            <label>Did you exercise? </label>
            <select
              name="exercise"
              id="exercise"
              onChange={(event) => {
                setExercise(event.target.value);
              }}
            >
              <option value="0">No</option>
              <option value="1">Yes</option>
            </select>
          </div>
          <div className="pushButton">
            <button onClick={addEntry}>Submit</button>
            <div className="alert" id="alert">
              <h1>Entry successfully submitted!</h1>
              <button onClick={closeAlert} className="closeButton">
                OK
              </button>
            </div>
            <div className="alert" id="previousEntry">
              <h1>
                Today's entry has already been submitted, please try again
                tomorrow!
              </h1>
              <button onClick={closePrevious} className="closeButton">
                OK
              </button>
            </div>
            <button data-modal-target="#results" onClick={getResults}>
              Results
            </button>
          </div>
        </div>

        <div>
          {/*
      <button onClick = {getResults}>Show Results</button>
        {show?<div  className = "results">
          <Results feelWorst = {feelWorst} feelBest = {feelBest}
          performWorst = {performWorst} performBest = {performBest}/>
          <button class = "closeButton">Close Results</button>
      </div>:null}
      */}
          <div className="results" id="results">
            <Results
              feelWorst={feelWorst}
              feelBest={feelBest}
              performWorst={performWorst}
              performBest={performBest}
            />
            <button data-close-button className="closeButton">
              Close Results
            </button>
          </div>
        </div>
      </div>
      <div id="overlay"></div>
    </div>
  );
}

export default App;
