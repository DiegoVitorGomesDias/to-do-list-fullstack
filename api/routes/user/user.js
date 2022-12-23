import { request, response } from "express";
import mysql from "mysql";

import dotenv from "dotenv";
dotenv.config();

import { v4 as uuid } from "uuid";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const pool = mysql.createPool
({
    connectionLimit : 10,
    host            : process.env.HOST,
    user            : process.env.USER,
    password        : process.env.PASSWORD,
    database        : process.env.DATABASE
})

export const postUser = async (req = request, res = response) =>
{
    const { username, email, password } = req.body;

    const passwordHash = await bcrypt.hash(password, (process.env.JWT_KEY).length)

    pool.getConnection((err, connection) =>
    {
        connection.query(
        "INSERT INTO users (`id`, `username`, `email`, `password`) VALUES " + `('${uuid()}', '${username}', '${email}', '${passwordHash}')`, 
        (err, data) =>
        {
            connection.release();

            if (err) res.status(400).json({"Error": "Invalid Query"});
            res.status(201).json(data)
        })
    })
}

export const getUsers = (req = request, res = response) =>
{
    pool.getConnection((err, connection) =>
    {
        if (err) throw err;
        connection.query("SELECT * FROM users", (err, data) =>
        {
            connection.release()
            if (err) throw err;
            res.status(200).json(data)
        })
    })
}

export const userLogin = (req = request, res = response) =>
{
    const [ basic, auth ] = (req.headers.authorization).split(" ");
    const [ email, password ] = Buffer.from(auth, "base64").toString().split(":");
    
    pool.getConnection((err, connection) =>
    {
        if (err) throw err;
        connection.query("SELECT * FROM users WHERE `email` = " + `'${email}'`,
        async (err, data) =>
        {
            connection.release();
            if (err) throw err;

            if(!data[0]) return res.status(400).json({"Error": "Login Invalid"});
            const { id, username, email, password: hashPassword } = data[0];
            
            const validPassword = await bcrypt.compare(password, hashPassword);
            if(!validPassword) return res.status(400).json({"Error": "Password Invalid"});
            
            const token = jwt.sign(
            {
                id, username, email
            }, process.env.JWT_KEY, { expiresIn: '48h' });

            res.status(200).json({sub: {id, username, email}, acessToken: token});
        })
    })
}

export const deleteUser = (req = request, res = response) =>
{
    const [type, token] = (req.headers.authorization).split(" ");
    const user = jwt.verify(token, process.env.JWT_KEY);

    pool.getConnection((err, connection) =>
    {
        if (err) throw err;
        connection.query("DELETE FROM tasks WHERE `userID` = " + `'${user.id}'`, 
        (err, data) =>
        {
            connection.release()
            if (err) return res.status(400).json({"Error": "Query Invalid"})
        })
    })

    pool.getConnection((err, connection) =>
    {
        if (err) throw err;
        connection.query("DELETE FROM users WHERE `id` = '" + user.id + "'", 
        (err, data) =>
        {
            connection.release();
            if (err) throw err;
            res.status(200).json({data})
        })
    })
}