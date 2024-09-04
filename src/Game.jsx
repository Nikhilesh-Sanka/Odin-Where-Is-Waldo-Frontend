// importing the components
import NavBar from "./components/NavBar.jsx";
import Loading from "./components/Loading.jsx";
import GameOverPopUp from "./components/GameOverPopUp.jsx";
import Toast from "./components/Toast.jsx";

//importing the helper functions
import handleTargetHit from "./helper-functions/handleTargetHit.js";

// importing the configuration file
import { serverUrl } from "./config.js";

// importing the styles
import GameStyles from "./css-modules/Game.module.css";

// importing react hooks
import { useRef, useState, useEffect } from "react";
import { useParams } from "react-router-dom";

export default function Game() {
  const [time, setTime] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [gameDetails, setGameDetails] = useState(null);
  const [gameInfoId, setGameInfoId] = useState(null);
  const [targetHitStatus, setTargetHitStatus] = useState(null); // weather the hit was a miss or not
  const [hitTargets, setHitTargets] = useState([]); // it's a 2d array containing the
  const { gameId } = useParams();

  // setting game status
  const gameStatus = hitTargets.length < 3 ? "going" : "over";

  // fetching the game details and starting the timer
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

  //function to handle the start of the game
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
            setTargetHitStatus={setTargetHitStatus}
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

// The bar indicating the targets for players and the time elapsed
function GameInstructions(props) {
  return (
    <div className={GameStyles["game-instructions"]}>
      <p>Time: {props.time}s</p>
      <ul>
        {props.instructions.map((instruction) => {
          if (
            props.hitTargets.some(
              (hitTarget) => hitTarget[0] === instruction.id
            )
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

// Main display of the Game
function GameDisplay(props) {
  const pointer = useRef(null);
  const display = useRef(null);
  const selectionMenu = useRef(null);
  const [pointerCoordinates, setPointerCoordinates] = useState(null);

  // it handles hit request from the player
  function handleHit(e) {
    e.stopPropagation();
    props.setTargetHitStatus("getting-result");
    handleTargetHit(
      parseInt(e.currentTarget.id),
      pointer,
      pointerCoordinates,
      props.gameInfoId,
      props.hitTargets,
      props.setHitTargets,
      props.setTargetHitStatus
    );
  }

  // it handles the actions of the pointer when the game display is clicked
  function handleClick(e) {
    console.log("game clicked");
    if (e.target.id === "marker") {
      return;
    }
    if (pointer.current.classList.contains(GameStyles["visible"])) {
      pointer.current.classList.remove(GameStyles["visible"]);
    } else {
      let x = e.clientX - display.current.getBoundingClientRect().left;
      let y = e.clientY - display.current.getBoundingClientRect().top;
      const relativeCoordinates = getRelativeCoordinates(x, y);
      pointer.current.classList.add(GameStyles["visible"]);
      pointer.current.style.top = `${y - 25}px`;
      pointer.current.style.left = `${x - 25}px`;
      setPointerCoordinates(relativeCoordinates);
    }
  }

  // it gets the relative coordinates of the cursor with respect to the game display in percentage
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
      {/*Game Image*/}
      <img src={props.gameDetails["image_url"]} />

      {/* pointer */}
      <div className={GameStyles["pointer"]} ref={pointer}>
        <div></div>
        <ul ref={selectionMenu}>
          {props.gameDetails.instructions
            .filter((instruction) =>
              props.hitTargets.every(
                (hitTarget) => hitTarget[0] !== instruction.id
              )
            )
            .map((instruction) => {
              return (
                <li
                  id={instruction.id}
                  key={instruction.id}
                  onClick={handleHit}
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

      {/* Marker */}
      {props.hitTargets.map((hitTarget, index) => {
        return (
          <Marker coordinates={hitTarget[1]} key={index} display={display} />
        );
      })}
    </div>
  );
}

// Popup box that shows up at the start of the game
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

// Marker for selected elements
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
