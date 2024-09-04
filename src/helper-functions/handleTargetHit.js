import GameStyles from "../css-modules/Game.module.css";
import { serverUrl } from "../config.js";

export default async function handleTargetHit(
  instructionId,
  pointer,
  pointerCoordinates,
  gameInfoId,
  hitTargets,
  setHitTargets,
  setTargetHitStatus
) {
  pointer.current.classList.remove(GameStyles["visible"]);
  if (hitTargets.some((hitTarget) => hitTarget === instructionId)) {
    return;
  }
  const response = await fetchResponse(
    instructionId,
    pointerCoordinates,
    gameInfoId
  );
  if (response.status === 200) {
    setHitTargets((hitTargets) => {
      return [...hitTargets, [instructionId, pointerCoordinates]];
    });
    setTargetHitStatus("it's a hit");
  } else {
    setTargetHitStatus("it's a miss");
  }
}

async function fetchResponse(instructionId, pointerCoordinates, gameInfoId) {
  const response = await fetch(`${serverUrl}/hitTarget`, {
    method: "POST",
    body: JSON.stringify({
      instructionId,
      hitCoordinates: pointerCoordinates,
      gameInfoId,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response;
}
