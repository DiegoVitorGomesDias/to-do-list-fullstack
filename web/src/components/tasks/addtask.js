import React from 'react';
import { useState } from "react";

import Btn from "./btn.js";

const AddTask = ({handleTask}) => {

    const [txtTask, setTxttask] = useState("");

    const handletxt = ({target}) =>
    {
        if(target.value.length < 100)
        {
            setTxttask(target.value);
        }
    }

    const handleTaskClick = () =>
    {
        if(txtTask.length > 0 && txtTask.trim() !== "")
        {
            handleTask(txtTask);
            setTxttask("");  
        }
    }

    return ( 
        <div className='input-task'>
            <input 
                type="text" 
                name="txttask" 
                id="txttask" 
                placeholder="Insert Task Title" 
                autoFocus={true}
                onChange={handletxt} 
                value={txtTask}
                onKeyDown={ (e) => { ["Enter", "NumpadEnter"].includes(e.code) && handleTaskClick(e) }}
            />
            <Btn onClick={handleTaskClick} title="Add Task">Add Task</Btn>
        </div>
     );
}
 
export default AddTask;