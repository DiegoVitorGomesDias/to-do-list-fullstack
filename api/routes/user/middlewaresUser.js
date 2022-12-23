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

const verifyUser = (username = "") =>
{
    let userValid = true;

    const usernameRegex = new RegExp('^[a-zA-Z0-9]([._-](?![._-])|[a-zA-Z0-9]){3,18}[a-zA-Z0-9]$', '');
    usernameRegex.test(username) || (userValid = false);

    username.length >= 3 || (userValid = false)
    return userValid;
}

const verifyEmail = (email = "") =>
{
    let emailValid = true;

    const emailRegex = new RegExp('^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+$', '');
    emailRegex.test(email) || (emailValid = false);

    return emailValid;
}

const verifyPassword = (password = "") =>
{
    let passwordValid = true;

    password.length >= 8 || (passwordValid = false);
    return passwordValid;
}

export const verifyUserEmailPassword = (req = request, res = response, next) =>
{
    const { username = undefined, email = undefined, password = undefined } = req.body;
    if (verifyUser(username) && verifyEmail(email) && verifyPassword(password)) next()
    else res.status(400).json
    ({
        username: `${verifyUser(username) ? "Username Valid" : "Username Invalid"}`,
        email: `${verifyEmail(email) ? "Email Valid" : "Email Invalid"}`,
        password: `${verifyPassword(password) ? "Password Valid" : "Password Invalid"}`
    });
}

export const verifyHasUser = (req = request, res = response, next) =>
{
    const { username, email } = req.body;

    pool.getConnection((err, connection) =>
    {
        if (err) throw err;

        connection.query
        ("SELECT COUNT(*) FROM users WHERE `username` = " + `'${username}' OR ` + "`email` = " + `'${email}'` , 
        (err, data) =>
        {
            connection.release();
            if (err) throw err;

            if (data[0]['COUNT(*)'] > 0) res.status(400).json({"Error": "User Existing"})
            else next();
        });
    })
}

export const verifyNotHasUser = (req = request, res = response, next) =>
{
    const [type, token] = (req.headers.authorization).split(" ");
    const user = jwt.verify(token, process.env.JWT_KEY);
    const { username, email } = user;

    pool.getConnection((err, connection) =>
    {
        if (err) throw err;

        connection.query
        ("SELECT COUNT(*) FROM users WHERE `username` = " + `'${username}' OR ` + "`email` = " + `'${email}'` , 
        (err, data) =>
        {
            connection.release();
            if (err) throw err;

            if (data[0]['COUNT(*)'] === 0) res.status(400).json({"Error": "User Not Existing"})
            else next();
        });
    })
}

export const verifyToken = (req = request, res = response, next) =>
{
    const [type, token] = (req.headers.authorization).split(" ");
    const user = jwt.verify(token, process.env.JWT_KEY, (err, decode) =>
    {
        if (err) { res.status(400).json({"Error": "Token Invalid"}); return undefined }
        else return decode;
    });
    if (!user) return;
    else next();
}