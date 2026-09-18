// import { useNavigate } from 'react-router-dom/dist';
// import { useNavigate } from 'react-router-dom';


import './MultChoice.css';




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
 * Multiple Choice Popup Component.
 * 
 * @param {object} props - The props for the component.
 * @param {boolean} props.trigger - Boolean to trigger the popup.
 * @param {string} props.wordToShow - The word to show in the popup.
 * @param {array} props.wordGroup - Array of words to choose from.
 * @param {function} props.setIsAnswerCorrect - Function to set if the answer is correct.
 * @param {function} props.setIsQuestionDone - Function to set if the question is done.
 * @param {function} props.setIsAttacking - Function to set if the user is attacking.
 * @param {function} props.setIsSlimeHit - Function to set if the slime is hit.
 * @param {function} props.setCorrectCounter - Function to increment the correct counter.
 * @param {function} props.setIsSlimeAttacking - Function to set if the slime is attacking.
 * @param {function} props.setIsHit - Function to set if the user is hit.
 * @param {function} props.setWrongCounter - Function to increment the wrong counter.
 */
const MultChoice = (props) => {
    const navigate = useNavigate();
    const location = useLocation();
    const username = location.state.username;
    const selectedlanguage = location.state.language;

    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [translatedWord, setTranslatedWord] = useState([]);
    const [multChoiceOptions, setMultChoiceOptions] = useState([]);
    const [userDictionary, setUserDictionary] = useState([]);
    const [userChoice, setUserChoice] = useState("");
    const [textInput, setTextInput] = useState(""); 
    const [wordChoices, setWordChoices] = useState([]);

    /**
     * Navigate to the map page.
     */
    const goToMap = () => {
        navigate('/map', { state: { username, language: selectedlanguage } });
    };

    /**
     * Get the user's dictionary data.
     * 
     * @param {string} username - The username to get the dictionary for.
     * @param {string} language - The language to get the dictionary for.
     * @returns {Promise<Object>} The user's dictionary data.
     */
    const getTheUserInformation = async (username, language) => {
        try {
            const result = await gameClient.getUserDictionary(username, language);
            return result;
        } catch (error) {
            return { status: 'error', message: 'An error occurred during login. Please try again.' };
        }
    };

    // Fetch the user dictionary data when the component mounts
    useEffect(() => {
        const fetchData = async () => {
            const result = await getTheUserInformation(props.username, selectedlanguage);
            setUserDictionary(Object.keys(result));
        };
        fetchData();
    }, [props.username, selectedlanguage]);

    // Fetch the translations for the multiple-choice options
    useEffect(() => {
        if(props.wordGroup != null){
                setWordChoices(props.wordGroup);
        }
    }, [props.wordGroup, username, selectedlanguage]);

    /**
     * Handle the click event for a word choice.
     * 
     * @param {string} clickedWord - The word that was clicked.
     */
    const handleEnterClick = async (clickedWord) => {
        let correctWord = props.wordToShow;
        const translation = await gameClient.getTranslation(username, selectedlanguage, correctWord);
        console.log("ENGLISH", correctWord);
        console.log("correct answer:", translation);
        console.log("CLICKED", clickedWord);
        if (clickedWord === translation) {
            props.setIsAnswerCorrect(true);
            props.setIsQuestionDone(true);
            setTimeout(() => {
                props.setIsAttacking(true);
                setTimeout(() => {
                    props.setIsSlimeHit(true);
                }, 600);
            }, 1000);
            props.setTrigger(false);
            gameClient.downProficiency(username, selectedlanguage, correctWord);
            props.setCorrectCounter((prevCount) => prevCount + 1);
        } else {
            props.setTrigger(false);
            props.setIsAnswerCorrect(false);
            props.setIsQuestionDone(true);
            setTimeout(() => {
                props.setIsSlimeAttacking(true);
                setTimeout(() => {
                    props.setIsHit(true);
                }, 600);
            }, 1000);
            gameClient.upProficiency(username, selectedlanguage, correctWord);

            props.setWrongCounter((prevCount) => prevCount + 1);
        }
        setTextInput("");
    };

    return (props.trigger) ? (
        <div className="mc-container">
            <div className="mcCONTENT">
                <div className="mc-word-container">
                    <div className="mc-image-container">
                        {getWordImageSrc(props.wordToShow) && (
                            <img
                                id="mc-image"
                                src={getWordImageSrc(props.wordToShow)}
                                alt={props.wordToShow}
                            />
                        )}
                    </div>
                    <div className="mc-word-info">
                        <h1>English: {props.wordToShow}</h1>
                    </div>
                    <div className="mc-buttons">
                        {wordChoices.map((choice, index) => (
                            <button key={index} className="mc-button" onClick={() => handleEnterClick(choice)}>
                                {choice}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
            <button type="button" id="goToMapButton" onClick={goToMap}> Go to Map</button>
        </div>
    ) : "";
};

export default MultChoice;


