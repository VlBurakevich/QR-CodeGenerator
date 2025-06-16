const app = require('./src/app.js')

const PORT = process.env.PORT || 8080

const server = app.listen(PORT, () => {
    console.log(`Server is running on port:${PORT}`);
    console.log(`Access is at http://localhost:${PORT}`);
});

server.on('error', (err) => {
    console.error('Error on server', err);
})