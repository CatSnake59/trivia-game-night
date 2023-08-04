import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignUp from './components/Signup';
import Quiz from './components/Quiz';
import './Styles/App.css';

const App = (props) => {
  // state variables
  const [user, setUser] = useState({});
  const [loggedIn, setLoggedIn] = useState(false);

  // check for JWT on page load
  useEffect(() => {
    const jwtToken = localStorage.getItem('triviaJwtToken');
    if(jwtToken){
      fetchUserData(jwtToken)
    }
    setLoggedIn(false);
  }, [loggedIn]);

  // fetch user data from DB
  const fetchUserData = async (jwt) => {
    const user = await fetch('/verifyJwt', {
      headers: {
        'Authorization': `Bearer ${jwt}`
      }
    })
    if (user.ok) {
      const userData = await user.json();
      setUser(userData)
    } else {
      localStorage.removeItem('triviaJwtToken');
    }
  }

  return (
    <div>
      <Router>
        <Routes>
          <Route path="/*" element={user.username ? <Quiz user={user} setUser={setUser} /> : <SignUp setLoggedIn={setLoggedIn} />}/>
        </Routes>
      </Router>
    </div>
  );
};

export default App;
