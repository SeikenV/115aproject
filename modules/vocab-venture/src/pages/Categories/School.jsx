import npcimg from '../../assets/school-assets/teacher.png';
import learnBG from '../../assets/school-assets/contentbox.png';
import npcTextbox from '../../assets/school-assets/textbox.png';
import overlayIMG from '../../assets/school-assets/desk.png';
import bg from '../../assets/school-assets/schoolBG.png';
import './Artist.css';
import './School.css';

import desk from '../../assets/dict-images/school/desk.png'
import paper from '../../assets/dict-images/school/paper.png'
import pencil from '../../assets/dict-images/school/pencil.png'
import pen from '../../assets/dict-images/school/pen.png'
import student from '../../assets/dict-images/school/student.png'
import teacher from '../../assets/dict-images/school/teacher.png'
import classroom from '../../assets/dict-images/school/classroom.png'
import book from '../../assets/dict-images/school/book.png'

import { useNavigate, useLocation } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

const School = function() {
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
    //allows the user to use the enter word as keyboard input 
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleEnterClick();
        }
    }
    //fetches the words from the backend
    useEffect(() => {
        const fetchWords = async () => {
            try {
                const response = await gameClient.getAllWordsByCategory(username, "school");
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
    //fetches the translation and definition for all the words
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
    //provides the user with a series of decisions and conversations for 
    //each decision
    useEffect(() => {
        const decideTextTree = () => {
            let t = [];
            if (unseenWords.length === 0) {
                t = [`${greeting}, be sure to practice.`];
                setUserChoice("both");
            } else if (unseenWords.length === fetchedWords.length) {
                t = [
                    `${greeting} ${username}.`,
                    "Today I will teach you about school.",
                    "Let us begin."
                ];
                setUserChoice("learn");
            } else {
                t = [`Nice to see you again ${username}!`,
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
    //handles what happens with the user clicks start
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
    //handles the change in input (when the user is typing)
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
    //allows for the change in activity when the user makes a different option
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
    //series of functions to allow the user to change modes
    const changeToPractice = () => {
        setUserChoice("practice");
    }
    const changeToBoth = () => {
        setUserChoice("both");
    }
    const changeToLearn = () => {
        setUserChoice("learn");
    }
    //handles what happens when the user clicks the enter button
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
    //gets the image for each corresponding word in School
    const getSchoolImageSrc = (schoolWord) => {
        switch (schoolWord) {
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
                {startClicked && isLastWordCorrect && !congrats && <p>A {chosenWords[currentWordIndex]} is a {definition}</p>}
                </div>
                <img id="npcTextbox" src={npcTextbox} alt="NPC Textbox" />
            </div>
            <img id="deskimg" src={overlayIMG}></img>            

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
                            src={getSchoolImageSrc(chosenWords[currentWordIndex])}
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

export default School;
