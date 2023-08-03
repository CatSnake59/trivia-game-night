import React, { useEffect, useCallback, useState } from 'react';
import {
  Navbar,
  NavbarBrand,
  UncontrolledTooltip
} from 'reactstrap';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { DefaultEditor } from 'react-simple-wysiwyg';
import Avatar from 'react-avatar';
import '../Styles/wssdemo.css'



const WS_URL = 'ws://localhost:8000/ws';


function isUserEvent(message) {
  let evt = JSON.parse(message.data);
  return evt.type === 'userevent';
}

function isDocumentEvent(message) {
  let evt = JSON.parse(message.data);
  return evt.type === 'contentchange';
}

function WebSocketDemo({ wsUser }) {
  const [username, setUsername] = useState('');
  const { sendJsonMessage, readyState } = useWebSocket(WS_URL, {
    onOpen: () => {
      console.log('WebSocket connection established.');
    },
    share: true,
    filter: () => false,
    retryOnError: true,
    shouldReconnect: () => true
  });

  useEffect(() => {
    if(username && readyState === ReadyState.OPEN) {
      sendJsonMessage({
        username,
        type: 'userevent'
      });
    }
  }, [username, sendJsonMessage, readyState]);

  return (
    <>
      {/* <Navbar color="light" light>
        <NavbarBrand href="/">Real-time document editor</NavbarBrand>
      </Navbar>*/}
      <div className="container-fluid">
        <ButtonTest wsUser={wsUser} />
      {/* <EditorSection/> */}
        {/* {username ? <EditorSection/>
            : <LoginSection onLogin={setUsername}/> } */}
      </div> 
    </>
  );
}

function ButtonTest({ wsUser }) {
  const { readyState } = useWebSocket(WS_URL);
  const { lastJsonMessage, sendJsonMessage } = useWebSocket(WS_URL, {
    share: true,
    filter: isDocumentEvent
  });
  const [ chosenColor, setChosenColor ] = useState('red');
  // let chosenColor = 'red';
  useEffect(()=>{
    console.log('lastJsonMessage Color', lastJsonMessage?lastJsonMessage.data.color:null);
    console.log('useEffect color', chosenColor);
    setChosenColor(lastJsonMessage?lastJsonMessage.data.color:chosenColor);

  },[lastJsonMessage])
  
  const handleClickSendMessage = async () => {
    const newColor = (chosenColor === 'red') ? 'green' : 'red';

    // console.log('before: ', chosenColor);
    // console.log('strict equal: ', (chosenColor === 'red'));
    // // (chosenColor === 'red') ? setChosenColor('green') : setChosenColor('red');
    // if (chosenColor === 'red') {
    //   console.log('in green');
    //   setChosenColor('green');
    //   console.log('line 79: ', chosenColor);
    // }
    // else {
    //   console.log('in red');
    //   setChosenColor('red');
    // }
    // console.log('after:', chosenColor);
    // (lastJsonMessage.data.color === 'red') ? setChosenColor('green') : setChosenColor('red');
    sendJsonMessage({type: 'contentchange', content: `${wsUser}: hello`, color: newColor})
    setChosenColor(newColor);
  }
  console.log('last JSON message', lastJsonMessage);
  

  return (
  <>
    <button
      onClick={handleClickSendMessage}
      disabled={readyState !== ReadyState.OPEN} style={{backgroundColor: chosenColor}}
    >
      Click Me to send 'Hello'
    </button>
  </>
  )
}

// function LoginSection({ onLogin }) {
//   const [username, setUsername] = useState('');
//   useWebSocket(WS_URL, {
//     share: true,
//     filter: () => false
//   });
//   function logInUser() {
//     if(!username.trim()) {
//       return;
//     }
//     onLogin && onLogin(username);
//   }

//   return (
//     <div className="account">
//       <div className="account__wrapper">
//         <div className="account__card">
//           <div className="account__profile">
//             <p className="account__name">Hello, user!</p>
//             <p className="account__sub">Join to Buzz</p>
//           </div>
//           <input name="username" onInput={(e) => setUsername(e.target.value)} className="form-control" />
//           <button
//             type="button"
//             onClick={() => logInUser()}
//             className="btn btn-primary account__btn">Join</button>
//         </div>
//       </div>
//     </div>
//   );
// }

// function History() {
//   console.log('history');
//   const { lastJsonMessage } = useWebSocket(WS_URL, {
//     share: true,
//     filter: isUserEvent
//   });
//   const activities = lastJsonMessage?.data.userActivity || [];
//   return (
//     <ul>
//       {activities.map((activity, index) => <li key={`activity-${index}`}>{activity}</li>)}
//     </ul>
//   );
// }

// function Users() {
//   const { lastJsonMessage } = useWebSocket(WS_URL, {
//     share: true,
//     filter: isUserEvent
//   });
//   const users = Object.values(lastJsonMessage?.data.users || {});
//   return users.map(user => (
//     <div key={user.username}>
//       <span id={user.username} className="userInfo" key={user.username}>
//         <Avatar name={user.username} size={40} round="20px"/>
//       </span>
//       <UncontrolledTooltip placement="top" target={user.username}>
//         {user.username}
//       </UncontrolledTooltip>
//     </div>
//   ));
// }


// function EditorSection() {
//   return (
//     <div className="main-content">
//       <div className="document-holder">
//         <div className="currentusers">
//           <Users/>
//         </div>
//         <Document/>
//       </div>
//       <div className="history-holder">
//         <History/>
//       </div>
//     </div>
//   );
// }


// function Document() {
//   const { sendMessage, lastMessage, readyState } = useWebSocket(WS_URL);

//   const { lastJsonMessage, sendJsonMessage } = useWebSocket(WS_URL, {
//     share: true,
//     filter: isDocumentEvent
//   });



//   let html = lastJsonMessage?.data.editorContent || '';
//   const handleClickSendMessage = () => sendJsonMessage({type: 'contentchange', content: `${html} hello`})

//   function handleHtmlChange(e) {
//     sendJsonMessage({
//       type: 'contentchange',
//       content: e.target.value
//     });
//   }

//   return (
//     <>
//     <button
//     onClick={handleClickSendMessage}
//     disabled={readyState !== ReadyState.OPEN}
//   >
//     Click Me to send 'Hello'
//   </button>
//     <DefaultEditor value={html} onChange={handleHtmlChange} /></>
//   );
// }


export default WebSocketDemo;