import { useEffect, useState } from 'react';
import './App.css'
import type { Task } from './types';

import ToggleDarkMode from './components/ToggleDarkMode';

const API_URL = "http://localhost:5000/api/tasks";

type formStateType = {
  title?: string;
  description?: string;
};

const defaultFormState = {
  title: '',
  description: ''
}

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isDarkMode, setIsDarkMode] = useState<Boolean>(false);
  const [formState, setFormState] = useState<formStateType>(defaultFormState)

  const fetchTasks = async () => {
    try {
      const data = await (await fetch(API_URL)).json();
      setTasks(data);
    } catch (e: any) {
      console.error("[ERRO]: ", e.message);
    }
  }

  const changeTheme = () => {
    setIsDarkMode(!isDarkMode);
  }

  const createTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formState)
      })
      
      if (!response.ok) throw new Error(`Tarefa com titulo ${formState.title} já existe`)

      setFormState(defaultFormState)
      fetchTasks()
    } catch (e: any) {
      console.error("[ERRO]: ", e);
      window.alert(e.message)
    }
  }

  useEffect(() => {
    fetchTasks();
  }, [])

  return (
    <div className='App' data-theme={isDarkMode ? "dark" : "light"}>
      <ToggleDarkMode onChange={changeTheme} />
      <div className='card'>
        <h1>Flask Task Manager</h1>

        <form className='task-form' onSubmit={createTask}>
          <label htmlFor='title'>Titulo</label>
          <input
            id='title'
            type="text"
            placeholder='Adicione um titulo (Obrigatório)'
            onChange={(e) => setFormState({ ...formState, title: e.target.value })}
            value={formState.title}
            required
          />
          <label htmlFor='description'>Descrição</label>
          <input
            id='description'
            type="text"
            placeholder='Adicione uma descrição (Opcional)'
            onChange={(e) => { setFormState({ ...formState, description: e.target.value }) }}
            value={formState.description}
          />

          <button type='submit'> + Adicionar</button> { /* Mudar para icone */}
        </form>

      </div>
    </div>
  )
}

export default App
