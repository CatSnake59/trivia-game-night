import React, { useState } from 'react';
import styles from '../Styles/QuestionCard.css';

const QuestionCard = ({question, handleQuestionClick}) => {
  const points = { easy: 1000, medium: 3000, hard: 5000 };

  return (
    <div className="question-card" onClick={() => handleQuestionClick(question)}>
      <div className="front">
        <h2>{points[question.difficulty]}</h2>
      </div>
    </div>
  );
}

export default QuestionCard;