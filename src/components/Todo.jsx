import Board from "./Board";
import PropTypes from "prop-types";

Todo.propTypes = {
    activeBoard: PropTypes.string,
    boards: PropTypes.array,
    setBoards: PropTypes.func,
};

function Todo({ activeBoard, boards, setBoards }) {
    return (
        <main>
            <section className="menu">
                <h2>{activeBoard}</h2>
            </section>
            <section className="board">
                <Board activeBoard={activeBoard} boards={boards} setBoards={setBoards} />
            </section>
        </main>
    );
}

export default Todo;
