import { Server } from "socket.io";
import Redis from "ioredis";
import prismaClient from "./prisma";
import { produceMessage } from "./kafka";

const pub = new Redis({
  host: "",
  port: 13738,
  username: "",
  password: "",
});

const sub = new Redis({
  host: "",
  port: 13738,
  username: "",
  password: "",
});

class SocketService {
  private _io: Server;

  constructor() {
    console.log("Init Socket Service...");
    this._io = new Server({
      cors: {
        allowedHeaders: ["*"],
        origin: "*",
      },
    });
    sub.subscribe("MESSAGES");
  }

  public initListeners() {
    const io = this.io;
    console.log("Init Socket Listners....");

    io.on("connect", (socket) => {
      console.log(`New Socket Connected`, socket.id);
      socket.on("event:message", async ({ message }: { message: string }) => {
        console.log("New Message Rec.", message);

        //publish this message to redis
        await pub.publish("MESSAGES", JSON.stringify({ message }));
      });
    });
    sub.on("message", async (channel, message) => {
      if (channel === "MESSAGES") {
        io.emit("message", message);
        produceMessage(message);

        console.log("Message Produced to Kafka Broker");

        // --------store this message in PostgreSQL via Prisma------
        // await prismaClient.message.create({
        //   data: {
        //     text: message,
        //   },
        // });
      }
    });
  }
  get io() {
    return this._io;
  }
}

export default SocketService;
