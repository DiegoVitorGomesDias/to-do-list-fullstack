import axios from "axios";
import env from "react-dotenv";

const auth = JSON.parse(localStorage.getItem("auth"));

export const login = async ({ email, password }) =>
{
    return await axios
    ({
        method: "get",
        baseURL: env.API_URL,
        url: "/login",
        auth: { username: email, password }
    })
}

export const postUser = async ({ username, email, password }) =>
{
    return await axios
    ({
        method: "post",
        baseURL: env.API_URL,
        url: "/user",
        data: { username, email, password }
    })
}

export const deleteUser = async () =>
{
    return await axios
    ({
        method: "delete",
        baseURL: env.API_URL,
        url: "/user",
        headers: { "authorization": "Bearer " + auth.acessToken }
    })
}