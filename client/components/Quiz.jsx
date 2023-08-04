import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import StickyBox from 'react-sticky-box';
import QuestionCard from './QuestionCards';
import Question from './Question';
import '../Styles/Quiz.css';
import Scoreboard from './Scoreboard';
import WinCondition from './Wincondition';
import FurretLoadingScreen from './FurretLoadingScreen';
import BuzzerButton from './BuzzerButton';

// helper function: control font size
const getFontSize = (textLength) => {
  if (textLength < 15) return '30px';
  if (textLength > 25) return '25px';
  if (textLength > 40) return '20px';
  if (textLength > 55) return '18px';
};

const Quiz = ({ user, setUser }) => {
  const navigate = useNavigate(); // control routing

  // state variables
  const [newGame, setNewGame] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [questionState, setQuestionState] = useState({});
  const [answeredQuestions, setAnsweredQuestions] = useState([]);
  const [playerTurn, setPlayerTurn] = useState(1);
  const [player1Score, setPlayer1Score] = useState(0);
  const [player2Score, setPlayer2Score] = useState(0);
  const [hasWon, setHasWon] = useState(false);

  const points = { easy: 1000, medium: 3000, hard: 5000 };

  // reset game after win condition has been met (redirect to root path)
  const resetGame = () => {
    setQuizQuestions([]);
    setQuestionState({});
    setAnsweredQuestions([]);
    setPlayer1Score(0);
    setPlayer2Score(0);
    setHasWon(false);
    setNewGame(true);
    navigate('/');
  };

  // check for winner (redirect to /win path)
  useEffect(() => {
    if (player1Score >= 10000) {
      setPlayerTurn(1);
      setHasWon(true);
      navigate('/win');
    } else if (player2Score >= 10000) {
      setPlayerTurn(2);
      setHasWon(true);
      navigate('/win');
    }
  }, [player1Score, player2Score]);

  // event handler: user clicks on question card (redirect to /card path)
  const handleQuestionClick = (question) => {
    setQuestionState(question);
    setAnsweredQuestions((prev) => [...prev, question.question]);
    navigate('/card');
  };

  // event handler: user clicks on answer card
  const handleAnswerClick = (question, answer, player) => {
    if (question.correct_answer === answer) {
      if (player === 1) {
        setPlayer1Score((prevScore) => prevScore + points[question.difficulty]);
      } else {
        setPlayer2Score((prevScore) => prevScore + points[question.difficulty]);
      }
    } else {
      alert('Wrong answer!');
    }
    player === 1 ? setPlayerTurn(2) : setPlayerTurn(1); // swap player turn
    navigate('/');
  };

  // event handler: user clicks on 'Delete Account'
  const handleDeleteAccount = async () => {
    try {
      await fetch('/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: user.username,
        }),
      });
      console.log(
        `${user.username}'s account has been deleted from the database.`
      );
      localStorage.removeItem('triviaJwtToken');
      setUser({});
      navigate('/');
    } catch (err) {
      console.error(err);
    }
  };

  // event handler: user clicks on 'Log Out'
  const handleLogOut = () => {
    localStorage.removeItem('triviaJwtToken');
    setUser({});
    navigate('/');
  };

  // fetch quiz questions from backend
  useEffect(() => {
    fetch('/questions')
      .then((response) => response.json())
      .then((data) => {
        // console.log('data', data);
        setQuizQuestions(data);
        setNewGame(false);
      })
      .catch((error) => {
        console.error('Error fetching quiz questions:', error);
      });
  }, [newGame]);

  return Object.keys(quizQuestions).length ? (
    <div id='quiz'>
      <header>
        <h1 className='welcomeMessage'>Welcome, {user.username}!</h1>
      </header>

      <StickyBox offsetTop={20} className='sticky'> 
        <BuzzerButton wsUser={user.username}/>
      </StickyBox>

      <main style={{ minWidth: '80vw' }}>
        <nav id='scoreboard'>
          <Scoreboard
            score={player1Score}
            playerNumber={1}
            playerTurn={playerTurn}
          />
          <Scoreboard
            score={player2Score}
            playerNumber={2}
            playerTurn={playerTurn}
          />
        </nav>
        {/* conditionally load routes based on user actions */}
        <Routes>
          {/* path: root */}
          <Route
            path='/'
            element={
              <div className='jeopardy-board'>
                {Object.keys(quizQuestions).map((category) => (
                  <div className='questions'>
                    <div
                      className='category'
                      style={{ fontSize: getFontSize(category.length) }}
                    >
                      {category}
                    </div>
                    {quizQuestions[category].map(
                      (question) =>
                        (!answeredQuestions.includes(question.question) && (
                          <QuestionCard
                            key={crypto.randomUUID()}
                            question={question}
                            handleQuestionClick={handleQuestionClick}
                            setQuestionState={setQuestionState}
                          />
                        )) || <div className='question-card' />
                    )}
                  </div>
                ))}
              </div>
            }
          />

          {/* path: /card */}
          <Route
            path='/card'
            element={
              <Question
                key={crypto.randomUUID()}
                question={questionState}
                handleAnswerClick={handleAnswerClick}
                points={points[questionState.difficulty]}
                playerTurn={playerTurn}
              />
            }
          />

          {/* path: /win */}
          <Route
            path='/win'
            element={
              <WinCondition
                resetGame={resetGame}
                hasWon={hasWon}
                playerTurn={playerTurn}
              />
            }
          />
        </Routes>
      </main>

      {/* 'log out' & 'delete account' buttons */}
      <div className='quizButtons'>
        <button type='button' id='logOffBtn' onClick={handleLogOut}>
          LOG OUT
        </button>
        <button type='button' id='deleteAcctBtn' onClick={handleDeleteAccount}>
          DELETE ACCOUNT
        </button>
      </div>
    </div>
  ) : (
    // furret loading screen
    <FurretLoadingScreen />
  );
};

export default Quiz;
