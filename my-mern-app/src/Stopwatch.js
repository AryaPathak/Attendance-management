import React, { useState, useEffect, useRef } from 'react';

import './Stopwatch.css';

const Stopwatch = () => {
  // eslint-disable-next-line no-unused-vars
  const email = localStorage.getItem('userEmail');
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [time, setTime] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isRunning && !isFinished) {
      intervalRef.current = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning, isFinished]);

  const startStopwatch = () => {
    if (isFinished) {
      return;
    }

    setIsRunning(!isRunning);
  };
  

  // const finishWork = () => {
  //   // clearInterval(intervalRef.current);
  //   // setIsFinished(true);
  //   // setIsRunning(false);

  //   clearInterval(intervalRef.current);
  //   setIsRunning(false);

  //   // Show a confirmation dialog
  //   const shouldFinish = window.confirm('Are you sure you want to finish work?');

  //   if (shouldFinish) {
      
  //     let finishedTime = time;
  //     const hrs = Math.floor(finishedTime / 3600);
  //     finishedTime -= 3600 * hrs;
  //     const mins = Math.floor(finishedTime / 60);
  //     finishedTime -= 60 * mins;
  //     const secs = finishedTime;

  //     const FinalTime = `Finished work at ${hrs} hours, ${mins} minutes, and ${secs} seconds.`
  //     console.log(FinalTime);

  //     setIsFinished(true);
  //   } else {
  //     // Resume the timer
  //     setIsRunning(true);
  //   }
  // };


  const finishWork = async () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
    
    // Calculate finish time
    let finishedTime = time;
    const hrs = Math.floor(finishedTime / 3600);
    finishedTime -= 3600 * hrs;
    const mins = Math.floor(finishedTime / 60);
    finishedTime -= 60 * mins;
    const secs = finishedTime;
    const workHours = `${hrs} hours, ${mins} minutes, and ${secs} seconds`;

    // eslint-disable-next-line no-unused-vars
    const shouldFinish = window.confirm('Are you sure you want to finish work?');
    

    // Save finish time to the database
    try {
      console.log('before fetch request');
      const response = await fetch('http://127.0.0.1:5000/api/v1/users/finishWork', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: email, workHours: workHours }),
      });

      console.log('After fetch request');
      clearInterval(intervalRef.current);
      if (response.ok) {
        console.log('work time saved successfully.');
      } else {
        const data = await response.json();
        console.error('Error saving work time1:', data.message);
      }
    } catch (error) {
      console.error('Error saving work timeCatch:', error);
    }
  
    setIsFinished(true);
  };
  


  const resetStopwatch = () => {
    clearInterval(intervalRef.current);
    setTime(0);
    setIsRunning(false);
    setIsFinished(false);
  };

  const logOut = () => {
    
    alert("LoggedOut");
    window.location.href = 'http://localhost:3000/login';
  }

  const formattedTime = () => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  return (
    <div className={`stopwatch ${isRunning ? 'running' : ''}`}>
      <h1 className="display">{formattedTime()}</h1>
      <button className="primary-button" onClick={startStopwatch}>
        {isRunning ? 'Pause' : 'Start'}
      </button>
      <button className="secondary-button" onClick={finishWork}>
        🚀 Finish Work
      </button>
      <button className="secondary-button" onClick={logOut}>
        🚪 Log Out
      </button>
      <button
        className={isRunning || isFinished ? 'disabled-button' : 'secondary-button'}
        onClick={resetStopwatch}
        disabled={isRunning || isFinished}
      >
        🔄 Reset
      </button>
    </div>
  );
};
export default Stopwatch;