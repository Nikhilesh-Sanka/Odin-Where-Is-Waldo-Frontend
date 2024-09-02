import NavBar from "./components/NavBar.jsx";
import GameStyles from "./css-modules/Game.module.css";
import { useRef, useState, useEffect } from "react";

const targetDetails = [
  { id: 1, x: [72, 75], y: [33, 36] },
  { id: 2, x: [74, 77], y: [64, 67] },
  { id: 3, x: [82, 85], y: [17, 21] },
];

function getTarget(coordinates) {
  let x = coordinates[0];
  let y = coordinates[1];
  for (let target of targetDetails) {
    if (
      x >= target.x[0] &&
      x <= target.x[1] &&
      y >= target.y[0] &&
      y <= target.y[1]
    ) {
      return target;
    }
  }
  return;
}
export default function Game() {
  const [startTime, setStartTime] = useState(null);
  const [time, setTime] = useState(0);
  useEffect(() => {
    if (startTime) {
      const interval = setInterval(
        () => setTime((new Date().getTime() - startTime) / 1000),
        1
      );
      return () => {
        clearInterval(interval);
      };
    }
  }, [time, startTime]);
  function startGame() {
    setStartTime(new Date().getTime());
  }
  return (
    <div>
      <NavBar />
      <GameInstructions time={time} />
      <GameDisplay />
      {startTime ? null : <PopupBox startGame={startGame} />}
    </div>
  );
}

function GameInstructions(props) {
  return (
    <div className={GameStyles["game-instructions"]}>
      <p>Time: {props.time}s</p>
      <ul>
        <li>
          <div>
            <img src="https://wcpfbviuzlawwrsfvnnp.supabase.co/storage/v1/object/sign/game-images/main-images/iname-1-instruction-1.jpeg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJnYW1lLWltYWdlcy9tYWluLWltYWdlcy9pbmFtZS0xLWluc3RydWN0aW9uLTEuanBlZyIsImlhdCI6MTcyNTI3MjEzNiwiZXhwIjo0ODc4ODcyMTM2fQ.81kAI69psKYjDK45XTd7_MUfyHnJR-LutsvtQUt_CqQ&t=2024-09-02T10%3A15%3A36.212Z" />
          </div>
          Doctor
        </li>
        <li>
          <div>
            <img src="https://wcpfbviuzlawwrsfvnnp.supabase.co/storage/v1/object/sign/game-images/main-images/image-1-instruction-2.jpeg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJnYW1lLWltYWdlcy9tYWluLWltYWdlcy9pbWFnZS0xLWluc3RydWN0aW9uLTIuanBlZyIsImlhdCI6MTcyNTI3MjA1OSwiZXhwIjo0ODc4ODcyMDU5fQ.J7agG0DLsJAlD1dbpQ27pspZKR26XLnsfD17pWkt64k&t=2024-09-02T10%3A14%3A19.466Z" />
          </div>
          Magician
        </li>
        <li>
          <div>
            <img src="https://wcpfbviuzlawwrsfvnnp.supabase.co/storage/v1/object/sign/game-images/main-images/image-1-instruction-3.jpeg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJnYW1lLWltYWdlcy9tYWluLWltYWdlcy9pbWFnZS0xLWluc3RydWN0aW9uLTMuanBlZyIsImlhdCI6MTcyNTI3MjE4OCwiZXhwIjo0ODc4ODcyMTg4fQ.8G7ckrbq1Rbiswz6oGT01XYDSJQlvfZf4sSxDe_D-fA&t=2024-09-02T10%3A16%3A28.282Z" />
          </div>
          Hard Worker
        </li>
      </ul>
    </div>
  );
}

function GameDisplay() {
  const pointer = useRef(null);
  const display = useRef(null);
  const selectionMenu = useRef(null);
  const [hitTargets, setHitTargets] = useState([]);
  function handleClick(e) {
    if (pointer.current.classList.contains(GameStyles["visible"])) {
      pointer.current.classList.remove(GameStyles["visible"]);
    } else {
      let x = e.clientX - display.current.getBoundingClientRect().left;
      let y = e.clientY - display.current.getBoundingClientRect().top;
      pointer.current.classList.add(GameStyles["visible"]);
      pointer.current.style.top = `${y - 25}px`;
      pointer.current.style.left = `${x - 25}px`;
      const relativeCoordinates = getRelativeCoordinates(x, y);
      // const leftTargets = Array.from(selectionMenu.current.childNodes).filter(
      //   (target) => !target.classList.contains(GameStyles["hit"])
      // );
      // leftTargets.forEach((leftTarget) => {
      //   leftTarget.addEventListener("click", (e) => {
      //     e.stopPropagation();
      //     xyz(e, relativeCoordinates);
      //   });
      // });
      console.log(`x:${relativeCoordinates[0]},y:${relativeCoordinates[1]}`);
    }
  }
  function getRelativeCoordinates(x, y) {
    const displayRect = display.current.getBoundingClientRect();
    let xRelative = (x / displayRect.width) * 100;
    let yRelative = (y / displayRect.height) * 100;
    return [xRelative, yRelative];
  }
  function xyz(e, coordinates) {
    const id = parseInt(e.currentTarget.id);
    const hitTarget = getTarget(coordinates);
    console.log(e.currentTarget);
    // console.log(id, hitTarget);
    if (hitTarget) {
      if (hitTarget.id === id) {
        e.currentTarget.classList.add(GameStyles["hit"]);
        setHitTargets([...hitTargets, hitTarget]);
      }
    } else {
    }
  }
  return (
    <div
      className={GameStyles["game-display"]}
      onClick={handleClick}
      ref={display}
    >
      <img src="https://wcpfbviuzlawwrsfvnnp.supabase.co/storage/v1/object/sign/game-images/main-images/image2.webp?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJnYW1lLWltYWdlcy9tYWluLWltYWdlcy9pbWFnZTIud2VicCIsImlhdCI6MTcyNTI4NjQzOCwiZXhwIjo0ODc4ODg2NDM4fQ.z_0Yp0pFoML4SpQGbnjwV8tNbTAQoxdUoTKIL5WsN6s&t=2024-09-02T14%3A13%3A58.850Z" />
      <div className={GameStyles["pointer"]} ref={pointer}>
        <div></div>
        <ul ref={selectionMenu}>
          <li id="1">
            <div>
              <img src="https://wcpfbviuzlawwrsfvnnp.supabase.co/storage/v1/object/sign/game-images/main-images/iname-1-instruction-1.jpeg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJnYW1lLWltYWdlcy9tYWluLWltYWdlcy9pbmFtZS0xLWluc3RydWN0aW9uLTEuanBlZyIsImlhdCI6MTcyNTI3MjEzNiwiZXhwIjo0ODc4ODcyMTM2fQ.81kAI69psKYjDK45XTd7_MUfyHnJR-LutsvtQUt_CqQ&t=2024-09-02T10%3A15%3A36.212Z" />
            </div>
            Doctor
          </li>
          <li id="2">
            <div>
              <img src="https://wcpfbviuzlawwrsfvnnp.supabase.co/storage/v1/object/sign/game-images/main-images/image-1-instruction-2.jpeg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJnYW1lLWltYWdlcy9tYWluLWltYWdlcy9pbWFnZS0xLWluc3RydWN0aW9uLTIuanBlZyIsImlhdCI6MTcyNTI3MjA1OSwiZXhwIjo0ODc4ODcyMDU5fQ.J7agG0DLsJAlD1dbpQ27pspZKR26XLnsfD17pWkt64k&t=2024-09-02T10%3A14%3A19.466Z" />
            </div>
            Magician
          </li>
          <li id="3">
            <div>
              <img src="https://wcpfbviuzlawwrsfvnnp.supabase.co/storage/v1/object/sign/game-images/main-images/image-1-instruction-3.jpeg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJnYW1lLWltYWdlcy9tYWluLWltYWdlcy9pbWFnZS0xLWluc3RydWN0aW9uLTMuanBlZyIsImlhdCI6MTcyNTI3MjE4OCwiZXhwIjo0ODc4ODcyMTg4fQ.8G7ckrbq1Rbiswz6oGT01XYDSJQlvfZf4sSxDe_D-fA&t=2024-09-02T10%3A16%3A28.282Z" />
            </div>
            Hard Worker
          </li>
        </ul>
      </div>
    </div>
  );
}
function PopupBox(props) {
  return (
    <>
      <div className={GameStyles["popup"]}>
        <h2>Press continue to start the game</h2>
        <button onClick={props.startGame}>Continue</button>
      </div>
      <div className={GameStyles["blur"]}></div>
    </>
  );
}
