import express from "express";
import cors from "cors";
import path from "node:path";
import { createServer } from "node:http";
import { Server as IOServer } from "socket.io";

import notFoundHandler from "./middlewares/notFoundHandler.js";
import errorHandler from "./middlewares/errorHandler.js";

import authRouter from "./routers/auth.router.js";
import usersRouter from "./routers/users.router.js";
import postsRouter from "./routers/posts.router.js";
import likesRouter from "./routers/likes.router.js";
import commentsRouter from "./routers/comments.router.js";
import followsRouter from "./routers/follows.router.js";
import notificationsRouter from "./routers/notifications.router.js";
import messagesRouter from "./routers/messages.router.js";
import Message from "./db/Message.js";


const startServer = () => {
    const app = express();

    app.use(cors());
    app.use(express.json());
    app.use(express.static("public"));
    app.use("/public", express.static(path.resolve("public")));

    app.use("/api/auth", authRouter);
    app.use("/api/users", usersRouter);
    app.use("/api/posts", postsRouter);
    app.use("/api/likes", likesRouter);
    app.use("/api/comments", commentsRouter);
    app.use("/api/follows", followsRouter);
    app.use("/api/notifications", notificationsRouter);
    app.use("/api/messages", messagesRouter);

    app.use(notFoundHandler);
    app.use(errorHandler);

    // Создаём HTTP-сервер и цепляем Express
    const server = createServer(app);

    // Навешиваем Socket.IO на тот же сервер
    const io = new IOServer(server, {
        cors: { origin: "*", credentials: true },
    });

    app.set("io", io);

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

    const PORT = process.env.PORT || 3000;
    server.listen(PORT, () => {
        console.log(`Server + WebSocket running on port ${PORT}`);
    });
};

export default startServer;


