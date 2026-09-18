

import './MultChoice.css';

import cat from '../../assets/outskirts-assets/testSS.png';
import catHIT from '../../assets/outskirts-assets/catHitSS.png';
import catATTACK from '../../assets/outskirts-assets/catAttackSS.png';
import slime from '../../assets/outskirts-assets/slimeIDLE.png'
import slimeHIT from '../../assets/outskirts-assets/slimeHIT.png'
import slimeATTACK from '../../assets/outskirts-assets/slimeATTACK.png'

import correctEffect1 from '../../assets/outskirts-assets/correctEffect1.png'
import correctEffect2 from '../../assets/outskirts-assets/correctEffect2.png'
import incorrectEffect1 from '../../assets/outskirts-assets/incorrectEffect1.png'
import correctEffect3 from '../../assets/outskirts-assets/correctEffect3.png'




import './Quiz.css';
import TypePopup from '../combatPopups/Type';
import MCPopup from '../combatPopups/MultChoice';
import MatchPopup from '../combatPopups/Match';
import ReadyGoPopup from '../combatPopups/ReadyGoDisplay';

// import { useLocation } from 'react-router-dom';
import { useNavigate, useLocation } from 'react-router-dom';

import React, { useState, useEffect } from 'react';


const Quiz = () => {
    //overlays 
    const [typePopup, setTypePopup] = useState(false);
    const [mcPopup, setMcPopup] = useState(false);
    const [matchPopup, setMatchPopup] = useState(false);
    const [showReadyGo, setReadyGo] = useState(false);
    const [correctMessage, setCorrectMessage] = useState("");
    const [backgroundStall, setBackgroundStall] = useState(false);



    //animation states 
    const [isHit, setIsHit] = useState(false);
    const [isAttacking, setIsAttacking] = useState(false);
    const [isSlimeHit, setIsSlimeHit] = useState(false);
    const [isSlimeAttacking, setIsSlimeAttacking] = useState(false);

    //question variables
    const [qType, setQType] = useState(-1); //0 is mult choice, 1 type, 2 match
    const [isStartClicked, setIsStartClicked] = useState(false); //start game trigger
    const [isQuestionDone, setIsQuestionDone] = useState(false); //if the time runs out or answers correctly/incorrectly this will be true
    const [wordToShow, setWordToShow] = useState(''); //word to send to type
    const [isAnswerCorrect, setIsAnswerCorrect] = useState(false); 
    const [wordGroup, setWordGroup] = useState([]); //store 4 words to pass to mult choice
    const [wordGroupMatch, setWordGroupMatch] = useState([]); //store 4 words to pass to match 

    //userDictionary
    const [userDictionary, setUserDictionary] = useState([]);
    const [currentDictIndex, setCurrentDictIndex] = useState(0);
    const [shuffledDictKeys, setShuffledDictKeys] = useState([]);
    

    //num questions right/wrong counters
    const [correctCounter, setCorrectCounter] = useState(0);
    const [wrongCounter, setWrongCounter] = useState(0);
    const [beforeCorrectCounter, setBeforeCorrectCounter] = useState(0);
    const [beforeWrongCounter, setBeforeWrongCounter] = useState(0);

    const [timer, setTimer] = useState(60); // Initial timer value in seconds


    const navigate = useNavigate(); 
    const location = useLocation();
    const username = location.state.username;
    const selectedlanguage = location.state.language;

    //handle game start
    const handleStartClick = () =>{
        setIsStartClicked(true);
        setReadyGo(true);
        getNextQuestion();
    }

    //after game end go to after quiz page
    const goToAfterPage = () => {
        navigate('/afterquizpage', { state: { username, selectedlanguage, beforeCorrectCounter, beforeWrongCounter } });
    };

    //go to map procedure 
    const goToMap = () => {
        navigate('/map', { state: { username, language: selectedlanguage } });
    };

    //keep track of num questions got wrong and right 
    useEffect(() => {
        setBeforeCorrectCounter(correctCounter);
        setBeforeWrongCounter(wrongCounter);
    })

    //when user dictioanry is retrieved, shuffle for match
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
                setUserDictionary(shuffledDictionary); //set user dictionary (includes proficiencies)
                
            } catch (error) {
                console.error('An error occurred while fetching user information:', error);
            }
        };
        fetchData();
    }, [username, selectedlanguage]);
    
  
    //load the dictionary into the shuffledDictKeys variable
    useEffect(() => {
        setShuffledDictKeys(Object.keys(userDictionary));
    },[userDictionary]);

    //use weighted randomizer to fetch 4 words for mult choice 
    const fetchQuestion = async () => {
        // console.log("BEFORE TRYYYYYY");
        const words = ["pera", "uva", "piña", "fresa", "arándano", "kiwi", "sandía", "pomme", "poire", "raisin", "ananas", "fraise", "myrtille", "kiwi", "pastèque", "Apfel", "Birne", "Traube", "Ananas", "Erdbeere", "Blaubeere",  "Wassermelone", "mela", "arancia", "pera", "uva", "ananas", "fragola", "mirtillo", "kiwi", "anguria"];
        const randomWords = [];
        for (let i = 0; i < 3; i++) {
            const randomIndex = Math.floor(Math.random() * words.length);
            randomWords.push(words[randomIndex]);
        }
        try {
            const questionWord = await gameClient.getQuestionWord(username, selectedlanguage, 2);
            setWordToShow(questionWord);
            if (questionWord) {

                const [correctIndex, choices] = await gameClient.getMultipleChoice(username, selectedlanguage, questionWord);
                setTimeout(()=>{
                },1000);
                if (choices.length == 1) {
                    console.log("ONLY ONE");
                    choices.push(randomWords[0], randomWords[1], randomWords[2]);
                }
                setWordGroup(choices);
            }
        } catch (error) {
            console.error('Error fetching question word:', error);
        }
    };
    //use weighted randomizer to fetch 1 word for typ
    const fetchOneQuestion = async () => {
        // console.log("ONEEEE");
        try {
            // console.log("TWOOOOO");
            const questionWord = await gameClient.getQuestionWord(username, selectedlanguage, 2);
            // console.log("THREEEE");
            // setTimeout(()=>{
            //     setCorrectMessage("");
            // },1000);
            setWordToShow(questionWord);
        } catch (error) {
            console.error('Error fetching question word:', error);
        }
    };

    // Fetch question when question type changes and there is no question being shown 
    useEffect(() => {
        if(qType == 0 && isQuestionDone == false){
            fetchQuestion();
        }
        if(qType == 1 && isQuestionDone == false){
            fetchOneQuestion();
        }
    }, [qType, isQuestionDone]);
  


    //get user dictionary 
    const getTheUserInformation = async (username, language) => {
        try {
            const result = await gameClient.getUserDictionary(username, language);
            return result;
        } catch (error) {
            return { status: 'error', message: 'An error occurred during login. Please try again.' };
        }
      }

      //after a question has completed, get next question 
      useEffect(() => {
        if(isAnswerCorrect == false && isQuestionDone ==true){
            console.log("wrong answer");
            getNextQuestion();
            setCorrectMessage("Incorrect!");
            setTimeout(()=>{
                setCorrectMessage("");
            },1000);
        }
        else if(isAnswerCorrect == true && isQuestionDone == true){
            console.log("correct answer");
            getNextQuestion();
            setCorrectMessage("Correct!");
            setTimeout(()=>{
                setCorrectMessage("");
            },1000);
        }
      }, [isQuestionDone])

      

    let count = 0;
    //show popup based on qType if game has started, word/wordgroup is chosen and if there isnt a question already shown 
    useEffect(() => {
        console.log("USE EFFECT", count);
        if(isStartClicked == true && isQuestionDone == false && wordGroup != null && wordGroupMatch != null){
            if(qType == 0){
                console.log("Word group passed to MC ", wordGroup);
                setMcPopup(true);
                setTypePopup(false);
                setMatchPopup(false);
            }
            else if(qType == 1){
                console.log("Word being passed to Type: ", wordToShow);
                setTypePopup(true);
                setMcPopup(false);
                setMatchPopup(false);
            }
            else if(qType == 2){
                console.log("Word Group being passed to Match: ", wordGroupMatch);
                setMatchPopup(true);
                setMcPopup(false);
                setTypePopup(false);
            }
        }
        count += 1;
    },[wordToShow, isStartClicked, wordGroup, wordGroupMatch]);

    
    
    //get 4 words from user dictionary and set them to the word group for match ONLY   
    const sendWords = (numWords) =>{
            if(numWords == 4){ //if matching
                //get next 4 words
                let next4Words = shuffledDictKeys.slice(currentDictIndex, currentDictIndex + 4)
                let wordGroupLen = next4Words.length;
                //if at end of array, take remaining from start
                if (wordGroupLen < 4){
                    next4Words = next4Words.concat(shuffledDictKeys.slice(0, 4-wordGroupLen));
                }
                setWordGroupMatch(next4Words);
                //increment index by 4 words, make sure array loops 
                setCurrentDictIndex((currentDictIndex + numWords) % shuffledDictKeys.length);
            }
            //console.log(shuffledDictKeys);
    }

    

    //if background stall is true, deactivate after 3.1s 
    useEffect(() => {
       if(backgroundStall){
            setTimeout(() => {
                setBackgroundStall(false);
            },2800)
        }
    },[backgroundStall])


    //determining question type
    const getNextQuestion = () => {
        //get question type
        let q = Math.floor(Math.random() * 3);
        setQType(q);
        //begin stall bg
        setBackgroundStall(true);
        //indicate a question is in progress
        setIsQuestionDone(false);
        
        
        console.log("Question: ", q);
        if(q == 0){
            sendWords(3);
        }
        else if(q == 1){ //type
            sendWords(1);
        }
        else{ //match
            sendWords(4);
        }
    }
   
  
    //if game start, show ready go countdown 
    useEffect(() => {
        if (showReadyGo) {
            const timeout = setTimeout(() => {
                const interval = setInterval(() => {
                    setTimer(prevTimer => {
                        if (prevTimer <= 1) {
                            clearInterval(interval);
                            setIsQuestionDone(true);
                            return 0;
                        }
                        return prevTimer - 1;
                    });
                }, 1000);
                return () => clearInterval(interval);
            }, 2800); // Delay before starting the interval
            
        }
    }, [showReadyGo]);

    //if game end, go to after page 
    useEffect(() => {
        if (timer == 0) {
            setBackgroundStall(true);
            setBeforeCorrectCounter(correctCounter);
            setBeforeWrongCounter(wrongCounter);
            goToAfterPage();

        }
    },[timer]);


    //======= A N I M A T I O N S ===========


    //show correct effect
    const playCorrectEffect= ()=>{
        if(qType == 0){
            return( 
                <div className= "coverUpBG">
                    <div className="Effects" >
                        <img className= "correctEffect1SS" src= {correctEffect1} ></img>
                    </div>
                </div>
            )
        }
        else if (qType == 1){
            return( 
                <div className= "coverUpBG">
                    <div className="Effects" >
                        <img className= "correctEffect2SS" src= {correctEffect2} ></img>
                    </div>
                </div>
            )
        }
        else{
            return( 
                <div className= "coverUpBG">
                    <div className="Effects" >
                        <img className= "correctEffect3SS" src= {correctEffect3} ></img>
                    </div>
                </div>
            )
        }
    }

    //show incorrect effect
    const playIncorrectEffect= ()=>{
        return( 
        <div className= "coverUpBG">
            <div className="Effects" >
                <img className="incorrectEffect1SS" src= {incorrectEffect1} ></img>
            </div>
        </div>)
    }

    //cat idle 
    const playIdleAnim = () => {
        return( <img className= "catSS" src= {cat} ></img>)
    }
    //slime idle
    const playSlimeIdleAnim = () =>{
        return( <img className= "slimeSS" src= {slime} ></img>)
    }

    //attack and hit animations
    const playSlimeAttackAnim = () =>{
        return(
            <img onAnimationEnd= {handleSlimeEndAttackAnimation} className = "slimeAttackSS" src={slimeATTACK}></img>
        )
    }
    const playSlimeHitAnim = () =>{
        return(
            <img onAnimationEnd= {handleSlimeEndHitAnimation} className = "slimeHitSS" src={slimeHIT}></img>
        )
    }
    const playAttackAnim = () =>{
        return(
            <img onAnimationEnd= {handleEndAttackAnimation} className = "catAttackSS" src={catATTACK}></img>
        )
    }
    const playHitAnim = () =>{
        return(
            <img onAnimationEnd= {handleEndHitAnimation} className = "catHitSS" src={catHIT}></img>
        )  
    }

    //end animations
    const handleSlimeEndHitAnimation = () =>{
        setIsSlimeHit(false);
    }
    const handleSlimeEndAttackAnimation = () =>{
        setIsSlimeAttacking(false);
    }
    const handleEndAttackAnimation = () =>{
        setIsAttacking(false);
    
    }
    const handleEndHitAnimation = () =>{
        setIsHit(false);
    }
    
    
    return(  
        <div className = "combatBackground">
            <ReadyGoPopup trigger= {showReadyGo} setReadyGo = {setReadyGo}></ReadyGoPopup>

            {correctMessage && (
                <div className="isCorrect-display">
                    <p>{correctMessage}</p>
                </div>
            )}
            
            {backgroundStall ? 
            <div className= "coverUpBG"></div>:
            ""
            }
            <div className='timer'>
                
                <h1>Timer: {timer === 0 ? "Time is up!" : timer}</h1>


            </div>

            
            <div className = "Sprite"> {isAttacking ? playAttackAnim():
                (isHit ? playHitAnim() : playIdleAnim()
            )
                
                } 
            </div>

            <div className = "SpriteOpp"> {isSlimeAttacking ? playSlimeAttackAnim():
            (isSlimeHit ? playSlimeHitAnim():  playSlimeIdleAnim())
                } 
            </div>
            {isAttacking ? playCorrectEffect():
            (isSlimeAttacking ? playIncorrectEffect() : "")
            } 


            {isStartClicked ? 
            <div></div>
            :
            <div className = "start-btn">
                <button type="button" onClick= {() => handleStartClick()}> 
                        START            
                </button>
            </div>}
            <TypePopup trigger = {typePopup} setTrigger={setTypePopup} username={username} selectedLanguage={selectedlanguage}
            setIsHit = {setIsHit} setIsAttacking = {setIsAttacking} setIsSlimeAttacking = {setIsSlimeAttacking} wordToShow = {wordToShow} setIsAnswerCorrect = {setIsAnswerCorrect} setIsQuestionDone = {setIsQuestionDone}
            setIsSlimeHit = {setIsSlimeHit} correctCounter = {correctCounter} setCorrectCounter = {setCorrectCounter} wrongCounter = {wrongCounter} setWrongCounter = {setWrongCounter} >
            </TypePopup>
            <MCPopup trigger = {mcPopup} setTrigger= {setMcPopup}username={username} selectedLanguage={selectedlanguage}
            setIsHit = {setIsHit} setIsAttacking = {setIsAttacking} setIsSlimeAttacking = {setIsSlimeAttacking} wordToShow = {wordToShow} setIsAnswerCorrect = {setIsAnswerCorrect} setIsQuestionDone = {setIsQuestionDone} wordGroup = {wordGroup}
            setIsSlimeHit = {setIsSlimeHit} correctCounter = {correctCounter} setCorrectCounter = {setCorrectCounter} wrongCounter = {wrongCounter} setWrongCounter = {setWrongCounter} >
            </MCPopup>
            <MatchPopup trigger = {matchPopup} setTrigger= {setMatchPopup}username={username} selectedLanguage={selectedlanguage}
            setIsHit = {setIsHit} setIsAttacking = {setIsAttacking} setIsSlimeAttacking = {setIsSlimeAttacking} setIsAnswerCorrect = {setIsAnswerCorrect} setIsQuestionDone = {setIsQuestionDone} wordGroupMatch = {wordGroupMatch}
            setIsSlimeHit = {setIsSlimeHit} correctCounter = {correctCounter} setCorrectCounter = {setCorrectCounter} wrongCounter = {wrongCounter} setWrongCounter = {setWrongCounter} >
            </MatchPopup>
            <button type="button" id="goToMapButton" onClick={goToMap}> Go to Map</button>

        </div>
    
                
     
    
     );
};

export default Quiz;


