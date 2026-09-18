//main javascript file 
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainPage from "./pages/MainPage/MainPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import RegisterPage from "./pages/RegisterPage/RegisterPage";
import MapPage from "./pages/MapPage/MapPage";
import LanguagePage from "./pages/LanguageSelect/LanguageSelect";
import SchoolPage from "./pages/Categories/School";
import ArtistPage from "./pages/Categories/Artist";
import MarketPage from "./pages/Categories/Market";
import OutskirtsPage from "./pages/Categories/Outskirts";
import TailorPage from "./pages/Categories/Tailor";
import TypePage from "./components/combatPopups/Type";
import MCPage from "./components/combatPopups/MultChoice";
import QuizPage from "./components/combatPopups/Quiz";
import MatchPage from "./components/combatPopups/Match";


import TypeOGPage from "./components/combatPopups/TypeOG";
import MCOGPage from "./components/combatPopups/MultChoiceOG";

import AfterQuizPage from "./components/combatPopups/afterQuizPage";

export default function App() {
  
  return(
    <BrowserRouter>
      <Routes>
      <Route exact path= "/" element={<MainPage></MainPage>}/>
        <Route exact path= "/home" element={<MainPage></MainPage>}/>
        <Route index element= {<MainPage></MainPage>}/>
        <Route exact path= "/login" element={<LoginPage></LoginPage>}/>
        <Route exact path= "/register" element={<RegisterPage></RegisterPage>}/>
        <Route exact path= "/map" element={<MapPage></MapPage>}/>
        <Route exact path= "/language" element={<LanguagePage></LanguagePage>}/>
        <Route exact path= "/school" element={<SchoolPage></SchoolPage>}/>
        <Route exact path= "/artist" element={<ArtistPage></ArtistPage>}/>
        <Route exact path= "/market" element={<MarketPage></MarketPage>}/>
        <Route exact path= "/outskirts" element={<OutskirtsPage></OutskirtsPage>}/>
        <Route exact path= "/tailor" element={<TailorPage></TailorPage>}/>
        <Route exact path= "/type" element={<TypePage></TypePage>}/>
        <Route exact path= "/multiplechoice" element={<MCPage></MCPage>}/>
        <Route exact path= "/quiz" element={<QuizPage></QuizPage>}/>
        <Route exact path= "/match" element={<MatchPage></MatchPage>}/>

        <Route exact path= "/typeOG" element={<TypeOGPage></TypeOGPage>}/>
        <Route exact path= "/multiplechoiceOG" element={<MCOGPage></MCOGPage>}/>
        <Route exact path= "/afterquizpage" element={<AfterQuizPage></AfterQuizPage>}/>




        </Routes>
    </BrowserRouter>
    
  );  
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
