import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/LoginStyles.css';

export default function SignUp({ setLoggedIn }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    console.log('Type Username here', username);
    console.log('Type Password here', password);
    console.log('Button has been clicked to login');
    fetch('/log-in', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        password,
      }),
    })
      .then((response) => {
        if (response.ok) {
          response
            .json()
            .then((data) => {
              localStorage.setItem('triviaJwtToken', data.jwtToken);
              setLoggedIn(true);
              return navigate('/');
            })
            .catch((err) => console.error(err));
        }
      })
      .catch((err) => console.error(err));
  };

  const handleCreateAccount = () => {
    fetch('/sign-up', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        password,
        location,
      }),
    })
      .then((res) => {
        if (res.ok) {
          res
            .json()
            .then((data) => {
              localStorage.setItem('triviaJwtToken', data.jwtToken);
              setLoggedIn(true);
              return navigate('/');
            })
            .catch((err) => console.error(err));
        }
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="login">
      <h1 className="logTitle">Cat Snakes Trivia</h1>
      <div>
        <input
          className="username"
          type="username"
          placeholder="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <input
          className="password"
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div>
          <button onClick={handleLogin}>Login</button>
          <button className="createAcct" onClick={handleCreateAccount}>
            Create Account
          </button>
        </div>
      </div>
    </div>
  );
}
