import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

// Apna local backend URL
const API_URL = 'http://localhost:8000/api/tasks';

function App() {
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    // 1. READ: Database se tasks lana
    const fetchTasks = async () => {
        try {
            const response = await axios.get(API_URL);
            setTasks(response.data);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    // Jab page load ho tab tasks fetch karna
    useEffect(() => {
        fetchTasks();
    }, []);

    // 2. CREATE: Naya task add karna
    const addTask = async (e) => {
        e.preventDefault();
        // Form Validation (Mandatory Feature)
        if (!title.trim()) {
            alert('Bhai, Task Title mandatory hai!');
            return;
        }
        try {
            await axios.post(API_URL, { title, description });
            setTitle('');
            setDescription('');
            fetchTasks(); // Dynamic update without page refresh
        } catch (error) {
            console.error('Error adding task:', error);
        }
    };

    // 3. UPDATE: Task ka status change karna (Pending <-> Completed)
    const toggleStatus = async (task) => {
        const newStatus = task.status === 'Pending' ? 'Completed' : 'Pending';
        try {
            await axios.put(`${API_URL}/${task._id}`, { status: newStatus });
            fetchTasks();
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    // 4. DELETE: Task delete karna
    const deleteTask = async (id) => {
        try {
            await axios.delete(`${API_URL}/${id}`);
            fetchTasks();
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    return (
        <div className="container">
            <h1> Task Tracker</h1>

            {/* Task Banane Ka Form */}
            <form onSubmit={addTask} className="task-form">
                <input
                    type="text"
                    placeholder="Task Title (Required)"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Description (Optional)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <button type="submit">Add Task</button>
            </form>

            {/* Task List Dikhane Ka Area */}
            <div className="task-list">
                {tasks.map((task) => (
                    <div key={task._id} className={`task-card ${task.status === 'Completed' ? 'completed' : ''}`}>
                        <div className="task-info">
                            <h3>{task.title}</h3>
                            <p>{task.description}</p>
                            <small>Status: <strong>{task.status}</strong></small>
                        </div>
                        <div className="task-actions">
                            <button className="update-btn" onClick={() => toggleStatus(task)}>
                                {task.status === 'Pending' ? 'Mark Done' : 'Undo'}
                            </button>
                            <button className="delete-btn" onClick={() => deleteTask(task._id)}>
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
                {tasks.length === 0 && <p style={{textAlign: 'center', marginTop: '20px'}}>No tasks yet. </p>}
            </div>
        </div>
    );
}

export default App;