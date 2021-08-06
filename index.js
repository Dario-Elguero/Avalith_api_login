const server = require('./src/app')
require("dotenv").config();
const { PORT } = process.env;

server.listen(PORT, () => {
    console.log(`Server listening at ${PORT}`);
});


