import NavBar from "./components/NavBar.jsx";
import Loading from "./components/Loading.jsx";
import GameOverPopUp from "./components/GameOverPopUp.jsx";
import Toast from "./components/Toast.jsx";
import { serverUrl } from "./config.js";
import GameStyles from "./css-modules/Game.module.css";
import { useRef, useState, useEffect } from "react";
import { useParams } from "react-router-dom";

export default function Game() {
  const [startTime, setStartTime] = useState(null);
  const [time, setTime] = useState(0);
  const [gameDetails, setGameDetails] = useState(null);
  const [gameInfoId, setGameInfoId] = useState(null);
  const [gameStatus, setGameStatus] = useState("going");
  const [targetHitStatus, setTargetHitStatus] = useState(null);
  const [hitTargets, setHitTargets] = useState([]);
  const [hitCoordinates, setHitCoordinates] = useState([]);
  const { gameId } = useParams();
  useEffect(() => {
    if (!gameDetails) {
      fetch(`${serverUrl}/game?gameId=${gameId}`)
        .then((response) => response.json())
        .then((response) => setGameDetails(response));
    }
    if (startTime && gameStatus === "going") {
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
    fetch(`${serverUrl}/startGame`, {
      method: "POST",
      body: JSON.stringify({
        gameId: gameDetails.id,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((response) => {
        setGameInfoId(response.gameInfoId);
        setStartTime(new Date().getTime());
      });
  }
  return (
    <div>
      <NavBar />
      {gameDetails ? (
        <>
          <GameInstructions
            time={time}
            instructions={gameDetails.instructions}
            hitTargets={hitTargets}
          />
          <GameDisplay
            gameDetails={gameDetails}
            gameInfoId={gameInfoId}
            setHitTargets={setHitTargets}
            hitTargets={hitTargets}
            setGameStatus={setGameStatus}
            setTargetHitStatus={setTargetHitStatus}
            hitCoordinates={hitCoordinates}
            setHitCoordinates={setHitCoordinates}
          />
          {startTime ? null : <PopupBox startGame={startGame} />}
          {gameStatus === "over" ? (
            <GameOverPopUp time={time} gameInfoId={gameInfoId} />
          ) : null}
        </>
      ) : (
        <Loading />
      )}
      {targetHitStatus ? (
        <Toast
          targetHitStatus={targetHitStatus}
          setTargetHitStatus={setTargetHitStatus}
        />
      ) : null}
    </div>
  );
}

function GameInstructions(props) {
  return (
    <div className={GameStyles["game-instructions"]}>
      <p>Time: {props.time}s</p>
      <ul>
        {props.instructions.map((instruction) => {
          if (
            props.hitTargets.some((hitTarget) => hitTarget === instruction.id)
          ) {
            return (
              <li className={GameStyles["hit"]}>
                <div>
                  <img src={instruction["image_url"]} />
                </div>
                {instruction["instruction"]}
              </li>
            );
          }
          return (
            <li>
              <div>
                <img src={instruction["image_url"]} />
              </div>
              {instruction["instruction"]}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function GameDisplay(props) {
  const pointer = useRef(null);
  const display = useRef(null);
  const selectionMenu = useRef(null);
  function handleClick(e) {
    if (pointer.current.classList.contains(GameStyles["visible"])) {
      pointer.current.classList.remove(GameStyles["visible"]);
    } else {
      if (e.target.id === "marker") {
        return;
      }
      let x = e.clientX - display.current.getBoundingClientRect().left;
      let y = e.clientY - display.current.getBoundingClientRect().top;
      pointer.current.classList.add(GameStyles["visible"]);
      pointer.current.style.top = `${y - 25}px`;
      pointer.current.style.left = `${x - 25}px`;
      const relativeCoordinates = getRelativeCoordinates(x, y);
      selectionMenu.current.childNodes.forEach((node) => {
        node.addEventListener("click", (e) => {
          e.stopPropagation();
          pointer.current.classList.remove(GameStyles["visible"]);
          const instructionId = parseInt(node.id);
          const gameInfoId = props.gameInfoId;
          const hitCoordinates = relativeCoordinates;
          if (
            props.hitTargets.some((hitTarget) => hitTarget === instructionId)
          ) {
            return;
          }
          fetch(`${serverUrl}/hitTarget`, {
            method: "POST",
            body: JSON.stringify({
              instructionId,
              hitCoordinates,
              gameInfoId,
            }),
            headers: {
              "Content-Type": "application/json",
            },
          }).then((response) => {
            if (response.status === 200) {
              props.setHitTargets((hitTargets) => {
                return [...hitTargets, instructionId];
              });
              props.setHitCoordinates([...props.hitCoordinates, [x, y]]);
              if (props.hitTargets.length === 2) {
                props.setGameStatus("over");
              }
              props.setTargetHitStatus("it's a hit");
            } else {
              props.setTargetHitStatus("it's a miss");
            }
          });
        });
      });
    }
  }
  function getRelativeCoordinates(x, y) {
    const displayRect = display.current.getBoundingClientRect();
    let xRelative = (x / displayRect.width) * 100;
    let yRelative = (y / displayRect.height) * 100;
    return [xRelative, yRelative];
  }
  return (
    <div
      className={GameStyles["game-display"]}
      ref={display}
      onClick={handleClick}
    >
      <img src={props.gameDetails["image_url"]} />
      <div className={GameStyles["pointer"]} ref={pointer}>
        <div></div>
        <ul ref={selectionMenu}>
          {props.gameDetails.instructions
            .filter((instruction) =>
              props.hitTargets.every(
                (hitTarget) => hitTarget !== instruction.id
              )
            )
            .map((instruction) => {
              return (
                <li id={instruction.id} key={instruction.id}>
                  <div>
                    <img src={instruction["image_url"]} />
                  </div>
                  {instruction.instruction}
                </li>
              );
            })}
        </ul>
      </div>
      {props.hitCoordinates.map((hitCoordinate) => {
        return <Marker coordinates={hitCoordinate} />;
      })}
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

// marker
function Marker({ coordinates }) {
  const marker = useRef(null);
  function placeMarker() {
    marker.current.style.left = `${coordinates[0] - 15}px`;
    marker.current.style.top = `${coordinates[1] - 15}px`;
  }
  useEffect(() => {
    placeMarker();
  }, []);
  return (
    <div className={GameStyles["marker"]} ref={marker}>
      <img src="./marker-icon.svg" id="marker" />
    </div>
  );
}
