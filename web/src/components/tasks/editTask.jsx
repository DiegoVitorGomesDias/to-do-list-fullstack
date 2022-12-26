import "./editTask.css"
import React from 'react';
import { useState } from 'react';

import * as tasksAPI from "../../routes/tasks";
import serverTestConnection from '../../routes/serverTestConnection';

export const ScreenTaskEdit = ( { task, editTask } ) =>
{
    const [title, setTitle] =  useState(task.title);
    const [description, setDescription] =  useState(task.description);

    const changeTitle = (value) => setTitle(value);
    const changeDescription = (value) => setDescription(value);
    
    const hasUpdateTask = task.title !== title || task.description !== description;
    
    const updateTask = async (e) =>
    {
        e.preventDefault();
        const indexTask = editTask.tasks.findIndex( (e) => e.id === task.id );
        editTask.tasks[indexTask].title = title;
        editTask.tasks[indexTask].description = description;
        editTask.setTasks(editTask.tasks);

        if ( hasUpdateTask && (await serverTestConnection()) ) 
        tasksAPI.updateTask(editTask.tasks[indexTask]);
        
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
                    <button type="submit" onClick={ updateTask }>{hasUpdateTask ? "Update Task" : "Close"}</button>
                </form>
            </main>
        </>
    );
}