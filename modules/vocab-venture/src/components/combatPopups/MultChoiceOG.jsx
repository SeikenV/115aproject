// import { useNavigate } from 'react-router-dom/dist';
// import { useNavigate } from 'react-router-dom';

import './MultChoice.css';
import './Quiz.css';




// import { useLocation } from 'react-router-dom';
import { useNavigate, useLocation } from 'react-router-dom';

import React, { useState, useEffect } from 'react';
// import React, { useState } from 'react';

import blue from '../../assets/dict-images/colors/blue.png';
import black from '../../assets/dict-images/colors/black.png';
import brown from '../../assets/dict-images/colors/brown.png';
import green from '../../assets/dict-images/colors/green.png';
import orange from '../../assets/dict-images/colors/orange.png';
import red from '../../assets/dict-images/colors/red.png';
import white from '../../assets/dict-images/colors/white.png';
import yellow from '../../assets/dict-images/colors/yellow.png';

import apple from '../../assets/dict-images/food/Apple.png';
import bread from '../../assets/dict-images/food/Bread.png';
import egg from '../../assets/dict-images/food/Eggs.png';
import fish from '../../assets/dict-images/food/Fish.png';
import juice from '../../assets/dict-images/food/Juice.png';
import meat from '../../assets/dict-images/food/Meat.png';
import milk from '../../assets/dict-images/food/Milk.png';
import water from '../../assets/dict-images/food/Water.png';


import shirt from '../../assets/dict-images/clothing/shirt.png';
import hat from '../../assets/dict-images/clothing/hat.png';
import skirt from '../../assets/dict-images/clothing/skirt.png';
import jacket from '../../assets/dict-images/clothing/jacket.png';
import socks from '../../assets/dict-images/clothing/socks.png';
import shoes from '../../assets/dict-images/clothing/shoes.png';
import gloves from '../../assets/dict-images/clothing/gloves.png';
import pants from '../../assets/dict-images/clothing/pants.png';

import desk from '../../assets/dict-images/school/desk.png'
import paper from '../../assets/dict-images/school/paper.png'
import pencil from '../../assets/dict-images/school/pencil.png'
import pen from '../../assets/dict-images/school/pen.png'
import student from '../../assets/dict-images/school/student.png'
import teacher from '../../assets/dict-images/school/teacher.png'
import classroom from '../../assets/dict-images/school/classroom.png'
import book from '../../assets/dict-images/school/book.png'


const getWordImageSrc = (wordImage) => {
  switch (wordImage) {
      case 'black':
          return black;
      case 'blue':
          return blue;
      case 'brown':
          return brown;
      case 'red':
          return red;
      case 'yellow':
          return yellow;
      case 'green':
          return green;
      case 'white':
          return white;
      case 'orange':
          return orange;
      case 'apple':
        return apple;
      case 'bread':
          return bread;
      case 'egg':
          return egg;
      case 'fish':
          return fish;
      case 'juice':
          return juice;
      case 'meat':
          return meat;
      case 'milk':
          return milk;
      case 'water':
          return water;
      case 'shirt':
            return shirt;
      case 'pants':
            return pants;
      case 'socks':
            return socks;
      case 'jacket':
            return jacket;
      case 'shoes':
            return shoes;
      case 'hat':
            return hat;
      case 'gloves':
            return gloves;
      case 'skirt':
            return skirt;
      case 'desk':
        return desk;
      case 'pencil':
        return pencil;
      case 'pen':
        return pen;
      case 'classroom':
        return classroom;
      case 'teacher':
        return teacher;
      case 'student':
        return student;
      case 'paper':
        return paper;
      case 'book':
        return book;
      default:
          return null;
  }
};





/**
 * Multiple Choice Question Component.
 * 
 * @param {object} props - The props for the component.
 * @param {string} props.questionType - The type of question.
 */
const MultChoiceOG = ({ questionType }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const username = location.state.username;
    const selectedlanguage = location.state.language;
    const difficulty = location.state.difficulty;

    /**
     * Get the initial timer based on the difficulty level.
     * 
     * @param {string} difficulty - The difficulty level.
     * @returns {number} The initial timer value.
     */
    const getInitialTimer = (difficulty) => {
        switch (difficulty) {
            case 'easy':
                return 15; // Set timer to 15 seconds for easy difficulty
            case 'medium':
                return 10; // Set timer to 10 seconds for medium difficulty
            case 'hard':
                return 5; // Set timer to 5 seconds for hard difficulty
            default:
                return 10; // Default to 10 seconds
        }
    };

    /**
     * Navigate to the map page.
     */
    const goToMap = () => {
        navigate('/map', { state: { username, language: selectedlanguage } });
    };

    // State variables
    const [currentWord, setCurrentWord] = useState(null);
    const [correctMessage, setCorrectMessage] = useState("");
    const [timer, setTimer] = useState(getInitialTimer(difficulty));
    const [nextWord, getNextWord] = useState(false);

    /**
     * Fetch a new question word and its multiple-choice options.
     */
    const fetchQuestion = async () => {
        try {
            const questionWord = await gameClient.getQuestionWord(username, selectedlanguage, 1);
            if (questionWord) {
                const [correctIndex, choices] = await gameClient.getMultipleChoice(username, selectedlanguage, questionWord);
                setCurrentWord({ english: questionWord, correctIndex, choices });
            }
        } catch (error) {
            console.error('Error fetching question word:', error);
        }
    };

    // Fetch question when component mounts or when nextWord changes
    useEffect(() => {
        fetchQuestion();
    }, [nextWord, username, selectedlanguage]);

    /**
     * Handle the click event for a word choice.
     * 
     * @param {string} clickedWord - The word that was clicked.
     */
    const handleEnterClick = async (clickedWord) => {
        const initialTimer = getInitialTimer(difficulty);
        const { english, correctIndex, choices } = currentWord;
        const correctWord = choices[correctIndex];

        if (clickedWord === correctWord) {
            setCorrectMessage("Correct!");
            getNextWord(!nextWord);
            setTimeout(() => {
                setCorrectMessage(""); // Reset message
                setTimer(initialTimer); // Reset timer to initial value
            }, 1000);
        } else {
            setCorrectMessage("Try again!");
            setTimeout(() => {
                setCorrectMessage(""); // Reset message
            }, 500);
            await gameClient.upProficiency(username, selectedlanguage, english);
            setTimer(initialTimer);
        }
    };

    // Timer countdown logic
    useEffect(() => {
        const interval = setInterval(() => {
            setTimer((prevTimer) => {
                if (prevTimer > 0 && !correctMessage) {
                    return prevTimer - 1;
                } else if (prevTimer > 0 && correctMessage) {
                    return prevTimer;
                } else {
                    clearInterval(interval); // Stop the interval
                    setTimeout(() => {
                        gameClient.downProficiency(username, selectedlanguage, currentWord.english); // Call downProficiency()
                        setTimer(getInitialTimer(difficulty)); // Reset timer to initial value
                        setCorrectMessage("Time Out!");
                    }, 2000);
                    return 0; // Set timer to 0 to display "Time is up!"
                }
            });
        }, 1000); // Update timer every second

        // Clean up interval on component unmount
        return () => clearInterval(interval);
    }, [currentWord, correctMessage, difficulty, username, selectedlanguage]);

    return (
            <div className="mc-container">
                <div className="timer">
                <h1>Timer: {timer === 0 ? "Time is up!" : timer}</h1>
            </div>
                
                {currentWord && (
                    <div className="mcCONTENT">
                        <div key={currentWord.english} className="mc-word-container">
                            <div className="mc-image-container">
                                {getWordImageSrc(currentWord.english) && (
                                    <img
                                        id="mc-image"
                                        src={getWordImageSrc(currentWord.english)}
                                        alt={currentWord.english}
                                    />
                                )}
                            </div>
                            <div className="mc-word-info">
                                <h1 >English: {currentWord.english}</h1>
                            </div>
                            <div className="mc-buttons">
                                {currentWord.choices.map((choice, index) => (
                                    <button key={`${choice}-${index}`} className="mc-button" onClick={() => handleEnterClick(choice)}>
                                        {choice}
                                    </button>
                                ))}
                            
                            </div>
                        </div>
                    </div>

                )}
                {correctMessage && (
                <div className="message-display">
                    <p>{correctMessage}</p>
                </div>
                )}
              
                <button type="button" id="goToMapButton" onClick={goToMap}> Go to Map</button>
            </div>
    );
};

export default MultChoiceOG;