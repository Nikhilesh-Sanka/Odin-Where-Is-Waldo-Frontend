import { useState, useEffect } from "react";
import { serverUrl } from "./config.js";
import NavBar from "./components/NavBar.jsx";
import GameCards from "./components/GameCards.jsx";
import Loading from "./components/Loading.jsx";

export default function LeaderBoard() {
  const [previewDetails, setPreviewDetails] = useState(null);
  const [tableBeingViewed, setTableBeingViewed] = useState(null);
  const [gameBeingViewed, setGameBeingViewed] = useState(null);
  const [gamePressed, setGamePressed] = useState(false);
  useEffect(() => {
    fetch(`${serverUrl}/previewDetails`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((response) => setPreviewDetails(response));
  }, []);
  return (
    <div className="leader-board">
      <NavBar />
      <h2>Leader Board</h2>
      <p>(click on a game below to view the leader board of the game)</p>
      {previewDetails ? (
        <GameCards
          mode="leader-board"
          previewDetails={previewDetails}
          gameBeingViewed={gameBeingViewed}
          setGameBeingViewed={setGameBeingViewed}
          setTableBeingViewed={setTableBeingViewed}
          setGamePressed={setGamePressed}
        />
      ) : (
        <Loading />
      )}
      {tableBeingViewed ? (
        <Table tableBeingViewed={tableBeingViewed} />
      ) : gamePressed ? (
        <Loading />
      ) : null}
    </div>
  );
}

function Table(props) {
  return (
    <div className="table">
      <div>
        <p>S.No</p>
        <p>Name</p>
        <p>Time</p>
      </div>
      {props.tableBeingViewed.map((cell, index) => {
        return (
          <div>
            <p>{index + 1}.)</p>
            <p>{cell.name}</p>
            <p>{Math.round(cell.time * 1000) / 1000}</p>
          </div>
        );
      })}
    </div>
  );
}
