import { useEffect, useState, type FormEvent } from 'react';
import { FaPlus, FaTimes, FaCheckCircle, FaUndo, FaMoon, FaSun } from 'react-icons/fa';
import './App.css';
import type { FormState, Task } from './types';
import { defaultFormState } from './utils';
import ToggleDarkMode from './components/ToggleDarkMode';

const API_URL = "http://localhost:5000/api/tasks";

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [formState, setFormState] = useState<FormState>(defaultFormState);

  const fetchTasks = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setTasks(data);
    } catch (e: any) {
      console.error(e.message);
    }
  };

  const createTask = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formState)
      });

      if (!response.ok) throw new Error(`Erro ao criar tarefa`);

      setFormState(defaultFormState);
      fetchTasks();
    } catch (e: any) {
      console.error(e);
      window.alert(e.message);
    }
  };

  const toggleTaskDone = async (task: Task) => {
    try {
      await fetch(`${API_URL}/${task.id}`, {
        method: 'PUT',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ done: !task.done })
      });
      fetchTasks();
    } catch (e: any) {
      console.error(e.message);
    }
  };

  const deleteTask = async (id: number) => {
    try {
      await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
      });
      fetchTasks();
    } catch (e: any) {
      console.error(e.message);
    }
  };

  const changeTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className='App' data-theme={isDarkMode ? "dark" : "light"}>
      <div className='theme-toggle'>
        <ToggleDarkMode onChange={changeTheme} />
      </div>

      <div className='card'>
        <h1>Flask Task Manager</h1>

        <form className='task-form' onSubmit={createTask}>
          <div className="input-group">
            <label htmlFor='title'>Titulo <span className='required'>*</span></label>
            <input
              id='title'
              type="text"
              placeholder='Adicione um titulo'
              onChange={(e) => setFormState({ ...formState, title: e.target.value })}
              value={formState.title}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor='description'>Descrição</label>
            <input
              id='description'
              type="text"
              placeholder='Adicione uma descrição'
              onChange={(e) => setFormState({ ...formState, description: e.target.value })}
              value={formState.description}
            />
          </div>

          <button type='submit' className="btn-primary">
            <FaPlus size={20} /> Adicionar
          </button>
        </form>

        <div className="task-list">
          {tasks.map((task) => (
            <div key={task.id} className={`task-item ${task.done ? 'done' : ''}`}>
              <div className="task-info">
                <h3>{task.title}</h3>
                {task.description && <p>{task.description}</p>}
              </div>
              <div className="task-actions">
                <button
                  onClick={() => toggleTaskDone(task)}
                  className={`icon-button ${task.done ? 'btn-undo' : 'btn-check'}`}
                >
                  {task.done ? <FaUndo size={20} /> : <FaCheckCircle size={20} />}
                </button>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="icon-button btn-delete"
                >
                  {/* <span className='tooltip'>
                    Deletar tarefa
                  </span> */}
                  <FaTimes size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;