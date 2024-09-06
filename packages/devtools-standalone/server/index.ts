import { createServer } from "http";
import { WebSocket, WebSocketServer } from "ws";
import url from "url";
import { SocketTopics } from "../src/sockets/topics";
import { MessageType, MessageTypes } from "../types/messages.types";
import { ConnectionName } from "../src/sockets/connection.name";

const port = 1234;
const server = createServer();
const wss = new WebSocketServer({ server });

// TODO - add heartbeat + cleanup of hangup connections.

let FRONTEND_WS_CONNECTION: WebSocket | null = null;
const connections: Record<string, { ws: WebSocket; handshake: "pending" | "sent" | "confirmed"; events: any[] }> = {};
const addConnection = (connectionName: string, connection: WebSocket) => {
  if (!connections[connectionName]) {
    connections[connectionName] = { ws: connection, handshake: "pending", events: [] };
  } else {
    connections[connectionName].ws = connection;
  }
  if (FRONTEND_WS_CONNECTION) {
    sendHandshake(connectionName);
    connections[connectionName].handshake = "sent";
  }
  // TODO handle disconnected etc.
};

const sendPendingHandshakes = () => {
  Object.keys(connections).forEach((connectionName) => {
    if (connections[connectionName].handshake === "pending") {
      sendHandshake(connectionName);
      connections[connectionName].handshake = "sent";
    }
  });
};

const sendHandshake = (connectionName: string) => {
  FRONTEND_WS_CONNECTION!.send(
    JSON.stringify({
      ...{
        topic: SocketTopics.DEVTOOLS_APP_MAIN_LISTENER,
        data: { messageType: MessageType.DEVTOOLS_CLIENT_INIT, connectionName },
      },
    }),
  );
};

wss.on("connection", function connection(conn, request) {
  const queryParams = url.parse(request.url!, true).query;
  const { connectionName } = queryParams as { connectionName: string };
  console.log("CONNECTION NAME", connectionName);
  // TODO HANDLE REFRESHING CONNECTION AND HANGUP
  if (connectionName && connectionName === ConnectionName.HF_DEVTOOLS_APP) {
    console.log("CONNECTED TO DEVTOOLS FRONTEND");
    FRONTEND_WS_CONNECTION = conn;
    sendPendingHandshakes();
  }
  if (connectionName && !Array.isArray(connectionName) && connectionName.startsWith("HF_DEVTOOLS_CLIENT")) {
    // TODO handle connecting before frontend app
    addConnection(connectionName, conn);
  }
  conn.on("error", console.error);

  conn.on("message", function message(msg: MessageTypes) {
    const message = JSON.parse(msg.toString()) as MessageTypes;
    console.log("RECEIVED MESSAGE", message);
    if (!FRONTEND_WS_CONNECTION) {
      // TODO handle
      console.error("FRONTEND CONNECTION NOT YET ESTABLISHED");
    }

    switch (message.data.messageType) {
      case MessageType.DEVTOOLS_CLIENT_CONFIRM:
        console.log("ESTABLISHED CONNECTION", message.data.connectionName);
        if (!connections[message.data.connectionName]) {
          console.error(`CONNECTION ${message.data.connectionName} DOES NOT EXIST. HOW COULD THAT BE`);
        }
        connections[message.data.connectionName].handshake = "confirmed";
        const connectionEvents = connections[message.data.connectionName]?.events;

        while (connectionEvents && connectionEvents.length > 0) {
          console.log("SENDING STORED EVENTS");
          FRONTEND_WS_CONNECTION!.send(connectionEvents.shift());
        }
        return;
      case MessageType.HF_EVENT: {
        const conn = message.data.connectionName;
        if (connections[conn]?.handshake) {
          console.log("SENDING HF EVENT", message);
          FRONTEND_WS_CONNECTION!.send(
            JSON.stringify({ ...message, topic: SocketTopics.DEVTOOLS_APP_CLIENT_LISTENER }),
          );
        } else {
          console.log("STORING EVENT");
          connections[conn]["events"].push(
            JSON.stringify({ ...message, topic: SocketTopics.DEVTOOLS_APP_CLIENT_LISTENER }),
          );
        }

        return;
      }
    }
  });
});

server.listen(port, () => {
  console.log(`WebSocket server is running on port ${port}`);
});
