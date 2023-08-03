import React from 'react';

function Scoreboard({ score, playerNumber, playerTurn }) {
  return (
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
