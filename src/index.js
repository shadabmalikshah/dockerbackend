const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const authRouter = require("./routes/authRouter");
const userRouter = require("./routes/userRouter");
const postRouter = require("./routes/postRouter");
const commentRouter = require("./routes/commentRouter");
const notificationRouter = require("./routes/notificationRouter");
const conversationRouter = require("./routes/conversationRouter");
const messagesRouter = require("./routes/messagesRouter");
const uploadImgRouter = require("./routes/uploadImgRouter");
const morgan = require("morgan");
const dbConnect = require("./config/dbConnect");
const { createServer } = require("http");
const { Server } = require("socket.io");
const SocketServer = require("./socketServer");
const { ExpressPeerServer } = require("peer");

const app = express();

const result = dotenv.config({
  path: path.join(__dirname, "..", ".env.production"),
});
process.env = {
  ...process.env,
  ...result.parsed,
};

const PORT = process.env.PORT || 4000;

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: process.env.URL_FRONTEND },
});

dbConnect();
app.use(morgan("dev"));

const corsOptions = {
  origin: process.env.URL_FRONTEND,
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: false,
  })
);
app.use(cookieParser());

// Socket
io.on("connection", (socket) => {
  SocketServer(socket);
});

// Create peer Server
ExpressPeerServer(httpServer, { path: "/" });

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/post", postRouter);
app.use("/api/comment", commentRouter);
app.use("/api/notification", notificationRouter);
app.use("/api/conversation", conversationRouter);
app.use("/api/messages", messagesRouter);
app.use("/api/upload", uploadImgRouter);

httpServer.listen(PORT, () => {
  console.log(`Server is running at PORT ${PORT}`);
});
