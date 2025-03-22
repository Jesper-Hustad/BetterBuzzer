import { motion } from "framer-motion";
import { useEffect, useState } from 'react';

export const modes = Object.freeze({
    LIT: "mode-lit",
    NORMAL: "mode-normal",
    DARK: "mode-dark"
});

function PlayerName({ name, mode, buzzed }) {
  const [active, setActive] = useState(true);

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