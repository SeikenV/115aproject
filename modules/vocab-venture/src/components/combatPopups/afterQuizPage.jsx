
import './afterQuizPage.css';
// import { useLocation } from 'react-router-dom';
import { useNavigate, useLocation } from 'react-router-dom';

import React, { useState, useEffect } from 'react';

import cat from '../../assets/outskirts-assets/testSS.png';


import pageleft from '../../assets/dictionary-assets/DictPageLeft.png'

const afterQuizPage = () => {

    const navigate = useNavigate(); 
    const location = useLocation();
    const username = location.state.username;
    const selectedlanguage = location.state.selectedlanguage
    const [correctCounter, setCorrectCounter] = useState(location.state.beforeCorrectCounter);
    const [wrongCounter, setWrongCounter] = useState(location.state.beforeWrongCounter);



    const goToMap = () => {
        navigate('/map', { state: { username, language: selectedlanguage } });
    };


    const goToQuiz = () => {
        navigate('/quiz', { state: { username, language: selectedlanguage } });
    };


    return(  
        <div className="after-quiz-page">

            <div className = "SpriteAFTER"> {<img className= "catSS" src= {cat} ></img>} 
            </div>
            
            <button type="button" id="goToMapButton" onClick={goToMap}>Go to Map</button>
            <div className="page-content">
                <div className="score-header">
                    <h1>Your Score Report:</h1>
                </div>
                
                <img src={pageleft} alt="Page Left" className="page-image" />

                <div className="score-container">
                    <h2>Number of Questions Correct: {correctCounter}</h2><br></br>
                    <h2>Number of Questions Wrong: {wrongCounter}</h2>
                </div>
            </div>
            <div className="quiz-button-container">
                <button type="button" id="goToQuiz" onClick={goToQuiz}>Play Again</button>
            </div>


        </div>
    
     );
};

export default afterQuizPage;


