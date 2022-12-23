import React from 'react';
import { FaSearch, FaTrashAlt } from "react-icons/fa";
import Btn from "./btn.js";
import "./task.css"

const task = ({task, events}) => 
{
    return ( 
        <div className={`taskcontent ${task.completed && "completed"}`}>
            <h1 onClick={() => events.conclusedTask(task)}>{task.title}</h1>
            <div className='btns'>
                <Btn onClick={() => events.editTask(task)} title="View" ><FaSearch /></Btn>
                <Btn onClick={() => events.deleteTask(task)} title="Delete" ><FaTrashAlt /></Btn>
            </div>
        </div>
     );
}
 
export default task;