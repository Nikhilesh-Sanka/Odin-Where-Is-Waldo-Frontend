import NavBar from "./components/NavBar.jsx";
import GameCards from "./components/GameCards.jsx";

export default function LeaderBoard() {
  return (
    <div className="leader-board">
      <NavBar />
      <h2>Leader Board</h2>
      <p>(click on a game below to view the leader board of the game)</p>
      <GameCards />
      <Table />
    </div>
  );
}

function Table() {
  return (
    <div className="table">
      <div>
        <p>S.No</p>
        <p>Name</p>
        <p>Time</p>
      </div>
      <div>
        <p>1.)</p>
        <p>John</p>
        <p>10.098 s</p>
      </div>
    </div>
  );
}
