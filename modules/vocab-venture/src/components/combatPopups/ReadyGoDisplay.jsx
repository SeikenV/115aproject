import React, { useState, useEffect } from 'react';
import "./Quiz.css"
const ReadyGoDisplay = (props) => {
    const words = ['READY?', 'GO!'];
    const [currentIndex, setCurrentIndex] = useState(0);
  
    useEffect(() => {
        console.log("CURRE INDEX = ", currentIndex);
      const interval = setInterval(() => {
        if(currentIndex < 2 && props.trigger){
            setCurrentIndex(prevIndex => (prevIndex + 1));
        }
       
      }, 1400);
      
      const delayedStop = () => {
        props.setReadyGo(false);
      };

      const delay = setTimeout(delayedStop, 2800);


      return () => {clearInterval(interval); 
                    clearTimeout(delay)};
    }, [props.trigger]);
  
    return (props.trigger) ? (
        
        <div className= "ready-go-display">
        <h1>{words[currentIndex]}</h1>
        </div>
    ):"";
  };
  export default ReadyGoDisplay;