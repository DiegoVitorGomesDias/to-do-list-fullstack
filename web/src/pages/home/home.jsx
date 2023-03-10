import React from 'react';

export const Home = () =>
{
    return (
        <>
            <main className='content'>
                <h1>To-do List Online</h1>
                <button 
                    className='btn btn-primary' 
                    onClick={ () => window.location.replace("/login") }
                    title="Login"
                >Login</button>
                <button 
                    className='btn btn-secundary' 
                    onClick={ () => window.location.replace("/register") }
                    title="Register Account"
                >New Account</button>
            </main>
        </>
    )
}