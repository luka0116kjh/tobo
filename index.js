// App.js
import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const DARK_MODE_STORAGE_KEY = "todoapp-darkmode";
const TODO_STORAGE_KEY = "todoapp-tasks";

function App() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem(TODO_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });
  const [input, setInput] = useState("");
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem(DARK_MODE_STORAGE_KEY);
    return saved === "true";
  });

  useEffect(() => {
    localStorage.setItem(TODO_STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem(DARK_MODE_STORAGE_KEY, darkMode);
  }, [darkMode]);

  function handleAdd() {
    if (!input.trim()) return;
    setTasks(prev => [
      ...prev,
      { id: Date.now().toString(), text: input.trim(), completed: false, important: false },
    ]);
    setInput("");
  }

  function handleToggleComplete(id) {
    setTasks(prev =>
      prev.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  }

  function handleToggleImportant(id) {
    setTasks(prev =>
      prev.map(task =>
        task.id === id ? { ...task, important: !task.important } : task
      )
    );
  }

  function handleDelete(id) {
    setTasks(prev => prev.filter(task => task.id !== id));
  }

  function handleDragEnd(result) {
    if (!result.destination) return;
    const items = Array.from(tasks);
    const [reordered] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reordered);
    setTasks(items);
  }

  return (
    <div className={`app ${darkMode ? "dark" : "light"}`}>
      <div className="header">
        <h1>하루 To Do</h1>
        <button onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? "화이트 모드" : "다크 모드"}
        </button>
      </div>

      <div className="input-section">
        <input
          placeholder="할 일을 입력하세요"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleAdd()}
        />
        <button onClick={handleAdd}>추가</button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="todo-list">
          {(provided) => (
            <ul
              className="todo-list"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {tasks.map((task, index) => (
                <Draggable key={task.id} draggableId={task.id} index={index}>
                  {(provided) => (
                    <li
                      className={`todo-item ${task.completed ? "completed" : ""} ${task.important ? "important" : ""}`}
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => handleToggleComplete(task.id)}
                      />
                      <span>{task.text}</span>
                      <button onClick={() => handleToggleImportant(task.id)}>
                        {task.important ? "★" : "☆"}
                      </button>
                      <button onClick={() => handleDelete(task.id)}>삭제</button>
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>

      <div className="footer">
        <small>총 할 일: {tasks.length}개</small>
      </div>

      <style jsx>{`
        .app {
          max-width: 400px;
          margin: 20px auto;
          padding: 15px;
          font-family: 'Arial', sans-serif;
          border-radius: 10px;
          box-shadow: 0 0 10px #ccc;
          transition: background-color 0.3s, color 0.3s;
        }
        .dark {
          background-color: #121212;
          color: #f0f0f0;
        }
        .light {
          background-color: #f9f9f9;
          color: #222;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .input-section {
          margin: 15px 0;
          display: flex;
          gap: 10px;
        }
        .input-section input {
          flex: 1;
          padding: 10px;
          font-size: 1rem;
          border-radius: 6px;
          border: 1px solid #ccc;
        }
        .todo-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .todo-item {
          padding: 10px;
          margin-bottom: 8px;
          background: #eee;
          border-radius: 6px;
          display: flex;
          align-items: center;
          gap: 10px;
          user-select: none;
        }
        .dark .todo-item {
          background: #333;
        }
        .todo-item.completed span {
          text-decoration: line-through;
          opacity: 0.6;
        }
        .todo-item.important {
          border-left: 5px solid gold;
        }
        .todo-item button {
          background: none;
          border: none;
          cursor: pointer;
          font-size: 1.2rem;
          color: inherit;
        }
        .footer {
          margin-top: 15px;
          text-align: right;
          font-size: 0.9rem;
          opacity: 0.7;
        }
      `}</style>
    </div>
  );
}

export default App;
