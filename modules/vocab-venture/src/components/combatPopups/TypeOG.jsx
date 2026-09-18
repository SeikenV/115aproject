
import './Type.css';
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
// import { useLocation } from 'react-router-dom';
import { useNavigate, useLocation } from 'react-router-dom';

import React, { useState, useEffect } from 'react';
// import React, { useState } from 'react';



const TypeOG = function() {

//   const { selectedLanguage } = props;



    const navigate = useNavigate(); 

    const location = useLocation();
    const username = location.state.username;
    const selectedlanguage = location.state.language;

    const difficulty = location.state.difficulty;
  
    console.log("DIFFICULTY", difficulty);
    
    const goToMap = () => {
        navigate('/map', { state: { username, language: selectedlanguage } });
    };

    const [chosenWords, setChosenWords] = useState([]);
    const [fetchedWords, setFetchedWords] = useState([]);
    const [seenWords, setSeenWords] = useState([]);
    const [unseenWords, setUnseenWords] = useState([]);
    const [texts, setTexts] = useState([]);
    const [promptTrigger, setPromptTrigger] = useState(false);
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [translatedWord, setTranslatedWord] = useState('');



  const [translations, setTranslations] = useState({});


  const [correctMessage, setCorrectMessage] = useState(""); // Define the state for displaying the message


    
    // the user's dictionary 
    const [userDictionary, setUserDictionary] = useState([]);



    //if the user should see new words or practice old ones 
    const [userChoice, setUserChoice] = useState("");

    const [textInput, setTextInput] = useState(""); 


    const [isLastWordCorrect, setIsLastWordCorrect] = useState(true); // Track if the last entered word was correct



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


    const initialTimer = getInitialTimer(difficulty); // Calculate initial timer value outside the useEffect hook

    const [timer, setTimer] = useState(initialTimer); // Initial timer value in seconds

    
    const getTheUserInformation = async (username, language) => {
        try {
            const result = await gameClient.getUserDictionary(username, language);
            return result;
        } catch (error) {
            return { status: 'error', message: 'An error occurred during login. Please try again.' };
        }
      }

      useEffect(() => {
        const fetchData = async () => {
            try {
                console.log(username, selectedlanguage);
                const result = await getTheUserInformation(username, selectedlanguage);
                if (!result) {
                    console.error('User dictionary is empty or undefined.');
                    return;
                }

                console.log("result", result);


                // Shuffle the entries (key-value pairs) in the dictionary
                const shuffledEntries = Object.entries(result).sort(() => Math.random() - 0.5);
                const shuffledDictionary = Object.fromEntries(shuffledEntries);

                console.log("shuffledDictionary", shuffledDictionary);

    
                setUserDictionary(shuffledDictionary);
            } catch (error) {
                console.error('An error occurred while fetching user information:', error);
            }
        };
        fetchData();
    }, [username, selectedlanguage]);


    // const [englishword, setEnglishWord] = useState('');

    let englishword = Object.keys(userDictionary)[currentWordIndex];

    const showNextWord = () => {
        if (currentWordIndex < Object.keys(userDictionary).length - 1) {
            setCurrentWordIndex(currentWordIndex + 1);
            englishword = Object.keys(userDictionary)[currentWordIndex + 1];
            console.log("englishword", englishword);
        }
    };
    
    const handleInputChange = (event) => {
        const newValue = event.target.value;
        setTextInput(newValue); // Update the text input value as the user types
        // console.log(newValue);
    };

    const handleKeyPress = (e) =>{
        if(e.key === 'Enter'){
            handleEnterClick(englishword);
        }
    }

   const randomizeWords = (array) =>{
        // Create a copy of the array
        const shuffledArray = array.slice();
        // Shuffle the copy
        for (let i = shuffledArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
        }
        // Update state with the shuffled array
        setChosenWords(shuffledArray);
        console.log("shuffled words: ", shuffledArray);
    }



    const handleEnterClick = async (key) => {
        

        console.log(textInput);
        console.log("key", key);
        const initialTimer = getInitialTimer(difficulty);

        const translation = await gameClient.getTranslation(username, selectedlanguage, key);
        console.log("translationnnn", translation);
        console.log("keyyy", translation[key]);

        if (translation) {
            setTranslatedWord(translation[key]);
        }

        if (textInput.toLowerCase() === translation.toLowerCase()) {
            // showNextWord();
            // setIsLastWordCorrect(true); // Set the state to true if the word is correct
            // console.log("page", currentWordIndex);
            // upProficiency(username, selectedlanguage, key);
            // setTimer(10); // Reset the timer to 10 seconds
            // await gameClient.upProficiency(username, selectedlanguage, key);

            // console.log("correct");
            setCorrectMessage("Correct!");
            setTimeout(() => {
                // showNextWord();
                setCorrectMessage("");
            }, 1500);
            setIsLastWordCorrect(true);


            // Wait 2 seconds before moving to the next word
            setTimeout(() => {
                showNextWord();
                gameClient.downProficiency(username, selectedlanguage, englishword); // Call downProficiency()
                setTimer(initialTimer); // Reset timer to initial value
            }, 2000);
        } else {
            console.log("Incorrect word. Try again!");
            setCorrectMessage("Try again!");
            setTimeout(() => {
                setCorrectMessage("");
            }, 1500);
            setIsLastWordCorrect(false); // Set the state to false if the word is incorrect
            await gameClient.downProficiency(username, selectedlanguage, key);
            setTimer(initialTimer);
        }
    
        setTextInput(""); // Clear the text input after checking
    };

    console.log("page", currentWordIndex);





    useEffect(() => {
        const initialTimer = getInitialTimer(difficulty);
        console.log("NEW TIMERRR", initialTimer);
        const interval = setInterval(() => {
            setTimer((prevTimer) => {
                if (prevTimer > 0 && !correctMessage) {
                    return prevTimer - 1;
                } 
                else if (prevTimer > 0 && correctMessage) {
                    return prevTimer;
                } else {
                    // Timer expired
                    clearInterval(interval); // Stop the interval
                    setTimeout(() => {
                        showNextWord(); // Move to the next word after 2 seconds
                        gameClient.downProficiency(username, selectedlanguage, englishword); // Call downProficiency()
                        setTimer(initialTimer); // Reset timer to initial value
                    }, 2000);
                    return 0; // Set timer to 0 to display "Time is up!"
                }
            });
        }, 1000); // Update timer every second
    
        // Clean up interval on component unmount
        return () => clearInterval(interval);
    }, [currentWordIndex, showNextWord, username, selectedlanguage, englishword, correctMessage, difficulty, initialTimer]); // Re-run effect when necessary dependencies change


    
    return(  

        <div className = "type-container">
            <div className="textdiv">
                <input
                    type="text"
                    className="learnInputBox"
                    placeholder="text"
                    value={textInput}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    autoFocus
                />
            </div>
            <div className='timer'>
                <h1>Timer: {timer === 0 ? "Time is up!" : timer}</h1>
            </div>

                
            {correctMessage && (
                <div className="message-display">
                    <p>{correctMessage}</p>
                </div>
            )}


            <div className = "typeCONTENT" >
              {userDictionary &&
                    Object.entries(userDictionary).map(([key, value], index) => {
                        // englishword = key;
                        if (index === currentWordIndex)
                        return (
                          
                          <div key={key} className="type-word-container">
                            
                            
                              <div className="type-image-container">
                                {getWordImageSrc(key) && (
                                  <img
                                    id="type-image"
                                    src={getWordImageSrc(key)}
                                    alt={key}
                                  />
                                )}
                              </div>

                              <div className="type-word-info">
                                <h1 >English: {key}</h1>
                                </div>

                            {/* <button type="button" style={{ position: 'fixed'}} id="enterbutton" onClick={() => handleEnterClick(key)}>
                                Enter
                            </button> */}
                            
                        </div>
                        );
                      
                      return null;
                    })}
              </div>

                

            
            <button type="button"  id="enterbutton" onClick={() => handleEnterClick(englishword)}>
                Enter
            </button>


            <button type="button" id="goToMapButton" onClick={goToMap}> Go to Map</button>
            
                
        </div>
    
     );
};

export default TypeOG;


