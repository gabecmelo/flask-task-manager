import { useState } from 'react';
import './App.css'
import type { Task } from './types';

import { IoSunnyOutline, IoMoonOutline } from "react-icons/io5";

const API_URL = "http://localhost:5000/api/tasks";

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);  
  const [isDarkMode, setIsDarkMode] = useState<Boolean>(false);

  const changeTheme = () => {
    setIsDarkMode(!isDarkMode)
    console.log(isDarkMode);
    
  }


  return (
    <div className='App' data-theme={isDarkMode ? "dark" : "light"}>

      <button onClick={changeTheme}>mudar fundo</button>
      <div className='card'>

      </div>
        <h1>Flask Task Manager</h1>
    </div>
  )
}

export default App
