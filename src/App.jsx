import NavBar from "./components/NavBar.jsx";
import GameCards from "./components/GameCards.jsx";

export default function App() {
  return (
    <div className="home-page">
      <NavBar />
      <h2>Games</h2>
      <GameCards />
    </div>
  );
}
