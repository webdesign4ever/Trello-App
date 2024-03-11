import { useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import PropTypes from "prop-types";

Board.propTypes = {
  activeBoard: PropTypes.string,
  boards: PropTypes.array,
  setBoards: PropTypes.func,
};


function Board({ activeBoard, boards, setBoards }) {
  const activeBoardIndex = boards.findIndex((board) => board.name === activeBoard);
  const activeBoardCards = boards[activeBoardIndex].card;

  function handleAddTask(index, taskDescription) {
    if (!taskDescription) return alert("Please enter task");
    setBoards((prevBoards) => {
      const newBoards = [...prevBoards];
      newBoards[activeBoardIndex].card[index].tasks.push({
        id: `b${activeBoardIndex + 1}-c${index + 1}-t${newBoards[activeBoardIndex].card[index].tasks.length + 1}`,
        desc: taskDescription,
        isEditing: false,
      });
      return newBoards;
    });
  }

  function handleTaskChange(cardIndex, taskIndex, newTask) {
    setBoards((prevBoards) => {
      const newBoards = [...prevBoards];
      newBoards[activeBoardIndex].card[cardIndex].tasks[taskIndex] = newTask;
      return newBoards;
    });
  }

  function handleAddCard(cardTitle) {
    if (!cardTitle) return alert("Please enter card title");
    setBoards((prevBoards) => {
      const newBoards = [...prevBoards];
      newBoards[activeBoardIndex].card.push({
        id: `b${activeBoardIndex + 1}-c${newBoards[activeBoardIndex].card.length + 1}`,
        title: cardTitle,
        tasks: [],
      });
      return newBoards;
    });
  }

  function onDragEnd(result) {
    const { destination, source, draggableId } = result;
    if (!destination) {
      return;
    }

    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    setBoards((prevBoards) => {
      const newBoards = [...prevBoards];
      const sourceCard = newBoards[activeBoardIndex].card.find((card) => card.id === source.droppableId);
      const destinationCard = newBoards[activeBoardIndex].card.find((card) => card.id === destination.droppableId);
      // Find the task and remove it from source card
      const task = sourceCard.tasks.find((task) => task.id === draggableId);
      sourceCard.tasks = sourceCard.tasks.filter((task) => task.id !== draggableId);
      // Add the task to destination card
      destinationCard.tasks.splice(destination.index, 0, task);
      return newBoards;
    });
  }

  Card.propTypes = {
    card: PropTypes.object,
    title: PropTypes.string,
    tasks: PropTypes.array,
    onAddTask: PropTypes.func,
    cardIndex: PropTypes.number,
    onTaskChange: PropTypes.func,
  };
  AddCard.propTypes = {
    onAddCard: PropTypes.func,
  };

  return (
    <div className="cards-list">
      <DragDropContext onDragEnd={onDragEnd}>
        {activeBoardCards.map((card, index) => (
          <Card key={index} card={card} title={card.title} tasks={card.tasks} onAddTask={handleAddTask} cardIndex={index} onTaskChange={(taskIndex, newTask) => handleTaskChange(index, taskIndex, newTask)} />
        ))}
      </DragDropContext>
      <AddCard onAddCard={handleAddCard} />
    </div>
  );

  function Card({ card, title, tasks, onAddTask, cardIndex, onTaskChange }) {
    const [editingTaskId, setIsEditingTaskId] = useState(null);
    const [editedTaskDesc, setIsEditedTaskDesc] = useState("");
    const [inputRefs, setInputRefs] = useState([]);
    const handleInputChange = (newDesc) => {
      setIsEditedTaskDesc(newDesc);
    };
    const handleIconClick = (index) => {
      if (editingTaskId !== tasks[index].id) {
        setIsEditingTaskId(tasks[index].id);
        setIsEditedTaskDesc(tasks[index].desc);
        if (inputRefs[index]) {
          inputRefs[index].focus();
        }
      } else {
        onTaskChange(index, { ...tasks[index], desc: editedTaskDesc });
      }
    };
    AddTask.propTypes = {
      onAddTask: PropTypes.func,
      cardIndex: PropTypes.number,
    };
    return (
      <div className="card">
        <h4>{title}</h4>
        <Droppable droppableId={card.id}>
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {tasks.map((task, index) => (
                <Draggable key={index} draggableId={task.id} index={index}>
                  {(provided) => (
                    <div key={index} className="input-icon" ref={provided.innerRef}  {...provided.draggableProps} {...provided.dragHandleProps}>
                      <input type="text" value={editingTaskId === task.id ? editedTaskDesc : task.desc} ref={(ref) => (inputRefs[index] = ref)} readOnly={editingTaskId !== task.id} onChange={(e) => handleInputChange(e.target.value)} autoFocus={editingTaskId === task.id} />
                      <FontAwesomeIcon icon={editingTaskId !== task.id ? "pen" : "check"} className="icon" onClick={() => handleIconClick(index)} />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
        <AddTask onAddTask={onAddTask} cardIndex={cardIndex} />
      </div>
    );
  }

  function AddTask({ onAddTask, cardIndex }) {
    const [active, setIsActive] = useState(false);
    const [taskDescription, setTaskDescription] = useState("");

    function handleAdd() {
      onAddTask(cardIndex, taskDescription);
      setTaskDescription("");
      setIsActive(false);
    }
    return (
      <>
        <button style={{ display: active ? "none" : "block" }} className="btn-addTask" onClick={() => setIsActive(true)}>
          + Add Task
        </button>
        {active && (
          <>
            <textarea rows={3} className="task-field" value={taskDescription} onChange={(e) => setTaskDescription(e.target.value)} placeholder="Enter Task Description" autoFocus ></textarea>
            <button className="btn-add" onClick={handleAdd}>  Add Task  </button>
            <FontAwesomeIcon icon="xmark" className="btn-cross" onClick={() => { setIsActive(false); setTaskDescription(""); }} />
          </>
        )}
      </>
    );
  }

  function AddCard({ onAddCard }) {
    const [active, setIsActive] = useState(false);
    const [cardTitle, setCardTitle] = useState("");

    return (
      <>
        <button className="btn-addCard" style={{ display: active ? "none" : "block" }} onClick={() => setIsActive(true)}>
          + Add Card
        </button>
        {active && (
          <div className="card">
            <input type="text" value={cardTitle} onChange={(e) => setCardTitle(e.target.value)} placeholder="Enter Card Title" autoFocus />
            <button className="btn-add" onClick={() => { onAddCard(cardTitle); setCardTitle(""); setIsActive(false); }}>
              Add Card
            </button>
            <FontAwesomeIcon icon="xmark" className="btn-cross" onClick={() => { setIsActive(false); setCardTitle(""); }} />
          </div>
        )}
      </>
    );
  }
}
export default Board;
