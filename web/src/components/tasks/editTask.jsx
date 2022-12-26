import "./editTask.css"
import React from 'react';
import { useState } from 'react';

import serverTestConnection from '../../routes/serverTestConnection';
import * as tasksAPI from "../../routes/tasks";

export const ScreenTaskEdit = ( { task, editTask } ) =>
{
    console.log(editTask);
    const [title, setTitle] =  useState(task.title);
    const [description, setDescription] =  useState(task.description);

    const changeTitle = (value) => setTitle(value);
    const changeDescription = (value) => setDescription(value);
    
    const hasUpdateTask = task.title !== title || task.description !== description;
    
    const updateTask = async (e) =>
    {
        e.preventDefault();
        editTask.tasks[editTask.tasks.findIndex( (e) => e.id === task.id )].title = title;
        editTask.tasks[editTask.tasks.findIndex( (e) => e.id === task.id )].description = description;
        editTask.setTasks(editTask.tasks);

        if (hasUpdateTask && await serverTestConnection() ) tasksAPI.updateTask(task);
        
        editTask.setInEditTask("");
    }

    return (
        <>
            <main className='editScreen'>
                <form>
                    <div>
                        <label htmlFor="title">Title:</label>
                        <input type="text" id='title' value={title} onChange={({target}) => changeTitle(target.value)}  />
                    </div>
                    <div>
                        <label htmlFor="title">Description:</label>
                        <textarea name="description" id="" cols="30" rows="10" onChange={({target}) => changeDescription(target.value)} value={description}></textarea>                        
                    </div>
                    <button type="submit" onClick={(e) => updateTask(e)}>{hasUpdateTask ? "Update Task" : "Close"}</button>
                </form>
            </main>
        </>
    );
}