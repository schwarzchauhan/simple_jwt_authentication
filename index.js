const http = require('http');
const app = require('./app');
const server = http.createServer(app);

const { API_PORT } = process.env;
const port = process.env.PORT || API_PORT;
console.log(port);

server.listen(port, () => {
    console.log(`Server listening on port ${port}...`);
});