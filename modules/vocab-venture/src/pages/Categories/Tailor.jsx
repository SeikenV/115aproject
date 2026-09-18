import npcimg from '../../assets/tailor-assets/tailor.png';
import learnBG from '../../assets/tailor-assets/contentbox.png';
import npcTextbox from '../../assets/tailor-assets/textbox.png';
import overlayIMG from '../../assets/tailor-assets/sewingTable.png';
import bg from '../../assets/tailor-assets/tailorBG.png';
import './Artist.css';
import './Tailor.css';

import shirt from '../../assets/dict-images/clothing/shirt.png';
import hat from '../../assets/dict-images/clothing/hat.png';
import skirt from '../../assets/dict-images/clothing/skirt.png';
import jacket from '../../assets/dict-images/clothing/jacket.png';
import socks from '../../assets/dict-images/clothing/socks.png';
import shoes from '../../assets/dict-images/clothing/shoes.png';
import gloves from '../../assets/dict-images/clothing/gloves.png';
import pants from '../../assets/dict-images/clothing/pants.png';

import { useNavigate, useLocation } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

const Tailor = function() {
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
    //gets the image for each corresponding word in the Tailor learning mode
    const getTailorImageSrc = (tailorWord) => {
        switch (tailorWord) {
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
            default:
                return null;
        }
    };
    //fetches the words from the backend
    useEffect(() => {
        const fetchWords = async () => {
            try {
                const response = await gameClient.getAllWordsByCategory(username, "clothing");
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
    //handles so that the user can enter from the keyboard key their user input
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleEnterClick();
        }
    }
    //fetches the translation and definition from the backend 
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
    //records which words are seen and not seen by the user
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

    const greetings = {
        'spanish': 'Hola',
        'french': 'Bonjour',
    };

    const greeting = greetings[selectedlanguage] || 'Hello';
    //gives the user a text tree for practice old words, learning new words, or both 
    useEffect(() => {
        const decideTextTree = () => {
            let t = [];
            if (unseenWords.length === 0) {
                t = [`${greeting}! Practicing again?`];
                setUserChoice("both");
            } else if (unseenWords.length === fetchedWords.length) {
                t = [
                    `${greeting} ${username}!`,
                    "I've got some time, let me teach you about clothing.",
                    "Let's begin."
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
    //handles what happens when the user clicks on start
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
    //handles the input change (for example, when the user is typing)
    const handleInputChange = (event) => {
        const newValue = event.target.value;
        setTextInput(newValue);
    };
    //randomizes the words by shuffling the array
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
    //allows the user to change their choice of practicing,learning, or both
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
    //series of functions to change to practice mode, learn mode, or both
    const changeToPractice = () => {
        setUserChoice("practice");
    }
    const changeToBoth = () => {
        setUserChoice("both");
    }
    const changeToLearn = () => {
        setUserChoice("learn");
    }
    //handles what happens when the user clicks
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
            <img id="sewingTable" src={overlayIMG}></img>            

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
                            src={getTailorImageSrc(chosenWords[currentWordIndex])}
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

export default Tailor;
