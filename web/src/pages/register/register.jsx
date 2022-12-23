import axios from "axios";

import React from 'react';
import "./register.css";

import { FaAngleLeft } from 'react-icons/fa'

import * as yup from "yup";
import { useFormik } from "formik";

import env from "react-dotenv";

export const Register = () =>
{   
    const regexUser = "^[a-zA-Z0-9]([._-](?![._-])|[a-zA-Z0-9]){3,18}[a-zA-Z0-9]$"

    const validationSchema = yup.object().shape
    ({
        username: yup.string().matches(regexUser, { message: "User not contains characters special." }).required("Required."),
        email: yup.string().email("Insert E-mail valid.").required("Required."),
        password: yup.string().min(8, "Password with at least 8 characters.").required("Required."),
        confirmPassword: yup.string().min(8, "Password with at least 8 characters.").oneOf([yup.ref("password"), null], "Password is different.").required("Required.")
    })

    const { isValid, touched, values, handleBlur, handleChange, handleSubmit, errors, isSubmitting } = useFormik
    ({
        initialValues:
        {
            username: "",
            email: "",
            password: "",
            confirmPassword: ""
        },
        validationSchema,
        onSubmit: async (values) => 
        {
            const resPost = await axios
            ({
                method: "post",
                baseURL: env.API_URL,
                url: "/user",
                data: { username: values.username, email: values.email, password: values.password }
            }).catch((err) => alert("Account existing"))

            if(resPost.status === 201)
            {
                const auth = await axios
                ({
                    method: "get",
                    baseURL: env.API_URL,
                    url: "/login",
                    auth:
                    {
                        username: values.email,
                        password: values.password
                    }
                }).catch((err) => alert("E-mail or Password invalid"))
                localStorage.setItem("auth", JSON.stringify(auth.data));
                window.location.pathname = "/tasks";
            }
        }
    })

    return (
        <>
            <form className='content' onSubmit={handleSubmit}>
                <div id="titlewithicon">
                    <FaAngleLeft className="icon" onClick={() => window.location.pathname = "/"}/>
                    <h1>Register</h1>
                </div>
                <div>
                    <label htmlFor="username">Username:</label>
                    <input type="text" name="username" id="username" placeholder='Insert your username'
                        value={values.username}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        className={errors.username && touched.username && "error"}
                    />
                    <small>{ touched.username && errors.username }</small>
                </div>
                <div>
                    <label htmlFor="email">E-mail:</label>
                    <input type="email" name="email" id="email" placeholder="Insert your e-mail"
                        value={values.email}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        className={errors.email && touched.email && "error"}
                    />
                    <small>{ touched.email && errors.email }</small>
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input type="password" name="" id="password" placeholder="Insert your password"
                        value={values.password}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        className={errors.password && touched.password && "error"}
                    />
                    <small>{ touched.password && errors.password }</small>
                </div>
                <div>
                    <label htmlFor="confirmPassword">Confirm Password:</label>
                    <input type="password" name="confirmPassword" id="confirmPassword" placeholder="Insert your password for confirm"
                        value={values.confirmPassword}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        className={errors.confirmPassword && touched.confirmPassword && "error"}
                    />
                    <small>{ touched.confirmPassword && errors.confirmPassword }</small>
                </div>
                <button 
                    className={`btn btn-primary 
                    ${!isValid && touched.username && touched.email && touched.password && touched.confirmPassword && "error"}`} 
                    type='submit'
                    title="Register Account"
                >{isSubmitting ? "Loading..." : "Register"}</button>
            </form>
        </>
    )
}