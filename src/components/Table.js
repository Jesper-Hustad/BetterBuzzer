import React, { useState, useEffect, useRef } from 'react';
import { get, some, values, sortBy, orderBy, isEmpty, round } from 'lodash';
import { Howl } from 'howler';
import { AiOutlineDisconnect } from 'react-icons/ai';
import { Container } from 'react-bootstrap';
import Header from '../components/Header';
import Scoreboard from '../scoreboard/scoreboard';

export default function Table(game) {
  const [loaded, setLoaded] = useState(false);
  const [buzzed, setBuzzer] = useState(
    some(game.G.queue, (o) => o.id === game.playerID)
  );
  const [lastBuzz, setLastBuzz] = useState(null);
  const [sound, setSound] = useState(false);
  const [soundPlayed, setSoundPlayed] = useState(false);
  const buzzButton = useRef(null);
  const queueRef = useRef(null);


  const [soundFiles, setSoundFiles] = useState([]);
  const [playerSoundMapping, setplayerSoundMapping] = useState({});



  useEffect(() => {
    fetch(`${process.env.PUBLIC_URL}/sounds/sounds.json`)
      .then((res) => res.json())
      .then((files) => {
        setSoundFiles(files.map(file => `${process.env.PUBLIC_URL}/sounds/${file}`));
      });
    console.log(soundFiles);
  }, []);

  useEffect(() => {
    console.log("NEW PLAYER SOUND MAPPING", playerSoundMapping)


    // let initialPlayerSoundMapping = {};
    // (!game.gameMetadata ? [] : game.gameMetadata)
    //   .filter((p) => p.name)
    //   .forEach((p) => initialPlayerSoundMapping[p.id] = soundFiles[0]);
    // setplayerSoundMapping(initialPlayerSoundMapping);
    //
    // console.log("INITAL PLAYER MAPPING SOUND", initialPlayerSoundMapping)

  }, [playerSoundMapping]);


  // run "npm run prestart" to generate the JSON file (is automatically generate at build and dev)
  function getBuzzSound(path) {
    console.log(path);
    return new Howl({
      src: [path],
      volume: 0.5,
      rate: 1,
    });
}


  const playSound = (id) => {
    if (sound && !soundPlayed) {
      const soundPath = playerSoundMapping[id]
      console.log("PLAYING SOUND for id", id, soundPath);
      getBuzzSound(soundPath).play();
      setSoundPlayed(true);
    }
  };

  const getLastBuzzInQueue = (obj) => {
    return obj[Object.keys(obj).reduce((newest, key) =>
        obj[key].timestamp > obj[newest].timestamp ? key : newest,
      Object.keys(obj)[0])
      ].id;
  };

  useEffect(() => {
    console.log(game.G.queue, Date.now());
    // reset buzzer based on game
    if (!game.G.queue[game.playerID]) {
      // delay the reset, in case game state hasn't reflected your buzz yet
      if (lastBuzz && Date.now() - lastBuzz < 500) {
        setTimeout(() => {
          const queue = queueRef.current;
          if (queue && !queue[game.playerID]) {
            setBuzzer(false);
          }
        }, 500);
      } else {
        // immediate reset, if it's been awhile
        setBuzzer(false);
      }
    }

    // reset ability to play sound if there is no pending buzzer
    if (isEmpty(game.G.queue)) {
      setSoundPlayed(false);
    } else if (loaded) {
      playSound(getLastBuzzInQueue(game.G.queue));
    }

    if (!loaded) {
      setLoaded(true);
    }

    queueRef.current = game.G.queue;
  }, [game.G.queue]);

  const attemptBuzz = () => {
    if (!buzzed) {
      playSound();
      game.moves.buzz(game.playerID);
      setBuzzer(true);
      setLastBuzz(Date.now());
    }
  };

  // spacebar will buzz
  useEffect(() => {
    function onKeydown(e) {
      if (e.keyCode === 32 && !e.repeat) {
        buzzButton.current.click();
        e.preventDefault();
      }
    }
    window.addEventListener('keydown', onKeydown);
    return () => window.removeEventListener('keydown', onKeydown);
  }, []);

  const playersTemp = !game.gameMetadata
    ? []
    : game.gameMetadata
        .filter((p) => p.name)
        .map((p) => ({ ...p, id: String(p.id) }));
  // host is lowest active user
  const firstPlayer =
    get(
      sortBy(playersTemp, (p) => parseInt(p.id, 10)).filter((p) => p.connected),
      '0'
    ) || null;
  const isHost = get(firstPlayer, 'id') === game.playerID;
  const players = playersTemp.filter((p) => p.id !== get(firstPlayer, 'id'));


  const queue = sortBy(values(game.G.queue), ['timestamp']);
  const buzzedPlayers = queue
    .map((p) => {
      const player = players.find((player) => player.id === p.id);
      if (!player) {
        return {};
      }
      return {
        ...p,
        name: player.name,
        connected: player.connected,
      };
    })
    .filter((p) => p.name);
  // active players who haven't buzzed
  const activePlayers = orderBy(
    players.filter((p) => !some(queue, (q) => q.id === p.id)),
    ['connected', 'name'],
    ['desc', 'asc']
  );




  const timeDisplay = (delta) => {
    if (delta > 1000) {
      return `+${round(delta / 1000, 2)} s`;
    }
    return `+${delta} ms`;
  };

  const spriteWidth = 284;
  const spriteHeight = 203;

  return (
    <div>
      <Header
        auth={game.headerData}
        clearAuth={() =>
          game.headerData.setAuth({
            playerID: null,
            credentials: null,
            roomID: null,
          })
        }
        sound={sound}
        setSound={() => setSound(!sound)}
        setSoundMapping={setplayerSoundMapping}
        soundMapping={playerSoundMapping}
        soundFiles={soundFiles}
        players={players}
        isHost={isHost}
      />
      <Container>
        <section>
          {/*SHOULD REMOVE LATER*/}
          {isHost ? <p id="room-title">Room {game.gameID}</p> : null}

          {!game.isConnected ? (
            <p className="warning">Disconnected - attempting to reconnect...</p>
          ) : null}

          {isHost ? (
            <Scoreboard
              style={{ width: '500px', height: '500px' }}
              buzzedPlayers={buzzedPlayers}
              activePlayers={activePlayers}
            ></Scoreboard>
          ) : null}

          {isHost ? null : (
            <div
              id="buzzer"
              ref={buzzButton}
              style={{
                width: spriteWidth,
                height: spriteHeight,
                overflow: 'hidden',
                cursor: 'pointer',
                backgroundImage: "url('/red-button-HD-sprite.png')", // Replace with actual sprite path
                backgroundPosition:
                  buzzed || game.G.locked ? `-${spriteWidth}px 0` : '0 0',
                backgroundSize: `${spriteWidth * 2}px ${spriteHeight}px`,
                margin: 'auto',
                marginTop: '220px',
              }}
              onClick={() => {
                if (!buzzed && !game.G.locked) {
                  attemptBuzz();
                }
              }}
            />
          )}

          {isHost ? (
            <div className="settings">
              <div className="button-container">
                <button
                  className="text-button"
                  onClick={() => game.moves.toggleLock()}
                >
                  {game.G.locked ? 'Unlock buzzers' : 'Lock buzzers'}
                </button>
              </div>
              <div className="button-container">
                <button
                  disabled={isEmpty(game.G.queue)}
                  onClick={() => game.moves.resetBuzzers()}
                >
                  Reset all buzzers
                </button>
              </div>

              <div className="button-container">
                <button
                  style={{ marginTop: '30px' }}
                  disabled={isEmpty(game.G.queue) || !soundPlayed}
                  onClick={() => setSoundPlayed(false)}
                >
                  Reactivate buzzer sound
                </button>
              </div>

              <div className="divider" />
            </div>
          ) : null}
        </section>
        <div className="queue">
          <p>Players Buzzed</p>
          <ul>
            {buzzedPlayers.map(({ id, name, timestamp, connected }, i) => (
              <li key={id} className={isHost ? 'resettable' : null}>
                <div
                  className="player-sign"
                  onClick={() => {
                    if (isHost) {
                      game.moves.resetBuzzer(id);
                    }
                  }}
                >
                  <div className={`name ${!connected ? 'dim' : ''}`}>
                    {name}
                    {!connected ? (
                      <AiOutlineDisconnect className="disconnected" />
                    ) : (
                      ''
                    )}
                  </div>
                  {i > 0 ? (
                    <div className="mini">
                      {timeDisplay(timestamp - queue[0].timestamp)}
                    </div>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="queue">
          <p>Other Players</p>
          <ul>
            {activePlayers.map(({ id, name, connected }) => (
              <li key={id}>
                <div className={`name ${!connected ? 'dim' : ''}`}>
                  {name}
                  {!connected ? (
                    <AiOutlineDisconnect className="disconnected" />
                  ) : (
                    ''
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* SHOULD REMOVE LATER */}
        {isHost ? null : <p>Room {game.gameID}</p>}
      </Container>
    </div>
  );
}
