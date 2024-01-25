import { useState, useRef } from "react";
import PropTypes from "prop-types";
import "./App.css";
import addSound from "./assets/audio/add_sfx.mp3";
import clearSound from "./assets/audio/clear_sfx.mp3";
import deleteSound from "./assets/audio/delete_sfx.mp3";
import editSound from "./assets/audio/edit_sfx.mp3";

const globalVolume = 0.2;

const ToDoTask = ({ task, onToggleComplete, onDelete, onEdit, playDeleteSound, playEditSound }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);
  const editInputRef = useRef(null);

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    onDelete(task.id);
    playDeleteSound();
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    setIsEditing(true);
    playEditSound();
  };

  const handleInputChange = (e) => {
    setEditText(e.target.value);
  };

  const handleInputKeyPress = (e) => {
    if (e.key === "Enter") {
      onEdit(task.id, editText);
      setIsEditing(false);
      playEditSound();
    } else if (e.key === "Escape") {
      setIsEditing(false);
      if (editInputRef.current) {
        editInputRef.current.blur();
      }
    }
  };

  const handleInputBlur = () => {
    setIsEditing(false);
  };

  return (
    <div className="to-do-task" onClick={() => onToggleComplete(task.id)}>
      {isEditing ? (
        <input
          ref={editInputRef}
          type="text"
          className="edit-input"
          value={editText}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyPress}
          onBlur={handleInputBlur}
          autoFocus
        />
      ) : (
        <span className={`todo-text ${task.isCompleted ? "completed-task" : ""}`}>{task.text}</span>
      )}
      <div className="button-container">
        <button className="edit-button" onClick={handleEditClick}>
          <i className="fa-solid fa-pen"></i>
        </button>
        <button className="delete-button" onClick={handleDeleteClick}>
          <i className="fa-solid fa-xmark"></i>
        </button>
      </div>
    </div>
  );
};

ToDoTask.propTypes = {
  task: PropTypes.shape({
    id: PropTypes.number,
    text: PropTypes.string,
    isCompleted: PropTypes.bool,
  }),
  onToggleComplete: PropTypes.func,
  onDelete: PropTypes.func,
  onEdit: PropTypes.func,
  playDeleteSound: PropTypes.func,
  playEditSound: PropTypes.func,
};

const App = () => {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const inputContainerRef = useRef(null);

  const playSound = (soundFile) => {
    const audio = new Audio(soundFile);
    audio.currentTime = 0;
    audio.volume = globalVolume;
    audio.play();
  };

  const playAddSound = () => playSound(addSound);
  const playClearSound = () => playSound(clearSound);
  const playDeleteSound = () => playSound(deleteSound);
  const playEditSound = () => playSound(editSound);

  const handleAddTodo = () => {
    if (inputValue.trim() !== "") {
      const newTask = {
        id: Date.now(),
        text: inputValue,
        isCompleted: false,
      };
      setTodos([...todos, newTask]);
      setInputValue("");
      playAddSound();
    }
  };

  const handleToggleComplete = (id) => {
    const updatedTodos = todos.map((task) => (task.id === id ? { ...task, isCompleted: !task.isCompleted } : task));
    setTodos(updatedTodos);
  };

  const handleDelete = (id) => {
    const filteredTodos = todos.filter((task) => task.id !== id);
    setTodos(filteredTodos);
    playDeleteSound();
  };

  const handleEdit = (id, newText) => {
    const updatedTodos = todos.map((task) => (task.id === id ? { ...task, text: newText } : task));
    setTodos(updatedTodos);
    playEditSound();
  };

  const handleClearAll = () => {
    setTodos([]);
    playClearSound();
  };

  const handleInputKeyPress = (e) => {
    if (e.key === "Enter") {
      handleAddTodo();
    }
  };

  const handleInputEscape = (e) => {
    if (e.key === "Escape" && inputContainerRef.current) {
      inputContainerRef.current.querySelector("input").blur();
    }
  };

  return (
    <div className="container">
      <div className="input-container" ref={inputContainerRef}>
        <input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            handleInputKeyPress(e);
            handleInputEscape(e);
          }}
          placeholder="Add a new task"
          type="text"
        />
        <button className="add-button" onClick={handleAddTodo}>
          <i className="fas fa-plus"></i>ADD
        </button>
        {todos.length > 0 && (
          <button className="clear-button" onClick={handleClearAll}>
            <i className="fa-solid fa-broom"></i>CLEAR
          </button>
        )}
      </div>

      {todos.length > 0 && (
        <div className="output-container">
          {todos.map((task) => (
            <ToDoTask
              key={task.id}
              task={task}
              onToggleComplete={handleToggleComplete}
              onDelete={handleDelete}
              onEdit={handleEdit}
              playDeleteSound={playDeleteSound}
              playEditSound={playEditSound}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default App;
