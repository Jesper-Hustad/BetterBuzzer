import './scoreboard.css'
import PlayerName, {CategoryHeader} from "./playerName.jsx";
import {modes} from "./playerName.jsx";



import { AnimatePresence } from "framer-motion";
import {useState} from "react";

const initialPlayers = [
    { name: "Buzzer beasts", mode: modes.LIT },
    { name: "Team tangerine", mode: modes.NORMAL },
    { name: "Team tangerineee", mode: modes.NORMAL },
    { name: "Feal ferrow", mode: modes.DARK },
    // { name: "Feal ferrow", mode: modes.DARK },
    { name: "Feal ferrowss", mode: modes.DARK }
];

function Scoreboard({buzzedPlayers, activePlayers}) {

    const noPlayers = buzzedPlayers.length + activePlayers.length === 0
    const noActivePlayers = activePlayers.length === 0 && buzzedPlayers.length > 0

    return (
        <>
            <div className="styled-box">
                <div className="list-container">


                    <AnimatePresence  mode="popLayout" initial={false}>

                        {buzzedPlayers.map(({ id, name, timestamp, connected }, i) => (
                          <PlayerName key={name} name={name} buzzed={true} mode={modes.LIT} />
                        ))}

                        {(noActivePlayers) ? null : (
                          <CategoryHeader text={noPlayers ? "Venter for spillere" : "Ikke svart:"}></CategoryHeader>

                            // <CategoryHeader text={noPlayers ? "Waiting for players" : "Not answered:"}></CategoryHeader>
                        )}


                        {activePlayers.map(({ id, name, connected }, i) => (
                          <PlayerName key={name} name={name} buzzed={false} mode={modes.NORMAL} />
                        ))}

                    </AnimatePresence>

                </div>
            </div>
        </>
    )
}

export default Scoreboard