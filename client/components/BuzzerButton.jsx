import React, { useEffect, useState } from 'react';
import useSound from 'use-sound';
import spongebob from '../assets/spongebob-fog-horn-made-with-Voicemod-technology.mp3';
import useWebSocket, { ReadyState } from 'react-use-websocket';

//Change to your own ws URL
const WS_URL = 'ws://localhost:8000/ws';

const isBuzzerEvent = (message) => {
  let evt = JSON.parse(message.data);
  return evt.type === 'buzzerevent';
};

const BuzzerButton = ({ wsUser }) => {
  const { sendJsonMessage, readyState } = useWebSocket(WS_URL, {
    onOpen: () => {
      console.log('WebSocket connection established.');
    },
    share: true,
    filter: () => false,
    retryOnError: true,
    shouldReconnect: () => true,
  });
  return (
    <>
      <div className='container-fluid'>
        <Buzzer wsUser={wsUser} />
      </div>
    </>
  );
};

const Buzzer = ({ wsUser }) => {
  const redCode = '#f44336';
  const greenCode = '#4CAF50';
  const [play, { stop }] = useSound(spongebob, { volume: 0.05 });
  const { readyState } = useWebSocket(WS_URL);
  const { lastJsonMessage, sendJsonMessage } = useWebSocket(WS_URL, {
    share: true,
    filter: isBuzzerEvent,
  });
  const [chosenColor, setChosenColor] = useState(redCode);
  useEffect(() => {
    setChosenColor(lastJsonMessage ? lastJsonMessage.data.color : chosenColor);
    if (lastJsonMessage) {
      stop();
      play();
    }
  }, [lastJsonMessage]);

  const handleClickSendMessage = async () => {
    const newColor = chosenColor === redCode ? greenCode : redCode;
    sendJsonMessage({
      type: 'buzzerevent',
      content: `${wsUser}: hello`,
      color: newColor,
    });
    setChosenColor(newColor);
  };
  console.log('last JSON message', lastJsonMessage);

  return (
    <>
      <button
        onClick={handleClickSendMessage}
        disabled={readyState !== ReadyState.OPEN}
        style={{
          backgroundColor: chosenColor,
          position: 'fixed',
          top: '10px',
          borderRadius: '100%',
          padding: '20px',
          width: '100px',
          height: '100px',
        }}
      >
        Honk!
      </button>
    </>
  );
};

export default BuzzerButton;
