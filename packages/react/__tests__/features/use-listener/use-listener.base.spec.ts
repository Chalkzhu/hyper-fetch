import { act, waitFor } from "@testing-library/react";
import { createWebsocketMockingServer } from "@hyper-fetch/testing";

import { createListener } from "../../utils/listener.utils";
import { renderUseListener } from "../../utils/use-listener.utils";

describe("useListener [ Base ]", () => {
  const { startServer, stopServer, emitListenerEvent } = createWebsocketMockingServer();
  const spy = jest.fn();
  let listener = createListener();

  beforeEach(async () => {
    startServer();
    listener = createListener();
    await listener.socket.waitForConnection();
    jest.resetModules();
    jest.resetAllMocks();
  });

  afterEach(() => {
    stopServer();
  });

  describe("when hook receive event", () => {
    it("should set state with data", async () => {
      const message = { name: "Maciej", age: 99 };
      const view = renderUseListener(listener);
      emitListenerEvent(listener, message);
      await waitFor(() => {
        expect(view.result.current.data).toBeTruthy();
        expect(view.result.current.connected).toBeTrue();
        expect(view.result.current.connecting).toBeFalse();
        expect(view.result.current.timestamp).toBeNumber();
      });
    });
    it("should trigger onEvent callback", async () => {
      const message = { name: "Maciej", age: 99 };
      const view = renderUseListener(listener);
      let receivedData: any;
      let receivedEventData: any;
      act(() => {
        view.result.current.onEvent(({ data, extra }) => {
          receivedData = data;
          receivedEventData = extra;
          spy();
        });
      });
      emitListenerEvent(listener, message);
      await waitFor(() => {
        expect(spy).toBeCalledTimes(1);
        expect(receivedData).toEqual(message);
        expect(receivedEventData).toBeDefined();
      });
    });
  });
});
