import npcimg from '../../assets/artist-assets/Artist.png';
import learnBG from '../../assets/artist-assets/Contentbox.png';
import npcTextbox from '../../assets/artist-assets/ArtistTextbox.png';
import overlayIMG from '../../assets/artist-assets/Easel.png';
import bg from '../../assets/artist-assets/ArtistBG.png';
import './Artist.css';
import blue from '../../assets/dict-images/colors/blue.png';
import black from '../../assets/dict-images/colors/black.png';
import brown from '../../assets/dict-images/colors/brown.png';
import green from '../../assets/dict-images/colors/green.png';
import orange from '../../assets/dict-images/colors/orange.png';
import red from '../../assets/dict-images/colors/red.png';
import white from '../../assets/dict-images/colors/white.png';
import yellow from '../../assets/dict-images/colors/yellow.png';

import { useNavigate, useLocation } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

const Artist = function() {
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
    //fetches the word from the backend
    useEffect(() => {
        const fetchWords = async () => {
            try {
                const response = await gameClient.getAllWordsByCategory(username, "colors");
                const fetchedWords = Object.values(response).flat();

                const fetchedUserDict = await gameClient.getUserDictionary(username, selectedlanguage);
                setUserDictionary(fetchedUserDict || []);
                setFetchedWords(fetchedWords || []);
            } catch (error) {
                console.error("Error fetching words:", error);
            }
        };
        fetchWords();
    }, []);
    //retrieves the translations and definitions of each word
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
    }, [currentWordIndex, chosenWords, selectedlanguage, username]);
    //records which words are seen and not seen
    useEffect(() => {
        const recordSeenAndUnseen = () => {
            let unseenTemp = [];
            let seenTemp = [];
            const dictWords = Object.keys(userDictionary);

            for (const categoryWord of Object.values(fetchedWords)) {
                if (dictWords.indexOf(categoryWord) === -1) {
                    unseenTemp.push(categoryWord);
                } else {
                    seenTemp.push(categoryWord);
                }
            }
            setUnseenWords(unseenTemp);
            setSeenWords(seenTemp);
        }
        recordSeenAndUnseen();
    }, [fetchedWords, userDictionary]);

    const greetings = {
        'spanish': 'Hola',
        'french': 'Bonjour',
    };
    //greets the user
    const greeting = greetings[selectedlanguage] || 'Hello';
    //prompts the user with a conversation and allows them to 
    //decide on what to do 
    useEffect(() => {
        const decideTextTree = () => {
            let t = [];
            if (unseenWords.length === 0) {
                t = [`${greeting}! Getting some practice in?`];
                setUserChoice("both");
            } else if (unseenWords.length === fetchedWords.length) {
                t = [
                    `${greeting} ${username}!`,
                    "We will learn about colors here!",
                    "Let's begin!"
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
    }, [unseenWords, fetchedWords, username, selectedlanguage]);
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
    //allows the user to click the start button 
    const handleStartClick = () => {
        if (currentTextIndex === texts.length - 1) {
            setPromptTrigger(false);
            setStartClicked(true);
        } else if (currentTextIndex === texts.length - 2) {
            showNextText();
            if (userChoice.localeCompare("prompt") === 0) {
                setPromptTrigger(true);
            }
        } else if (currentTextIndex < texts.length - 1) {
            showNextText();
        }
    };
    //allows the user to either hit the enter word as well to enter their input
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleEnterClick();
        }
    }

    const handleInputChange = (event) => {
        setTextInput(event.target.value);
    };

    //function that shuffles the words in order to create randomness
    const randomizeWords = (array) => {
        const shuffledArray = array.slice();
        for (let i = shuffledArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
        }
        setChosenWords(shuffledArray);
    }

    useEffect(() => {
        if (currentTextIndex > 0) {
            handleStartClick();
        }
    }, [chosenWords])

    useEffect(() => {
        if (userChoice.localeCompare("practice") === 0) {
            randomizeWords(seenWords);
        } else if (userChoice.localeCompare("learn") === 0) {
            randomizeWords(unseenWords);
        } else {
            randomizeWords(fetchedWords);
        }
    }, [userChoice, unseenWords, seenWords, fetchedWords]);

    //function that allows the user to start practicing 
    const changeToPractice = () => {
        setUserChoice("practice");
    }
    //function that allows the user to both practice and learn
    const changeToBoth = () => {
        setUserChoice("both");
    }
    //function that allows the user to go to learn mode
    const changeToLearn = () => {
        setUserChoice("learn");
    }
    //function that handles what happens when the user types in the learned word
    //and clicks enter
    const handleEnterClick = async () => {
        if (textInput.toLowerCase() === translatedWord.toLowerCase()) {
            await gameClient.learnNewWord(username, selectedlanguage, chosenWords[currentWordIndex]);
            showNextWord();
            setIsLastWordCorrect(true);
        } else {
            setIsLastWordCorrect(false);
        }

        if (currentWordIndex === chosenWords.length - 1) {
            setCongrats(true);
            setDefinition(''); // Clear the definition when the congrats message is shown
        }
        setTextInput("");
    };
    //gets the image of the respective color that the user is learning
    const getColorImageSrc = (colorWord) => {
        switch (colorWord) {
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
                    {congrats && isLastWordCorrect && <p className="congrats-message">Congrats! You learned all the words!</p>}
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
                            id="colorImage"
                            src={getColorImageSrc(chosenWords[currentWordIndex])}
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

export default Artist;
