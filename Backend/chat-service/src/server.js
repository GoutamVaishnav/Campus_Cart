import http from "http";
import app from "./app.js";
import initSocket from "./sockets/index.js";
import dotenv from "dotenv";
import { initRabbit } from "./config/rabbitmq.js";

dotenv.config();

const server = http.createServer(app);

initSocket(server);

initRabbit();

server.listen(process.env.PORT, () => {
  console.log("Chat Service Running");
});
