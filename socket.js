const express = require("express");
const {
    createServer
} = require("http");
const {
    Server
} = require("socket.io");
const cors = require("cors");
require("dotenv").config();
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*"
    }
});

app.use(cors());

const EVENT_GET_LOCATION = "server-get-location";
const EVENT_SENT_LOCATION = "server-sent-location";

const SIDE_SEPARATOR = "#----#";
const SIDE_EVENT_HELLO = "side-hello";

const activeUser = {};

io.on("connection", (socket) => {

    socket.emit(SIDE_EVENT_HELLO, {
        data: "HELLO YOU CONNECTED",
    });

    socket.emit("RESENT_CURRENT_LOCATION", {
        data: "HELLO YOU CONNECTED",
    });

    socket.on(EVENT_GET_LOCATION, (data) => {
        const packet = JSON.parse(data); // {lng: 3.000, lat: 1.000}
    });

    socket.on(EVENT_SENT_LOCATION, (data) => {
        console.log(`${socket.handshake.query.id}`)
        console.log(`[${new Date().toDateString()}-${EVENT_SENT_LOCATION}] : receive message ${data}`);
        console.log(data);
        console.log(socket.handshake.query.id)
        // const packet = JSON.parse(data); // {lng: 3.000, lat: 1.000}
        activeUser[socket.handshake.query.id] = data;
        console.log(`${socket.handshake.query.id}${SIDE_SEPARATOR}${data.schedule_id}`)
        io.emit(`${socket.handshake.query.id}${SIDE_SEPARATOR}${data.schedule_id}`, {
            data: {
                driver_id: socket.handshake.query.id,
                schedule_id: data.schedule_id,
                location: data,
            },
        });
    });
});

const PORT = process.env.PORT || 8081;
httpServer.listen(PORT, () => {
    console.log(`Socket ready to use at ${process.env.URL} at ${new Date().toDateString()}`);
});