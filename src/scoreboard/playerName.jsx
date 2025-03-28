import { motion } from "framer-motion";
import { useEffect, useState } from 'react';

export const modes = Object.freeze({
  LIT: "mode-lit",
  NORMAL: "mode-normal",
  DARK: "mode-dark"
});

function PlayerName({ name, mode, buzzed }) {
  const [active, setActive] = useState(true);

  const [topText, setTopText] = useState("");
  const [bottomText, setBottomText] = useState("");

  const [count, setCount] = useState(0);

  function incrementCount(e, amount) {
    setCount(count + amount);
    e.stopPropagation();
  }

  useEffect(() => {
    setActive(true);
  }, [buzzed]);

  return (
    <>
      <motion.div
        onClick={(e) => {
          // e.stopPropagation();
          setActive(!active);
        }}
        key={name}
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{
          layout: { duration: 0.3 },
          opacity: { duration: 0.2 },
        }}
      >
        <div className="metal-container">
          <div
            className="overlay-div"

          />

          <div className="metal-inner">
            <div className={"content " + (active ? mode : "mode-dark")}>

              <h1 className={"no-select"}>{name}</h1>

              <div className="fake-number-container">
                <h1 id="number" style={{ fontSize: 60 }}>{count}</h1>


                <div className="button-overlay no-select" style={{ top: 0 }}
                  onMouseOver={() => setTopText("▲")}
                  onMouseOut={() => setTopText("")}
                  onClick={(e) => incrementCount(e, 1)}
                >
                  {topText}
                </div>


                <div className="button-overlay no-select" style={{ bottom: 0 }}
                  onMouseOver={() => setBottomText("▼")}
                  onMouseOut={() => setBottomText("")}
                  onClick={(e) => incrementCount(e, -1)}
                >
                  {bottomText}
                </div>

              </div>

            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}

export function CategoryHeader({ text }) {
  return (
    <>
      <motion.div
        key={text}
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{
          layout: { duration: 0.3 },
          opacity: { duration: 0.2 },
        }}
      >
        <div className="category-text">
          {/*<div className="metal-inner">*/}
          {/*<div className={"content " + mode}>*/}
          <h2 className={"no-select"}>{text}</h2>
          {/*</div>*/}
          {/*</div>*/}
        </div>
      </motion.div>
    </>
  );
}

export default PlayerName