import { request, response } from "express";

const verifyTitle = ( title = "" ) =>
{
    let validTitle = true;
    title.trim().length > 0 || (validTitle = false);
    return validTitle;
}

export const verifyTitleTask = ( req = request, res = response, next ) =>
{
    const { title = undefined } = req.body;
    if ( verifyTitle(title) ) next();
    else return res.status(400).json
    ({
        "Title": `${title} is ${verifyTitle(title) ? "Valid" : "Invalid" }`
    })
}