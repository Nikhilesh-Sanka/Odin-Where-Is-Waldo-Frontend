import GameCardsStyles from "../css-modules/GameCards.module.css";
import { useNavigate } from "react-router-dom";
import { serverUrl } from "../config.js";

export default function GameCards(props) {
  const navigate = useNavigate();
  function handleCardClick(id) {
    if (props.mode === "games") {
      navigate(`/${id}`);
    } else if (props.mode === "leader-board") {
      fetch(`${serverUrl}/leaderBoard?gameId=${id}`, {
        method: "GET",
      })
        .then((response) => response.json())
        .then((response) => {
          props.setTableBeingViewed(response);
          props.setGameBeingViewed(id);
        });
    }
  }
  return (
    <div className={GameCardsStyles["game-cards"]}>
      {props.previewDetails.map((game) => {
        if (game.id === props.gameBeingViewed) {
          return (
            <div
              className={`${GameCardsStyles["game-card"]} ${GameCardsStyles["being-viewed"]}`}
              onClick={() => {
                handleCardClick(game.id);
                props.setGamePressed(true);
              }}
            >
              <img src={game["image_url"]} />
              <p>{game.name}</p>
            </div>
          );
        }
        return (
          <div
            className={GameCardsStyles["game-card"]}
            onClick={() => handleCardClick(game.id)}
          >
            <img src={game["image_url"]} />
            <p>{game.name}</p>
          </div>
        );
      })}
    </div>
  );
}
