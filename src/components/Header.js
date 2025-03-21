import React from 'react';
import {useState, useEffect} from 'react'
import { Navbar } from 'react-bootstrap';
import { isNil } from 'lodash';
import { useHistory } from 'react-router';
import { leaveRoom } from '../lib/endpoints';


function getSimpleFilename(path) {
  return path.split('/')[2].split('.')[0]
  // return path.split('/').pop().split('.').first();
}


function Logo({ size = 25 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 95 95"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="20" cy="20" r="20" fill="#F2994A" />
      <circle cx="75" cy="20" r="20" fill="#348DF5" />
      <circle cx="20" cy="75" r="20" fill="#348DF5" />
      <circle cx="75" cy="75" r="20" fill="#348DF5" />
    </svg>
  );
}


export default function Header({
  auth = {},
  clearAuth,
  sound = null,
  setSound,
  setSoundMapping,
  soundMapping,
  soundFiles,
  players,
  isHost,
}) {
  const history = useHistory();
  // const [a,b] = useState("a")
  const [isModalOpen, setIsModalOpen] = useState(false);


  const openModal = () => {
    setIsModalOpen(true); // Show the modal
  };

  const closeModal = () => {
    setIsModalOpen(false); // Close the modal
  };

  const handleSelectPlayer = (e) => {
    setSelectedPlayer(e.target.value);
  };

  const handleSelectOption = (e) => {
    setSelectedOption(e.target.value);
  };

  const handleSelectionChange = (playerID, event) => {
    setSoundMapping({
      ...soundMapping,
      [playerID]: event.target.value
    });

    console.log("SET NEW VALUE FOR SOUND MAPPING", {
      ...soundMapping,
      [playerID]: event.target.value
    })
  };

  // leave current game
  async function leave() {
    try {
      await leaveRoom(auth.roomID, auth.playerID, auth.credentials);
      clearAuth();
      history.push('/');
    } catch (error) {
      console.log('leave error', error);
      clearAuth();
      history.push('/');
    }
  }

  return (
    <header>
      {isModalOpen && (
        <div style={modalStyle}>
          <div style={modalContentStyle}>
            <h2>Set custom sound</h2>
            {players.map((player) => {
              return (
                <label style={{ display: 'block' }}>
                  {player.name}:
                  <select onChange={(e) => handleSelectionChange(player.id, e)}>
                    <option key={"000"} value={"ERROR"}>
                      Select sound
                    </option>
                    {soundFiles.map((path) => (
                      <option key={path} value={path}>
                        {getSimpleFilename(path)}
                      </option>
                    ))}
                  </select>
                  <br />
                </label>
              );
            })}
            <br />
            <button onClick={closeModal}>Close</button>
          </div>
        </div>
      )}

      <Navbar>
        <Navbar.Brand>
          <Logo /> Multibuzzer
        </Navbar.Brand>
        <div className="nav-buttons">
          {isHost ? (
            <button className="text-button" onClick={openModal}>
              Set sound
            </button>
          ) : null}
          {!isNil(sound) ? (
            <button className="text-button" onClick={() => setSound()}>
              {sound ? 'Turn off sound' : 'Turn on sound'}
            </button>
          ) : null}
          {clearAuth ? (
            <button className="text-button" onClick={() => leave()}>
              Leave game
            </button>
          ) : null}
        </div>
      </Navbar>
    </header>
  );
}


// Styles for the modal
const modalStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  // backgroundColor: '#454545',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
};

const modalContentStyle = {
  backgroundColor:  '#424849',
  padding: '20px',
  borderRadius: '12px',
  textAlign: 'center',
};
