import React from 'react';
import { FaAngleLeft } from "react-icons/fa";

import * as yup from "yup";
import { useFormik } from "formik";

import * as userAPI from "../../routes/user";
import serverTestConnection from '../../routes/serverTestConnection';

export const Login = () =>
{   
    const validationSchema = yup.object().shape
    ({
        email: yup.string().email("Insert E-mail valid.").required("Required."),
        password: yup.string().min(8, "Password with at least 8 characters.").required("Required."),
    })

    const { isValid, isSubmitting, touched, values, handleBlur, handleChange, handleSubmit, errors } = useFormik
    ({
        initialValues:
        {
            email: "",
            password: "",
        },
        validationSchema,
        onSubmit: async (values) => 
        {
            if( await serverTestConnection() )
            {
                await userAPI.login(values)
                .then( (res) => 
                { 
                    localStorage.setItem("auth", JSON.stringify(res.data));
                    window.location.pathname = "/tasks";
                })
                .catch( (err) => alert(err) )
            }
            else
            {
                localStorage.setItem("auth", JSON.stringify({"acessToken": 123456789, sub: { username: values.email }}));
                window.location.pathname = "/tasks";
            }
        }
    })

    return (
        <>
            <form className='content' onSubmit={handleSubmit}>
                <div id="titlewithicon">
                    <FaAngleLeft className="icon" onClick={() => window.location.pathname = "/"}/>
                    <h1>Login</h1>
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
                <button 
                    className={`btn btn-primary 
                    ${!isValid && touched.email && touched.password && "error"}`} 
                    type='submit'
                    title="Login"
                    >{isSubmitting ? "Loading..." : "Login"}</button>
            </form>
        </>
    )
}