import "./App.css";

import { React, useEffect, useState } from "react";
import audio from "../src/breakTime.mp3";

function App() {
  const [diplayTime, setDiplayTime] = useState(10);
  const [breakTime, setBreakTime] = useState(3);
  const [sessionTime, setSessionTime] = useState(5);
  const [timerOn, setTimerOn] = useState(false);
  const [onBreak, setOnBreak] = useState(false);
  const [breakAudio, setBreakAudio] = useState(new Audio(audio));

  const playSound = () => {
    breakAudio.currentTime = 0;
    breakAudio.play();
  };

  const formatTime = (time) => {
    let min = Math.floor(time / 60);
    let sec = time % 60;
    return (min < 10 ? "0" + min : min) + ":" + (sec < 10 ? "0" + sec : sec);
  };

  function Length({ title, changeTime, type, time, formatTime }) {
    return (
      <div>
        <h3>{title}</h3>
        <div className="time-sets">
          <button
            className="btn-small deep-purple lighten-2"
            onClick={() => changeTime(-60, type)}
          >
            <i className="material-icons">arrow_downward</i>
          </button>
          <h3>{formatTime(time)}</h3>
          <button
            className="btn-small deep-purple lighten-2"
            onClick={() => changeTime(+60, type)}
          >
            <i className="material-icons">arrow_upward</i>
          </button>
        </div>
      </div>
    );
  }

  const changeTime = (amount, type) => {
    if (type === "break") {
      if (breakTime <= 60 && amount < 0) {
        return;
      }
      setBreakTime((prev) => prev + amount);
    } else {
      if (sessionTime <= 60 && amount < 0) {
        return;
      }
      setSessionTime((prev) => prev + amount);
      if (!timerOn) {
        setDiplayTime(sessionTime + amount);
      }
    }
  };

  const controlTime = () => {
    let second = 1000;
    let date = new Date().getTime();
    let nextDate = new Date().getTime() + second;

    if (!timerOn) {
      let interval = setInterval(() => {
        date = new Date().getTime();
        if (date > nextDate) {
          setDiplayTime((prev) => {
            if (prev <= 0) {
              playSound();
              return onBreak ? breakTime : sessionTime;
            }
            return prev - 1;
          });
          nextDate += second;
        }
      }, 30);
      localStorage.clear();
      localStorage.setItem("interval-id", interval);
    }

    if (timerOn) {
      clearInterval(localStorage.getItem("interval-id"));
    }
    setTimerOn(!timerOn);
  };

  useEffect(() => {
    if (diplayTime === 0) {
      playSound();
      setOnBreak((prevOnBreak) => !prevOnBreak);
      setDiplayTime(onBreak ? sessionTime : breakTime);
    }
  }, [diplayTime, onBreak, breakTime, sessionTime]);

  const resetTime = () => {
    setDiplayTime(25 * 60);
    setBreakTime(5 * 60);
    setSessionTime(25 * 60);
  };

  return (
    <div className="center-align">
      <h1>25 clock </h1>
      <div className="dual-container">
        <Length
          title={"break length"}
          changeTime={changeTime}
          type={"break"}
          time={breakTime}
          formatTime={formatTime}
        />
        <Length
          title={"session length"}
          changeTime={changeTime}
          type={"session"}
          time={sessionTime}
          formatTime={formatTime}
        />
      </div>
      <h3>{onBreak ? "Break" : "Session"}</h3>
      <h1>{formatTime(diplayTime)}</h1>
      <button onClick={controlTime} className="btn-large deep-purple lighten-2">
        {timerOn ? (
          <i className="material-icons">pause_circle_filled</i>
        ) : (
          <i className="material-icons">play_circle_filled</i>
        )}
      </button>
      <button onClick={resetTime} className="btn-large deep-purple lighten-2">
        <i className="material-icons">autorenew</i>
      </button>
    </div>
  );
}

export default App;
