// import React, { useState } from 'react';
import React, { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
import schoolImage from '../../assets/School.png'; 
import artistImage from '../../assets/Artist.png'; 
import marketImage from '../../assets/Market.png'; 
import outskirtsImage from '../../assets/Outskirts.png'; 
import tailorImage from '../../assets/Tailor.png'; 

import schoolHLImage from '../../assets/SchoolHL.png'; 
import artistHLImage from '../../assets/ArtistHL.png'; 
import marketHLImage from '../../assets/MarketHL.png'; 
import outskirtsHLImage from '../../assets/OutskirtsHL.png'; 
import tailorHLImage from '../../assets/TailorHL.png'; 


import menuBarImage from '../../assets/MenuBar.png'; 
import dictionaryImage from '../../assets/DictionaryTabSHORT.png'; 
import menuImage from '../../assets/MenuTabSHORT.png'; 

import './MapPage.css';
import DictionaryPopup from '../../components/dictionary/DictionaryPopup';


import { useLocation } from 'react-router-dom';




const Map = function() {
    const [buttonPopup, setButtonPopup] = useState(false);

    const navigate = useNavigate(); 
    // const goToSchool =() => {navigate('/school');}

    const location = useLocation();
    const username = location.state.username;
    const selectedLanguage = location.state.language;




    const [userDictionary, setUserDictionary] = useState(null);
    const [numberOfLearnedWords, setNumberOfLearnedWords] = useState(0);

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
            const result = await getTheUserInformation(username, selectedLanguage);
            setUserDictionary(result);
            if (result) {
                setNumberOfLearnedWords(Object.keys(result).length);
            }
        }
        fetchData();
    }, [username, selectedLanguage]);





    // Navigate to the Artist component with the username as a prop
    const goToSchool = () => {
        // navigate('/artist', { state: { username } });
        navigate('/school', { state: { username, language: selectedLanguage } });


    };
    // Navigate to the Artist component with the username as a prop
    const goToArtist = () => {
        // navigate('/artist', { state: { username } });
        navigate('/artist', { state: { username, language: selectedLanguage } });

    };


    // Navigate to the Artist component with the username as a prop
    const goToMarket = () => {
        // navigate('/artist', { state: { username } });
        navigate('/market', { state: { username, language: selectedLanguage } });

    };



    // Navigate to the Artist component with the username as a prop
    const goToTailor = () => {
        // navigate('/artist', { state: { username } });
        navigate('/tailor', { state: { username, language: selectedLanguage } });

    };

    // const goToArtist =() => {navigate('/artist');}


    // // const goToMarket =() => {navigate('/market');}
    // const goToOutskirts =() => {navigate('/outskirts');}


    // Navigate to the Artist component with the username as a prop
    const goToOutskirts = () => {
        // navigate('/artist', { state: { username } });
        // navigate('/outskirts', { state: { username, language: selectedLanguage } });

        if (numberOfLearnedWords >= 10) {
            navigate('/outskirts', { state: { username, language: selectedLanguage } });
        } else {
            alert("You must learn at least 10 words before you can go to the Outskirts.");
        }
    };


    // const goToTailor =() => {navigate('/tailor');}

    const goToMenu =() => {
        navigate('/language', { state: { username } });

    };



    const [isSchoolHovered, setIsSchoolHovered] = useState(false);
    const [isArtistHovered, setIsArtistHovered] = useState(false);
    const [isMarketHovered, setIsMarketHovered] = useState(false);
    const [isOutskirtsHovered, setIsOutskirtsHovered] = useState(false);
    const [isTailorHovered, setIsTailorHovered] = useState(false);

    const handleSchoolMouseEnter = () => {
        setIsSchoolHovered(true);
    };

    const handleSchoolMouseLeave = () => {
        setIsSchoolHovered(false);
    };

    const handleArtistMouseEnter = () => {
        setIsArtistHovered(true);
    };

    const handleArtistMouseLeave = () => {
        setIsArtistHovered(false);
    };

    const handleMarketMouseEnter = () => {
        setIsMarketHovered(true);
    };

    const handleMarketMouseLeave = () => {
        setIsMarketHovered(false);
    };

    const handleOutskirtsMouseEnter = () => {
        setIsOutskirtsHovered(true);
    };

    const handleOutskirtsMouseLeave = () => {
        setIsOutskirtsHovered(false);
    };

    const handleTailorMouseEnter = () => {
        setIsTailorHovered(true);
    };

    const handleTailorMouseLeave = () => {
        setIsTailorHovered(false);
    };


    return(  
        <div className = "mapbackground">

            
            < form action ="">
            <div className = "mapbtndiv" id= "artist">
                    <button type= "button" id= "artistimg" onClick={goToArtist} onMouseEnter={handleArtistMouseEnter} onMouseLeave={handleArtistMouseLeave}>
                        <img src={isArtistHovered ? artistHLImage : artistImage} />
                    </button>
                    <p className = "descTxt">Learn about Colors</p>
                </div>
                <div className = "mapbtndiv" id = "outskirts">
                    <button type= "button" id= "outskirtsimg" onClick={goToOutskirts} onMouseEnter={handleOutskirtsMouseEnter} onMouseLeave={handleOutskirtsMouseLeave}>
                        <img src={isOutskirtsHovered ? outskirtsHLImage : outskirtsImage} />
                    </button>
                    <p className= "descTxt">Test your Understanding</p>
                </div>

                <div className = "mapbtndiv" id = "market">
                    <button type= "button" id= "marketimg" onClick={goToMarket} onMouseEnter={handleMarketMouseEnter} onMouseLeave={handleMarketMouseLeave}>
                        <img src={isMarketHovered ? marketHLImage : marketImage} />
                    </button>
                    <p className = "descTxt">Learn about Food</p>
                </div>

                <div className = "mapbtndiv" id= "school">
                    <button type= "button" id= "schoolimg" onClick={goToSchool} onMouseEnter={handleSchoolMouseEnter} onMouseLeave={handleSchoolMouseLeave}>
                        <img src={isSchoolHovered ? schoolHLImage : schoolImage} />
                    </button>
                    <p className = "descTxt">Learn about School</p>
                </div>

                <div className = "mapbtndiv" id = "tailor">
                <button type= "button" id= "tailorimg" onClick={goToTailor} onMouseEnter={handleTailorMouseEnter} onMouseLeave={handleTailorMouseLeave}>
                    <img src={isTailorHovered ? tailorHLImage : tailorImage} />
                </button>
                <p className = "descTxt">Learn about Clothing</p>
                </div>


                <button type="button" id="dictionaryimg" onClick= {() => setButtonPopup(true)}> 
                        <img src={dictionaryImage} />
                        
                </button>
               
                

                <button type="button" id="menuimg" onClick={goToMenu}>
                    <img src={menuImage} />
                </button>

                <img src={menuBarImage} id="menubarimg"/>
                

            </form>
            <DictionaryPopup trigger = {buttonPopup} setTrigger={setButtonPopup} username={username} selectedLanguage={selectedLanguage}>
              
            </DictionaryPopup>
            
        </div>

     );
};

export default Map;

