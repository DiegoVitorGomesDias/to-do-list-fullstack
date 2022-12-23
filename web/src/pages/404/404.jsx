import React from 'react';
import "./404.css";
export const Error404 = () =>
{
    return (
        <>
            <span id='Error404' className='content'>
                <h1>Error 404</h1>
                <p>Not Found Query</p>
                <a href="/tasks">Return Tasks</a>
            </span>
        </>
    )
}