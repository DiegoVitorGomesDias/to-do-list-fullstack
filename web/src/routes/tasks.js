import axios from "axios";
import env from "react-dotenv";

const auth = JSON.parse(localStorage.getItem("auth"));

export const getTasksFromUser = async () =>
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

export const postTask = async ({newTaskID, taskTitle}) =>
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

export const updateTask = async (task) =>
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

export const deleteTask = async (id) =>
{
    await axios
    ({
        method: "delete",
        baseURL: env.API_URL,
        url: "/task",
        headers: { "authorization": "Bearer " + auth.acessToken },
        data: { id }
    })
}