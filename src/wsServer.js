import { createServer } from "node:http";
import { Server as IOServer } from "socket.io";
import Message from "./db/Message.js";

const startWebsocketServer = () => {
    const httpServer = createServer();

    const io = new IOServer(httpServer, {
        cors: { origin: "*", credentials: true },
    });

    io.on("connection", (socket) => {
        console.log("New client connected");

        socket.on("join", (userId) => {
            socket.join(userId.toString());
        });

        socket.on("disconnect", () => {
            console.log("Client disconnected");
        });
    });

    Message.watch().on("change", (data) => {
        if (data.operationType === "insert") {
            const newMessage = data.fullDocument;

            io.to(newMessage.recipient.toString()).emit("new_message", newMessage);
            io.to(newMessage.sender.toString()).emit("message_sent", newMessage);
        }
    });

    const port = process.env.SOCKET_PORT || 5000;
    httpServer.listen(port, () => {
        console.log(`WebSocket server running on port ${port}`);
    });
};

export default startWebsocketServer;