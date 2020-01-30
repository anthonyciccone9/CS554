const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const redisc = require("./redis-connection");

app.get('/', async (req, res) => {
    res.sendFile(__dirname + "/index.html");
})

io.on("connection", socket => {
    socket.on("post", message => {
        redisc.emit("get-image", message);
    });
});

redisc.on("resp-data", (data, channel) => {
    io.emit("create-image", data);
});

http.listen(3000,() => {
    console.log("We've now got a server!");
    console.log("Your routes will be running on http://localhost:3000");
})
