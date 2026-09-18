import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom/dist';

/**
 * RegisterPage Component.
 * 
 * The Register page for the Vocab Venture application.
 * Allows users to create an account with a username and password.
 * 
 * @returns {JSX.Element} The rendered component.
 */
const RegisterPage = function() {

    // State for register status
    const [registerStatus, setRegisterStatus] = useState(null);
    // State for error message
    const [errorMsg, setErrorMsg] = useState('');



    const navigate = useNavigate();

    // Navigate back to home page
    const goToMainPage =() => {navigate('/home')};

    // Navigate to selecting language page
    const goToLanguage = () => {
        const username = document.getElementById('new-username').value;
        navigate('/language', { state: { username } });
    };
    
    /*
    * The useEffect checks if the username and password are valid by calling handleRegister().
    * It gives an error message if the username and password are already in the database.
    */
    useEffect(() => {
        const submitRegisterElement = document.getElementById('submit-register-id');
        if (submitRegisterElement) {
            submitRegisterElement.addEventListener('click', () => {
                handleRegister().then((result) => {
                    // Handle the result of the register attempt
                    if (result.status === 'success') {
                        goToLanguage();
                    } else {
                        setRegisterStatus('failed');
                        setErrorMsg(result.message);
                    }
                }).catch((error) => {
                    setErrorMsg('An error occurred during register. Please try again.');
                });
            });
            return () => {
                submitRegisterElement.removeEventListener('click', handleRegister);
            };
        }
    }, []);

    
    return(  
        
            <div className='wrapper'>
                <form action ="">
                    <h1>Register</h1>

                    <label>Username</label>
                    <div className= "input-box"> 
                    <input type="text" id = "new-username" placeholder= 'Username' required/>
                    </div>

                    <label>Password</label>
                    <div className="input-box">
                        <input type= "password" id = "new-password" placeholder= 'Password' required />
                    </div>

                    {errorMsg && <p className="error-msg">{errorMsg}</p>}<br></br>
                    
                    <button type= "button" id = "submit-register-id">Register</button>
                    <p>
                        Already have an account? <a href="/login">Login</a>
                    </p>
                    <hr/>

                    <button type= "button" id = "submit-mainpage" onClick= {goToMainPage}>Back Home</button>
                </form>
            </div>
 
     );
};

export default RegisterPage;