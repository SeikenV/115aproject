import React, { useEffect, useState } from 'react'; 
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import './LanguageSelect.css';


/**
 * LanguageSelectPage Component.
 * 
 * The Language Select page for the Vocab Venture application.
 * Allows users to select a language they want to learn words.
 * 
 */
const LanguageSelect = function() {

    // State for selectedlanguage
    const [selectedLanguage, setSelectedLanguage] = useState(null);

    // Get the current location object
    const location = useLocation();
    // Get the username from location state
    const username = location.state.username;

    const navigate = useNavigate();

    // Navigate back to home page
    const goToMainPage =() => {navigate('/home')};

    // Navigate to the map page
    const goToMap = (language) => {
        navigate('/map', { state: { username, language } });
    };
    
    return( 
        <div className='wrapper'>          
            <h1>Welcome,</h1>
            <div className="username-container">
                <h3>{username}</h3> 
            </div>
          <form action ="">
            <button type="button" id="submit-spanish" onClick={() => { gameClient.clearCache(username); setSelectedLanguage('spanish'); goToMap('spanish'); }}>Spanish</button>
            <button type="button" id="submit-french" onClick={() => { gameClient.clearCache(username); setSelectedLanguage('french'); goToMap('french'); }}>French</button>

          <hr/>
            <button type= "button" id = "submit-mainpage" onClick= {goToMainPage}>Back Home</button>
          </form>
        </div>
    );

};
export default LanguageSelect;
