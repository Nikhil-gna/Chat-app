"use client";
import { useState } from "react";
import { useSocket } from "../context/SocketProvider";
import classes from "./page.module.css";

export default function page() {
  const { sendMessage, messages } = useSocket();
  const [message, setMessage] = useState("");
  return (
    <div>
      <div>
        <input
          onChange={(e) => setMessage(e.target.value)}
          className={classes["chat-input"]}
          placeholder="Enter message here to send"
        />
        <button
          onClick={(e) => sendMessage(message)}
          className={classes["send-btn"]}
        >
          Send
        </button>
      </div>
      <div>
        <h1 className="text-3xl font-bold underline">
          All messages will appear here
        </h1>
        {messages.map((e) => (
          <li>{e}</li>
        ))}
      </div>
    </div>
  );
}
