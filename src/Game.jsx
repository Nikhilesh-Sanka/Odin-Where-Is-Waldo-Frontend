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
  function startGame(e) {
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
              <li className={GameStyles["hit"]} key={instruction.id}>
                <div>
                  <img src={instruction["image_url"]} />
                </div>
                {instruction["instruction"]}
              </li>
            );
          }
          return (
            <li key={instruction.id}>
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
  const [pointerCoordinates, setPointerCoordinates] = useState(null);
  function handleTargetHit(e) {
    e.stopPropagation();
    console.log("click is listened");
    pointer.current.classList.remove(GameStyles["visible"]);
    const instructionId = parseInt(e.currentTarget.id);
    const gameInfoId = props.gameInfoId;
    const hitCoordinates = pointerCoordinates;
    console.log(instructionId, gameInfoId, hitCoordinates);
    if (props.hitTargets.some((hitTarget) => hitTarget === instructionId)) {
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
      console.log(response.status);
      if (response.status === 200) {
        props.setHitTargets((hitTargets) => {
          return [...hitTargets, instructionId];
        });
        props.setHitCoordinates([...props.hitCoordinates, hitCoordinates]);
        if (props.hitTargets.length === 2) {
          props.setGameStatus("over");
        }
        props.setTargetHitStatus("it's a hit");
      } else if (response.status === 202) {
        props.setTargetHitStatus("it's a miss");
      }
    });
  }
  function handleClick(e) {
    if (pointer.current.classList.contains(GameStyles["visible"])) {
      pointer.current.childNodes[1].childNodes.forEach((childNode) => {
        childNode.removeEventListener("click", handleTargetHit, true);
      });
      pointer.current.classList.remove(GameStyles["visible"]);
    } else {
      if (e.target.id === "marker") {
        return;
      }
      let x = e.clientX - display.current.getBoundingClientRect().left;
      let y = e.clientY - display.current.getBoundingClientRect().top;
      const relativeCoordinates = getRelativeCoordinates(x, y);
      pointer.current.classList.add(GameStyles["visible"]);
      pointer.current.style.top = `${y - 25}px`;
      pointer.current.style.left = `${x - 25}px`;
      setPointerCoordinates(relativeCoordinates);
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
                <li
                  id={instruction.id}
                  key={instruction.id}
                  onClick={handleTargetHit}
                >
                  <div>
                    <img src={instruction["image_url"]} />
                  </div>
                  {instruction.instruction}
                </li>
              );
            })}
        </ul>
      </div>
      {props.hitCoordinates.map((hitCoordinate, index) => {
        return (
          <Marker coordinates={hitCoordinate} key={index} display={display} />
        );
      })}
    </div>
  );
}
function PopupBox(props) {
  const [continuePressed, setContinuePressed] = useState(null);
  return (
    <>
      <div className={GameStyles["popup"]}>
        <h2>Press continue to start the game</h2>
        {continuePressed ? (
          <Loading />
        ) : (
          <button
            onClick={(e) => {
              props.startGame(e);
              setContinuePressed(true);
            }}
          >
            Continue
          </button>
        )}
      </div>
      <div className={GameStyles["blur"]}></div>
    </>
  );
}

// marker
function Marker({ coordinates, display }) {
  const marker = useRef(null);
  function placeMarker() {
    const displayRect = display.current.getBoundingClientRect();
    const x = (coordinates[0] * displayRect.width) / 100;
    const y = (coordinates[1] * displayRect.height) / 100;
    marker.current.style.left = `${x - 15}px`;
    marker.current.style.top = `${y - 15}px`;
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
