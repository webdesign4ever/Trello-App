import { useState } from "react";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faPen, faCheck, faXmark, faPlus, faChevronLeft, faChevronRight, } from "@fortawesome/free-solid-svg-icons";
library.add(faPen, faCheck, faXmark, faPlus, faChevronLeft, faChevronRight);
import Title from "./Title";
import Navbar from "./Navbar";
import Todo from "./Todo";

function App() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const [activeBoard, setActiveBoard] = useState("My Trello Board");

  const [boards, setBoards] = useState([
    {
      name: "My Trello Board",
      color: "#ffffff",
      card: [
        {
          id: "b1-c1",
          title: "Todo",
          tasks: [{ id: "b1-c1-t1", desc: "Project Description 1" }],
        },
        {
          id: "b1-c2",
          title: "Doing",
          tasks: [{ id: "b1-c2-t1", desc: "Project Description 2" }],
        },
        {
          id: "b1-c3",
          title: "Done",
          tasks: [{ id: "b1-c3-t1", desc: "Project Description 3" }],
        },
      ],
    },
  ]);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleBoardClick = (board) => {
    setActiveBoard(board);
  };

  return (
    <div>
      <Title />
      <div className="container">
        <Navbar isCollapsed={isCollapsed} toggleCollapse={toggleCollapse} onBoardClick={handleBoardClick} boards={boards} setBoards={setBoards}
        />
        <Todo activeBoard={activeBoard} boards={boards} setBoards={setBoards} />
      </div>
    </div>
  );
}

export default App;
