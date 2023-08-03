import React from 'react';

function Scoreboard({ score, playerNumber }) {
  return (
    <>
      <h2 className="playerNumber">
        Player
        {playerNumber}
      </h2>
      <h2 className="score">
        Score:
        {score}
      </h2>
    </>
  );
}

export default Scoreboard;
