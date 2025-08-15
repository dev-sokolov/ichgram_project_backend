import express from "express";
import cors from "cors";
import path from "node:path";

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

    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log(`Server running on ${port} port`));
}

export default startServer;



