import { request, response } from "express";
import mysql from "mysql";

import dotenv from "dotenv";
dotenv.config();

import jwt from "jsonwebtoken";

const pool = mysql.createPool
({
    connectionLimit : 10,
    host            : process.env.HOST,
    user            : process.env.USER,
    password        : process.env.PASSWORD,
    database        : process.env.DATABASE
})

export const postTask = async (req = request, res = response) =>
{
    const [type, token] = (req.headers.authorization).split(" ");
    const user = jwt.verify(token, process.env.JWT_KEY);

    const { id, title } = req.body;

    const task =
    {
        id,
        title,
        description: "",
        completed: false
    }

    const currentDate = new Date().toLocaleString("EU").replaceAll("/", "-");

    pool.getConnection((err, connection) =>
    {
        connection.query(
        "INSERT INTO tasks (`timeCreated`, `id`, `userID`, `task`) VALUES " + `('${currentDate}', '${task.id}', '${user.id}', '${JSON.stringify(task)}')`, 
        (err, data) =>
        {
            connection.release();

            if (err) res.status(400).json({"Error": "Invalid Query"});
            res.status(201).json(data)
        })
    })
}

export const getTasksFromUser = async (req = request, res = response) =>
{
    const [type, token] = (req.headers.authorization).split(" ");
    const user = jwt.verify(token, process.env.JWT_KEY);

    pool.getConnection((err, connection) =>
    {
        if (err) throw err;
        connection.query(
            "SELECT * FROM tasks WHERE `userID` = '" + user.id +  "' ORDER BY `tasks`.`timeCreated` ASC",
        (err, data) =>
        {
            connection.release();

            if (err) res.status(400).json({"Error": "Invalid Query"});
            res.status(201).json(data)
        })
    })

}

export const updateTask = async (req = request, res = response) =>
{
    const [type, token] = (req.headers.authorization).split(" ");
    const user = jwt.verify(token, process.env.JWT_KEY);

    const { id = undefined, title = undefined, description = "", completed = "" } = req.body;
    if ( !id || !((completed).toString()) ) return res.status(400).json({"Error": "Task Invalid"})

    const task =
    {
        id,
        title,
        description: description.replaceAll("\r\n", "\\r\\n").replaceAll("\n", "\\r\\n").replaceAll("\\\n", "\\n"),
        completed
    }

    pool.getConnection((err, connection) =>
    {
        if (err) throw err;
        connection.query(
        "UPDATE `tasks` SET `task` = '" + JSON.stringify(task) + 
        "' WHERE `id` = '" + task.id +
        "' AND `userID` = '" + user.id + "'",
        (err, data) =>
        {
            connection.release()
            if (err) return res.status(400).json({"Error": "Query Invalid"})
            res.status(200).json({data})
        })
    })
}

export const deleteTask = async (req = request, res = response) =>
{
    const [type, token] = (req.headers.authorization).split(" ");
    const user = jwt.verify(token, process.env.JWT_KEY);

    const { id: taskID = undefined} = req.body;
    if (!taskID) return res.status(400).json({"Error": "TaskID Invalid"});

    pool.getConnection((err, connection) =>
    {
        if (err) throw err;
        connection.query("DELETE FROM tasks WHERE `id` = " + `'${taskID}' AND ` + "`userID` =" + `'${user.id}'`, 
        (err, data) =>
        {
            connection.release()
            if (err) return res.status(400).json({"Error": "Query Invalid"})
            res.status(200).json({data})
        })
    })

}