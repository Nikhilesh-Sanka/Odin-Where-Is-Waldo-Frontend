import GameCardsStyles from "../css-modules/GameCards.module.css";
import { useNavigate } from "react-router-dom";

export default function GameCards() {
  const navigate = useNavigate();
  function openGame(id) {
    navigate(`/${id}`);
  }
  return (
    <div className={GameCardsStyles["game-cards"]}>
      <div
        className={GameCardsStyles["game-card"]}
        onClick={() => {
          openGame(1);
        }}
      >
        <img />
        <p>This is Game 1</p>
      </div>
      <div className={GameCardsStyles["game-card"]}>
        <img />
        <p>This is Game 1</p>
      </div>
      <div className={GameCardsStyles["game-card"]}>
        <img />
        <p>This is Game 1</p>
      </div>
      <div className={GameCardsStyles["game-card"]}>
        <img />
        <p>This is Game 1</p>
      </div>
      <div className={GameCardsStyles["game-card"]}>
        <img />
        <p>This is Game 1</p>
      </div>
      <div className={GameCardsStyles["game-card"]}>
        <img />
        <p>This is Game 1</p>
      </div>
    </div>
  );
}
