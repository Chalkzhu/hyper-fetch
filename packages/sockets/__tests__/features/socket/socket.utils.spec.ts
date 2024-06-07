import { createWebsocketMockingServer } from "@hyper-fetch/testing";

import { EmitterInstance } from "emitter";
import { interceptEmitter, interceptListener, Socket } from "socket";

describe("Socket [ Utils ]", () => {
  const { url, startServer, stopServer } = createWebsocketMockingServer();
  beforeEach(() => {
    jest.resetAllMocks();
    startServer();
  });

  afterEach(() => {
    stopServer();
  });

  it("should throw on invalid listener interceptor", async () => {
    const socket = new Socket({ url });

    socket.onMessage(() => null);
    expect(() => interceptListener(socket.__onMessageCallbacks, { data: {}, extra: {} } as any, socket)).toThrow();
  });

  it("should throw on invalid listener interceptor", async () => {
    const socket = new Socket({ url });

    socket.onSend(() => null);
    expect(() => interceptEmitter(socket.__onSendCallbacks, {} as EmitterInstance)).toThrow();
  });
});
