import app from "./setup.js"
const serverPort = 3500;

app.listen(serverPort, () =>  console.log(`Server running on port ${serverPort}`));