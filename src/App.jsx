import { useEffect, useState } from "react";
import NavBar from "./components/NavBar.jsx";
import GameCards from "./components/GameCards.jsx";
import Loading from "./components/Loading.jsx";
import { serverUrl } from "./config.js";

export default function App() {
  let [previewDetails, setPreviewDetails] = useState(null);
  useEffect(() => {
    fetch(`${serverUrl}/previewDetails`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((response) => setPreviewDetails(response));
  }, []);
  console.log(previewDetails);
  return (
    <div className="home-page">
      <NavBar />
      <h2>Games</h2>
      {previewDetails ? (
        <GameCards mode="games" previewDetails={previewDetails} />
      ) : (
        <Loading />
      )}
    </div>
  );
}
