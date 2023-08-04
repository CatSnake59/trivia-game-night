import React, {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";

const Timer = ({points}) => {
  const navigate = useNavigate();

  // state variables
  const [timer, setTimer ] = useState(20);
  const [pointsRemaining, setPoints] = useState(points);

  // set timer
  useEffect(() => {
    let interval;
  
    interval = setInterval(() => {
        setTimer((seconds) => {
            if (seconds === 0) {
              navigate('/')
            }
        setPoints((prev) => prev - 50);
        return seconds - 1;
    }) 
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <>
      <div className="timer">
        TIME REMAINING: {timer} 
      </div> 
    </>
  )
}

export default Timer;