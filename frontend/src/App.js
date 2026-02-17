import './App.css';
import {useEffect, useState} from "react";
import {addTodo, getAllTodos, deleteTodo, updateTodo, addTask, deleteTask, updateTask} from "./api.js";

function App() {
    const [todos, setTodos] = useState([]);
    const [todoName, setTodoName] = useState("");
    const [taskName, setTaskName] = useState({});
    const [editingTodoId, setEditingTodoId] = useState(null);
    const [editTodoName, setEditTodoName] = useState({});
    console.log('Current todos:', todos);


    async function loadTodos() {
        const data = await getAllTodos();
        setTodos(data);
    }

    useEffect(() => {
        loadTodos();
    }, []);

    const handleAddTodo = async () => {
        if (todoName.trim() === "") {
            alert("Please enter a todo name");
            return;
        }
        console.log('Adding todo:', todoName);
        await addTodo(todoName);
        setTodoName("");
        const data = await getAllTodos();
        console.log('Updated todo list:', data);
        setTodos(data);
    }

    const handleTodoInputChange = (event) => {
        setTodoName(event.target.value);
    }

    const handleDeleteTodo = async (id) => {
        console.log('Deleting todo:', id);
        await deleteTodo(id);
        const data = await getAllTodos();
        setTodos(data);
    }

    const handleUpdateTodo = async (id) => {
        if (editingTodoId === id) {
            // Save the edit
            const newName = editTodoName[id];
            if (!newName || newName.trim() === "") {
                alert("Please enter a valid todo name");
                return;
            }
            await updateTodo(id, { name: newName });
            setEditingTodoId(null);
            setEditTodoName(prev => {
                const updated = { ...prev };
                delete updated[id];
                return updated;
            });
            const data = await getAllTodos();
            setTodos(data);
        } else {
            // Start editing
            const todo = todos.find(t => t.id === id);
            if (todo) {
                setEditingTodoId(id);
                setEditTodoName(prev => ({
                    ...prev,
                    [id]: todo.name
                }));
            }
        }
    }

    const handleCancelEdit = async (id) => {
        setEditingTodoId(null);
        setEditTodoName(prev => {
            const updated = { ...prev };
            delete updated[id];
            return updated;
        });
        // Reload todos to ensure we have the original values
        const data = await getAllTodos();
        setTodos(data);
    }

    const handleEditInputChange = (event, todoId) => {
        setEditTodoName(prev => ({
            ...prev,
            [todoId]: event.target.value
        }));
    }

    function handleTaskInputChange(event, todoId) {
        setTaskName(prev => ({
            ...prev,
            [todoId]: event.target.value
        }));
    }

    const handleAddTask = async (id) => {
        const currentTaskName = taskName[id] || "";
        if (currentTaskName.trim() === "") {
            alert("Please enter a task name");
            return;
        }
        try {
            await addTask(id, currentTaskName);
            setTaskName(prev => ({
                ...prev,
                [id]: ""
            }));
            const data = await getAllTodos();
            setTodos(Array.isArray(data) ? data : []);
        } catch (error) {
            alert('Failed to add task. Please check the console for details.');
        }
    }

    const handleDeleteTask = async (todoId, taskId) => {
        await deleteTask(todoId, taskId);
        const data = await getAllTodos();
        setTodos(data);
    }

    const handleStatusChange = async (todoId, taskId) => {
        try {
            const todo = todos.find(t => t.id === todoId);
            if (!todo) {
                console.error('Todo not found');
                return;
            }

            const task = todo.tasks.find(t => t.id === taskId);
            if (!task) {
                console.error('Task not found');
                return;
            }
            const newStatus = !task.status;
            await updateTask(todoId, taskId, { status: newStatus });
            const data = await getAllTodos();
            setTodos(Array.isArray(data) ? data : []);
        } catch (error) {
            alert('Failed to update task status. Please check the console for details.');
        }
    }

    return (
        <div className="Todo">
            <h1>Todo App</h1>

            <div className="add-todo-section">
                <input
                    className="todo-input"
                    type="text"
                    placeholder="Enter Todo Name"
                    value={todoName}
                    onChange={handleTodoInputChange}
                />
                <button className="add-btn" onClick={handleAddTodo}>
                    Add Todo
                </button>
            </div>

            <div className="todo-list-section">
                <h2>My Todos</h2>
                {todos.length === 0 ? (
                    <p className="empty-message">No todos yet. Add one above!</p>
                ) : (
                    <ul className="todo-list">
                        {todos.map(todo => (
                            <li key={todo.id} className="todo-item">
                                <div className="todo-header">
                                    {editingTodoId === todo.id ? (
                                        <>
                                            <input
                                                className="edit-todo-input"
                                                type="text"
                                                value={editTodoName[todo.id] || ""}
                                                onChange={(e) => handleEditInputChange(e, todo.id)}
                                            />
                                            <div className="todo-actions">
                                                <button
                                                    className="save-btn"
                                                    onClick={() => handleUpdateTodo(todo.id)}
                                                >
                                                    Save
                                                </button>
                                                <button
                                                    className="cancel-btn"
                                                    onClick={() => handleCancelEdit(todo.id)}
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <span className="todo-name">{todo.name}</span>
                                            <div className="todo-actions">
                                                <button
                                                    className="edit-btn"
                                                    onClick={() => handleUpdateTodo(todo.id)}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className="delete-btn"
                                                    onClick={() => handleDeleteTodo(todo.id)}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>

                                <div className="tasks-section">
                                    <div className="add-task">
                                        <input
                                            className="task-input"
                                            type="text"
                                            placeholder="Enter task name"
                                            value={taskName[todo.id] || ""}
                                            onChange={(e) => handleTaskInputChange(e, todo.id)}
                                        />
                                        <button
                                            className="add-task-btn"
                                            onClick={() => handleAddTask(todo.id)}
                                        >
                                            Add Task
                                        </button>
                                    </div>

                                    {todo.tasks && todo.tasks.length > 0 && (
                                        <ul className="task-list">
                                            {todo.tasks.map(task => (
                                                <li key={task.id} className="task-item">
                                                    <input
                                                        type="checkbox"
                                                        checked={task.status}
                                                        onChange={() => handleStatusChange(todo.id, task.id)}
                                                    />
                                                    <span>
                                                        {task.taskName}
                                                    </span>
                                                    <button
                                                        className="delete-task-btn"
                                                        onClick={() => handleDeleteTask(todo.id, task.id)}
                                                    >
                                                        Delete
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

export default App;
