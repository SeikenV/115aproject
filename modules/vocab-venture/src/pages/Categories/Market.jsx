import npcimg from '../../assets/market-assets/ShopOwner.png';
import learnBG from '../../assets/market-assets/Contentbox.png';
import npcTextbox from '../../assets/market-assets/MarketTextbox.png';
import overlayIMG from '../../assets/market-assets/Stall.png';
import bg from '../../assets/market-assets/MarketBG.png';
import './Artist.css';
import './Market.css';

import apple from '../../assets/dict-images/food/Apple.png';
import bread from '../../assets/dict-images/food/Bread.png';
import egg from '../../assets/dict-images/food/Eggs.png';
import fish from '../../assets/dict-images/food/Fish.png';
import juice from '../../assets/dict-images/food/Juice.png';
import meat from '../../assets/dict-images/food/Meat.png';
import milk from '../../assets/dict-images/food/Milk.png';
import water from '../../assets/dict-images/food/Water.png';

import { useNavigate, useLocation } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

const Market = function() {
    const navigate = useNavigate(); 
    const location = useLocation();
    const username = location.state.username;
    const selectedlanguage = location.state.language;

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
    const [definition, setDefinition] = useState('');
    const [userDictionary, setUserDictionary] = useState([]);
    const [currentTextIndex, setCurrentTextIndex] = useState(0);
    const [startClicked, setStartClicked] = useState(false);
    const [userChoice, setUserChoice] = useState("");
    const [textInput, setTextInput] = useState("");
    const [isLastWordCorrect, setIsLastWordCorrect] = useState(true);
    const [congrats, setCongrats] = useState(false);
    //fetches the words from the backend
    useEffect(() => {
        const fetchWords = async () => {
            try {
                const response = await gameClient.getAllWordsByCategory(username, "food");
                const fetchedWords = Object.values(response).flat();

                const fetchedUserDict = await gameClient.getUserDictionary(username, selectedlanguage);
                setUserDictionary(fetchedUserDict || []);
                console.log("Known words: ", fetchedUserDict);

                console.log("Fetched words:", fetchedWords);
                setFetchedWords(fetchedWords || []);

            } catch (error) {
                console.error("Error fetching words:", error);
            }
        };
        fetchWords();
    }, []);
    //retrieves the translation and definition of the words
    useEffect(() => {
        const fetchTranslationAndDefinition = async () => {
            if (currentWordIndex < chosenWords.length) {
                const translation = await gameClient.getTranslation(username, selectedlanguage, chosenWords[currentWordIndex]);
                const definition = await gameClient.getDefinition(username, selectedlanguage, chosenWords[currentWordIndex]);

                if (translation) {
                    setTranslatedWord(translation);
                }
                if (definition) {
                    setDefinition(definition);
                }
            }
        };

        fetchTranslationAndDefinition();
    }, [currentWordIndex, fetchedWords, chosenWords, selectedlanguage, username]);
    //records the seen and unseen words that the user has seen and not seen respectively
    useEffect(() => {
        const recordSeenAndUnseen = () => {
            let unseenTemp = [];
            let seenTemp = [];
            const dictWords = Object.keys(userDictionary);

            for (const categoryWord of Object.values(fetchedWords)) {
                if (dictWords.indexOf(categoryWord) === -1) {
                    unseenTemp.push(categoryWord);
                    console.log("pushed ", categoryWord, " to unseen");
                } else {
                    seenTemp.push(categoryWord);
                    console.log("pushed ", categoryWord, " to seen");
                }
            }
            setUnseenWords(unseenTemp);
            setSeenWords(seenTemp);
        }
        recordSeenAndUnseen();
    }, [fetchedWords, username, selectedlanguage]);
    //allows the user to use enter key on the keyboard as a way of input
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleEnterClick();
        }
    }

    const greetings = {
        'spanish': 'Hola',
        'french': 'Bonjour',
    };

    const greeting = greetings[selectedlanguage] || 'Hello';
    //prompts the user with greetings and choices on whether to learn or practice
    useEffect(() => {
        const decideTextTree = () => {
            let t = [];
            if (unseenWords.length === 0) {
                t = [`${greeting}! Getting some practice in?`];
                setUserChoice("both");
            } else if (unseenWords.length === fetchedWords.length) {
                t = [
                    `${greeting} ${username}!`,
                    "Let me teach you about some food!",
                    "Are you ready?"
                ];
                setUserChoice("learn");
            } else {
                t = [`Welcome back ${username}!`,
                    `Would you like to practice old words, learn new words, or both?`];
                setUserChoice("prompt");
            }
            setTexts(t);
        }
        decideTextTree();
    }, [unseenWords, seenWords, username, selectedlanguage]);
    //shows the next text
    const showNextText = () => {
        if (currentTextIndex < texts.length - 1) {
            setCurrentTextIndex(currentTextIndex + 1);
        }
    };
    //shows the next word
    const showNextWord = () => {
        if (currentWordIndex < chosenWords.length - 1) {
            setCurrentWordIndex(currentWordIndex + 1);
        }
    };
    //allows the user to start by clicking the start key
    const handleStartClick = () => {
        if (currentTextIndex === texts.length - 1) {
            setPromptTrigger(false);
            setStartClicked(true);
        } else if (currentTextIndex === texts.length - 2) {
            console.log("prompt condition check");
            showNextText();
            if (userChoice.localeCompare("prompt") === 0) {
                setPromptTrigger(true);
            }
        } else if (currentTextIndex < texts.length - 1) {
            showNextText();
        }
    };
    //handle the change in input
    const handleInputChange = (event) => {
        const newValue = event.target.value;
        setTextInput(newValue);
    };
    //create randomness by shuffling the array
    const randomizeWords = (array) => {
        const shuffledArray = array.slice();
        for (let i = shuffledArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
        }
        setChosenWords(shuffledArray);
        console.log("shuffled words: ", shuffledArray);
    }

    useEffect(() => {
        if (currentTextIndex > 0) {
            handleStartClick();
        }
    }, [chosenWords])
    //allows to track user change
    useEffect(() => {
        console.log("user choice changed: ", userChoice);
        if (userChoice.localeCompare("practice") === 0) {
            randomizeWords(seenWords);
        } else if (userChoice.localeCompare("learn") === 0) {
            randomizeWords(unseenWords);
        } else {
            randomizeWords(fetchedWords);
        }
    }, [userChoice, unseenWords, seenWords, fetchedWords]);
    //changes to practice old words mode
    const changeToPractice = () => {
        setUserChoice("practice");
    }
    //changes to mode with both practice and learn
    const changeToBoth = () => {
        setUserChoice("both");
    }
    //changes to only learning new words mode
    const changeToLearn = () => {
        setUserChoice("learn");
    }
    //handles when the user clicks the enter button 
    const handleEnterClick = async () => {
        if (textInput.toLowerCase() === translatedWord.toLowerCase()) {
            await gameClient.learnNewWord(username, selectedlanguage, chosenWords[currentWordIndex]);
            showNextWord();
            setIsLastWordCorrect(true);
        } else {
            console.log("Incorrect word. Try again!");
            setIsLastWordCorrect(false);
        }

        if (currentWordIndex === chosenWords.length - 1) {
            setCongrats(true);
            setDefinition(''); // Clear the definition when the congrats message is shown
        }
        setTextInput("");
    };
    //handles getting the image with the associated english word learned
    const getFoodImageSrc = (foodWord) => {
        switch (foodWord) {
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
            default:
                return null;
        }
    };

    return (
        <div className="container">
            <img id="bg" src={bg}></img>

            <div className="learn-content">
                <img id="learnBG" src={learnBG} />
                <div className="learnCONTENT">
                </div>
            </div>

            <div className="npc-content">
                <img id="npcimg" src={npcimg} alt="npc image" />
                <div className="npc-text">

                {!isLastWordCorrect && <p className="incorrect-message">Incorrect word. Try again!</p>}
                {congrats && isLastWordCorrect && <p className="congrats-message">Congrats! You're done!</p>}
                {!startClicked && <p>{texts[currentTextIndex]}</p>}
                {startClicked && isLastWordCorrect && !congrats && <p>{chosenWords[currentWordIndex]} is the {definition}</p>}
                </div>
                <img id="npcTextbox" src={npcTextbox} alt="NPC Textbox" />
            </div>
            <img id="easelimg" src={overlayIMG}></img>            

            <div className="textdiv"></div>

            {startClicked ? (
                <>
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
                    <button type="button" id="enterbutton" onClick={handleEnterClick}>
                        Enter
                    </button>

                    <div className="learned-words">
                        <ul>
                            <h1>English: {chosenWords[currentWordIndex]}</h1>
                            <br></br>
                            <h1>{selectedlanguage}: {translatedWord}</h1>
                        </ul>
                    </div>

                    {chosenWords[currentWordIndex] && (
                        <img
                            id="foodImage"
                            src={getFoodImageSrc(chosenWords[currentWordIndex])}
                            alt={chosenWords[currentWordIndex]}
                        />
                    )}
                </>
            ) : (promptTrigger ? (
                <div className="textdiv">
                    <button type="button" id="PracticeSeenWordsBtn" onClick={changeToPractice}>Practice</button>
                    <button type="button" id="LearnNewWordsBtn" onClick={changeToLearn}>Learn</button>
                    <button type="button" id="BothBtn" onClick={changeToBoth}>Both</button>
                </div>
            ) :
                <button type="button" id="nextbutton" onClick={handleStartClick}>Next</button>
            )}

            <button type="button" id="goToMapButton" onClick={goToMap}>
                Go to Map
            </button>
        </div>
    );
};

export default Market;

