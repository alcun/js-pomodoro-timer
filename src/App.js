import "./App.scss";
import React, { useState, useEffect, useRef } from "react";
import { FaPlay, FaPause, FaUndo, FaPlus, FaMinus } from "react-icons/fa";

const App = () => {
  const [breakLength, setBreakLength] = React.useState(5);
  const [sessionLength, setSessionLength] = React.useState(25);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [timingType, setTimingType] = React.useState("Session");
  const [timeLeft, setTimeLeft] = React.useState(1500);
  const audioElement = useRef(null);
  let loop = undefined;

  // format time to correct output
  const timeFormatter = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft - minutes * 60;
    const formattedSeconds = seconds < 10 ? "0" + seconds : seconds;
    const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
    return `${formattedMinutes}:${formattedSeconds}`;
  };

  //return percent of session/break completed for progress bar
  const progessPercent = () => {
    if (timingType === "Session") {
      let timeElapsed = sessionLength * 60 - timeLeft;
      return Math.round((timeElapsed / (sessionLength * 60)) * 100);
    } else {
      let timeElapsed = breakLength * 60 - timeLeft;
      return Math.round((timeElapsed / (breakLength * 60)) * 100);
    }
  };

  //toggle our playing status for onClick
  const handlePlay = () => {
    setIsPlaying(!isPlaying);
  };

  //set interval timing function and play audio + switch timing type at 0
  useEffect(() => {
    if (isPlaying && timeLeft > 0) {
      const interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (timeLeft === 0) {
      audioElement.current.play();
      audioElement.current.currentTime = 0;

      if (timingType === "Session") {
        setTimeLeft(breakLength * 60);
        setTimingType("Break");
      }

      if (timingType === "Break") {
        setTimeLeft(sessionLength * 60);
        setTimingType("Session");
      }
    }
  }, [breakLength, sessionLength, timeLeft, timingType, isPlaying]);

  //handle break/session increase/decrease

  const handleBreakIncrease = () => {
    if (breakLength < 60) {
      setBreakLength(breakLength + 1);
    }
  };

  const handleBreakDecrease = () => {
    if (breakLength > 1) {
      setBreakLength(breakLength - 1);
    }
  };

  const handleSessionIncrease = () => {
    if (sessionLength < 60) {
      setSessionLength(sessionLength + 1);
      setTimeLeft(timeLeft + 60);
    }
  };

  const handleSessionDecrease = () => {
    if (sessionLength > 1) {
      setSessionLength(sessionLength - 1);
      setTimeLeft(timeLeft - 60);
    }
  };

  //handle reset button - set to initial state and stop play

  const handleReset = () => {
    setBreakLength(5);
    setSessionLength(25);
    setTimeLeft(1500);
    setTimingType("Session");
    setIsPlaying(false);
    clearInterval(loop);
    audioElement.current.load();
  };

  //set appropriate timing type and display as {title}

  const title = timingType === "Session" ? "Session" : "Break";

  const updateProgressBar = (progressBar, progessPercent) => {
    progressBar.querySelector(
      ".progressFill"
    ).style.width = `${progessPercent()}%`;
  };

  return (
    <main className="App">
      <div className="wrapper container">
        <img id="pomImg" src={require("./tom.png")} />
        <br /> <br />
        <div className="break-session-length row">
          <div className="col breakBox">
            <h3 id="break-label">Break</h3>
            <div>
              <button
              className="incBtn"
                disabled={isPlaying}
                onClick={handleBreakDecrease}
                id="break-decrement"
              >
                <FaMinus/>
              </button>
              <strong id="break-length">{breakLength}</strong>
              <button
              className="incBtn"
                disabled={isPlaying}
                onClick={handleBreakIncrease}
                id="break-increment"
              >
                <FaPlus/>
              </button>
            </div>
          </div>
          <div className="col breakBox">
            <h3 id="session-label">Session</h3>
            <div>
              <button
              className="incBtn"
                disabled={isPlaying}
                onClick={handleSessionDecrease}
                id="session-decrement"
              >
                <FaMinus/>
              </button>
              <strong id="session-length">{sessionLength}</strong>
              <button
              className="incBtn"
                disabled={isPlaying}
                onClick={handleSessionIncrease}
                id="session-increment"
              >
                <FaPlus/>
              </button>
            </div>
          </div>
        </div>
        <br /> <br />
        <div className="timer-wrapper ">
          <div className="timer ">
            <h3 id="timer-label">{title} </h3>
            <h2 id="time-left">{timeFormatter()}</h2>
          </div>
          <br /> 
          <div className="progress">
            <div
              className="progressFill"
              style={{ width: progessPercent() * 3 }}
            ></div>
            <span className="progressText"></span>
          </div>
        </div>
        <br /> <br />
        <div className="btns">
          <button onClick={handlePlay} id="start_stop">
            <FaPlay /> / <FaPause />
          </button>
          <button onClick={handleReset} id="reset">
            <FaUndo />
          </button>
          <br />
        </div>
      </div>
      <footer>
        © 2022-
        <a href="https://alcun.github.io/Alcun-Personal-Portfolio/">alcun</a>
      </footer>
      <audio
        id="beep"
        preload="auto"
        src={require("./beep.mp3")}
        ref={audioElement}
      />
    </main>
  );
};

export default App;
