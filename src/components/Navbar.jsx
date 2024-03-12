import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from "prop-types";

Navbar.propTypes = {
  boards: PropTypes.array,
  setBoards: PropTypes.func,
  isCollapsed: PropTypes.bool,
  toggleCollapse: PropTypes.func,
  onBoardClick: PropTypes.func,
};

function Navbar({ boards, setBoards, isCollapsed, toggleCollapse, onBoardClick, }) {
  const [showAddBoard, setShowAddBoard] = useState(false);
  const [newBoardName, setNewBoardName] = useState("");
  const [newBoardColor, setNewBoardColor] = useState("#ffffff");

  const handleAddBoard = (e) => {
    e.preventDefault();
    if (!newBoardName) return alert("Please enter a name for the board");
    const boardExists = boards.find(
      (board) => board.name.replace(/\s/g, "").toLowerCase() === newBoardName.replace(/\s/g, "").toLowerCase()
    );
    if (boardExists) return alert("A board with that name already exists");
    setBoards((prevBoards) => [
      ...prevBoards,
      { name: newBoardName, color: newBoardColor, card: [] },
    ]);
    setNewBoardName("");
    setNewBoardColor("#ffffff");
    setShowAddBoard(false);
  };

  return (
    <nav className={isCollapsed ? "collapsed" : ""}>
      <div className="workspace">
        {!isCollapsed && <h4>FrontEnd-Developer-Workspace</h4>}
        <FontAwesomeIcon className="btn-back" icon={isCollapsed ? "chevron-right" : "chevron-left"} onClick={toggleCollapse} />
      </div>
      {!isCollapsed && (
        <>
          <div className="boards">
            <h4>Your Boards</h4>
            <FontAwesomeIcon className="btn-plus" icon="plus" onClick={() => setShowAddBoard(true)} />
            {showAddBoard && (
              <form onSubmit={handleAddBoard} className="add-board">
                <h4>Create Board</h4>
                <FontAwesomeIcon className="btn-close" icon="xmark" onClick={() => setShowAddBoard(false)} />
                <label id="Bname">
                  Board Title:
                  <br />
                  <input type="text" value={newBoardName} onChange={(e) => setNewBoardName(e.target.value)} autoFocus />
                </label>
                <label id="Bcolor">
                  Board Color:
                  <br />
                  <input type="color" value={newBoardColor} onChange={(e) => setNewBoardColor(e.target.value)}
                  />
                </label>
                <br />
                <input type="submit" value="Create" />
              </form>
            )}
          </div>
          <div className="board-list">
            {boards.map((board, index) => (
              <li key={index} onClick={() => onBoardClick(board.name)}>
                <span className="dot" style={{ backgroundColor: board.color }} ></span>
                <h4> {board.name}</h4>
              </li>
            ))}
          </div>
        </>
      )}
    </nav>
  );
}

export default Navbar;
