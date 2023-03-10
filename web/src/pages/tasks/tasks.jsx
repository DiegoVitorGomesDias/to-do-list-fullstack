import React from "react";
import { useState, useEffect } from "react";
import { useAsyncFn } from 'react-use';
import { v4 as uuid } from "uuid"

import { MapTasks }  from "../../components/tasks/maptasks";
import AddTask from "../../components/tasks/addtask";
import { ScreenTaskEdit } from "../../components/tasks/editTask";
import { FaArrowLeft, FaUserSlash } from "react-icons/fa";

import * as userAPI from "../../routes/user";
import * as tasksAPI from "../../routes/tasks";

import serverTestConnection from "../../routes/serverTestConnection";

const auth = JSON.parse(localStorage.getItem("auth"));

export const Tasks = () =>
{

    const deleteUser = async () =>
    {
        const confirmDeleted = window.confirm(
        `This action will permanently delete the logged in account and all of its tasks! Do you wish to continue?
        \nEstá ação irá deletar permanentemente a conta logada e todas as suas tasks! Deseja continuar?`
        );

        if(confirmDeleted)
        {
            if ( await serverTestConnection() ) await userAPI.deleteUser();
            localStorage.removeItem("auth");
            localStorage.removeItem(auth.sub.username);
            window.location.replace("/");
            alert("User Deleted!");
        }
        else alert("Delete Canceled!");
    }

    const [inEditTask, setInEditTask] = useState(false);
    const [ tasks, setTasks ] = useState([]);
    const [ fetchTasks, setFetchTasks ] = useAsyncFn( async () => 
    {   if ( await serverTestConnection() ) return await tasksAPI.getTasksFromUser(); 
        else return JSON.parse(localStorage.getItem(auth.sub.username)) || tasks;
    });

    useEffect( () => { setFetchTasks() }, [ setFetchTasks ]);
    useEffect( () => 
        setTasks( (!fetchTasks.loading && !fetchTasks.error && fetchTasks.value) || JSON.parse(localStorage.getItem(auth.sub.username)) || [] ), 
        [ setTasks, fetchTasks ])
    ;

    const taskEvents = 
    {
        newTask: async (taskTitle) =>
        {
            const newTaskID = uuid();
            const newTasks =  [...tasks];
            newTasks.push({ id: newTaskID, title: taskTitle, description: "", completed: false });
            setTasks(newTasks);

            if ( await serverTestConnection() ) tasksAPI.postTask( { newTaskID, taskTitle } );
        },

        conclusedTask: async (task) =>
        {
            task.completed = task.completed ? false : true;
            const newTasks = [ ...tasks ];
            newTasks[tasks.findIndex( e => e.id === task.id)] = task;
            setTasks(newTasks)

            if ( await serverTestConnection() ) tasksAPI.updateTask(task);
        },

        editTask: async (task) => { setInEditTask(task); if ( await serverTestConnection() ) setFetchTasks(); },

        deleteTask: async (task) =>
        {
            const newTasks = [ ...tasks ];
            newTasks.splice(newTasks.findIndex( (e) => e.id === task.id ), 1);
            setTasks(newTasks)

            if ( await serverTestConnection() ) tasksAPI.deleteTask(task.id);
        }
    }

    window.addEventListener( "beforeunload", () => { if (localStorage.getItem("auth")) localStorage.setItem(auth.sub.username, JSON.stringify(tasks)) } );

    return (
        <div style={{padding: "5vh 5vw", minHeight: "80vh", maxWidth: "100vw"}}>
            <div id="titleTasksScreen">
                <a href="/" title="home"><FaArrowLeft /></a>
                <h1>TASKS OF {(auth.sub.username).toUpperCase()}</h1>
                <button onClick={deleteUser} title="deleteAccount"><FaUserSlash /></button>
            </div>
            <AddTask handleTask={taskEvents.newTask} />
            { !fetchTasks.loading && !fetchTasks.error && <MapTasks tasks={tasks} events={taskEvents} /> }
            { inEditTask && <ScreenTaskEdit task={inEditTask} editTask={{ tasks, setTasks, setInEditTask }}/> }
        </div>
    )
}