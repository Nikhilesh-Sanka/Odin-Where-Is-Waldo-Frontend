import GameOverPopUpStyles from "../css-modules/GameOverPopUp.module.css";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { serverUrl } from "../config.js";

export default function GameOverPopUp(props) {
  const nameField = useRef(null);
  const navigate = useNavigate();
  function handleSubmit(e) {
    e.preventDefault();
    if (nameField.current.value.trim() === "") {
      nameField.current.setCustomValidity("name cannot be empty");
      nameField.current.reportValidity();
      return;
    }
    const name = nameField.current.value.trim();
    const gameInfoId = props.gameInfoId;
    fetch(`${serverUrl}/leaderBoard`, {
      method: "POST",
      body: JSON.stringify({
        name,
        gameInfoId,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => {
      navigate("/leaderBoard");
    });
  }
  return (
    <>
      <div className={GameOverPopUpStyles["game-over-pop-up"]}>
        <form>
          <p>Time: {props.time}</p>
          <label>
            Name: <br />
            <input name="username" ref={nameField} />
          </label>
          <p>(please enter your name to get placed on the leader board)</p>
          <button onClick={handleSubmit}>Continue</button>
        </form>
      </div>
      <div className={GameOverPopUpStyles["blur"]}></div>
    </>
  );
}
