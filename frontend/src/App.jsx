import { useState, useEffect } from 'react'; // <--- YE IMPORT MISSING THA!
import axios from 'axios';
import './App.css';

const API_URL = "https://task-tracker-mern-ipsw.onrender.com";

function App() {
    // Initial state ek khali array [] rakha hai taaki .map() crash na ho
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const fetchTasks = async () => {
        try {
            const response = await axios.get(API_URL);
            // Check kar rahe hain ki response.data array hai ya nahi
            setTasks(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Error fetching tasks:', error);
            setTasks([]); // Error aaye toh bhi khali array
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const addTask = async (e) => {
        e.preventDefault();
        if (!title.trim()) {
            alert('Bhai, Task Title mandatory hai!');
            return;
        }
        try {
            await axios.post(API_URL, { title, description });
            setTitle('');
            setDescription('');
            fetchTasks();
        } catch (error) {
            console.error('Error adding task:', error);
        }
    };

    const toggleStatus = async (task) => {
        const newStatus = task.status === 'Pending' ? 'Completed' : 'Pending';
        try {
            await axios.put(`${API_URL}/${task._id}`, { status: newStatus });
            fetchTasks();
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

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

            <div className="task-list">
                {/* SAFE CHECK: Agar tasks array hai tabhi map chalega */}
                {Array.isArray(tasks) && tasks.length > 0 ? (
                    tasks.map((task) => (
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
                    ))
                ) : (
                    <p style={{textAlign: 'center', marginTop: '20px'}}>No tasks yet.</p>
                )}
            </div>
        </div>
    );
}

export default App;