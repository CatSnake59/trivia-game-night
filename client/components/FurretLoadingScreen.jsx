import React from 'react';
import '../Styles/Quiz.css';
import furret from '../assets/furret-walk.gif';

function FurretLoadingScreen() {
  return (
    <>
      <div className='furret'>
        <img
          style={{ height: '30vh', position: 'fixed' }}
          src={furret}
          alt='a furret walking'
        />
        <div className='loadingWord'>
          <h1>Loading...</h1>
          <h1>Loading...</h1>
        </div>
      </div>
    </>
  );
}

export default FurretLoadingScreen;
