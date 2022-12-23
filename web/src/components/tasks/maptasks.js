import React from "react";
import Task from "./task";

export const MapTasks = ({tasks, events}) =>
{
    return(
        <>
            {
                [...tasks].reverse().sort( (a,b) => 
                (b.completed).toString().length - (a.completed).toString().length)
                .map(task => 
                ( 
                    <Task  task={task} events={events} key={task.id}/>
                ))
            }
        </>
    )
}