import axios from "axios";
import env from "react-dotenv";

const serverTestConnection = async () =>
{
    return await axios.request(env.API_URL)
    .then( () => true )
    .catch( () => false )
}

export default serverTestConnection;