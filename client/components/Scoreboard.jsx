import React from 'react';

const Scoreboard = ({ score, playerNumber, playerTurn }) => {
  return (
    // dynamically change styling for player div based on whose turn it is
    <div className={playerTurn === playerNumber ? 'scoreboard highlighted' : 'scoreboard'}>
      <h2 className="playerNumber">
        Player
        {playerNumber}
      </h2>
      <h2 className="score">
        Score:
        {score}
      </h2>
    </div>
  );
}

export default Scoreboard;
