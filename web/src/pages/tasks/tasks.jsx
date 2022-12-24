import React from "react";
import axios from "axios";
import env from "react-dotenv"
import { useState, useEffect } from "react";
import { useAsyncFn } from 'react-use';
import { v4 as uuid } from "uuid"

import { MapTasks }  from "../../components/tasks/maptasks";
import AddTask from "../../components/tasks/addtask";
import { ScreenTaskEdit } from "../../components/tasks/editTask";
import { FaArrowLeft, FaUserSlash } from "react-icons/fa";

export const Tasks = () =>
{
    const auth = JSON.parse(localStorage.getItem("auth"));

    const deleteUser = async () =>
    {
        const confirmDeleted = window.confirm(
        `This action will permanently delete the logged in account and all of its tasks! Do you wish to continue?
        \nEstá ação irá deletar permanentemente a conta logada e todas as suas tasks! Deseja continuar?`
        );
        if(confirmDeleted && env.API_URL) 
        {
            alert("User Deleted!");
            await axios
            ({
                method: "delete",
                baseURL: env.API_URL,
                url: "/user",
                headers: { "authorization": "Bearer " + auth.acessToken }
            })
            localStorage.clear();
            window.location.replace("/");
        }
        else alert("Delete Canceled!");
    }

    const [inEditTask, setInEditTask] = useState(false);
    const [ tasks, setTasks ] = useState([]);
    const [ fetchTasks, setFetchTasks ] = useAsyncFn(async () => 
    {
        if ( !!env.API_URL )
        {
            const res = await axios
            ({
                method: "get",
                baseURL: env.API_URL,
                url: "/tasks",
                headers: { "authorization": "Bearer " + auth.acessToken }
            })
            const mapTasks = [...res.data].map( tasks => JSON.parse(tasks.task))
            return mapTasks;
        }
        else return [];
    });

    useEffect(() => 
    {
        setFetchTasks().then( (value) => setTasks(value) );
    }, [ setFetchTasks ]);

    const taskEvents = 
    {
        newTask: async (taskTitle) =>
        {
            const newTaskID = uuid();
            const newTasks =  [...tasks];
            newTasks.push({ id: newTaskID, title: taskTitle, description: "", completed: false });
            setTasks(newTasks);
            if ( !!env.API_URL )
            {
                await axios
                ({
                    method: "post",
                    baseURL: env.API_URL,
                    url: "/task",
                    headers: { "authorization": "Bearer " + auth.acessToken },
                    data: { id: newTaskID, title: taskTitle }
                })
            }
        },

        conclusedTask: async (task) =>
        {
            task.completed = task.completed ? false : true;
            const newTasks = [ ...tasks ];
            newTasks[tasks.findIndex( e => e.id === task.id)] = task;
            setTasks(newTasks)
            
            if ( !!env.API_URL )
            {
                await axios
                ({
                    method: "put",
                    baseURL: env.API_URL,
                    url: "/task",
                    headers: { "authorization": "Bearer " + auth.acessToken },
                    data: { id: task.id, title: task.title, description: task.description, completed: task.completed }
                })
            }
        },

        editTask: (task) => { setInEditTask(task); setFetchTasks(); },

        deleteTask: async (task) =>
        {
            const newTasks = [ ...tasks ];
            newTasks.splice(newTasks.findIndex( (e) => e.id === task.id ), 1);
            setTasks(newTasks)
            if ( !!env.API_URL )
            {
                await axios
                ({
                    method: "delete",
                    baseURL: env.API_URL,
                    url: "/task",
                    headers: { "authorization": "Bearer " + auth.acessToken },
                    data: { id: task.id }
                })
            }
        }
    }

    return (
        <div style={{padding: "5vh 5vw"}}>
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