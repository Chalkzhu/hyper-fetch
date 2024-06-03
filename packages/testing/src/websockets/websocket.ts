import WS from "jest-websocket-mock";
import {
  ListenerInstance,
  ExtractListenerResponseType,
  EmitterInstance,
  ExtractListenerTopicType,
  ExtendListener,
  ExtendEmitter,
  ExtractEmitterTopicType,
  ExtractEmitterPayloadType,
  ExtractEmitterHasDataType,
} from "@hyper-fetch/sockets";
import { ExtractRouteParams, NegativeTypes } from "@hyper-fetch/core";

const constructEventData = <T extends Record<string, any>>({ topic }: { topic: string }, data: T) => {
  return {
    data,
    topic,
  };
};

export const createWebsocketMockingServer = () => {
  const url = "ws://localhost:1234";
  const server = { current: new WS(url) };

  const getServer = () => {
    return server.current;
  };

  const startServer = () => {
    getServer().close();
    server.current = new WS(url);
  };

  const waitForConnection = async () => {
    return getServer().connected;
  };

  const stopServer = (): void => {
    getServer().close();
    WS.clean();
  };

  const emitListenerEvent = <T extends ListenerInstance>(
    listener: ExtendListener<
      T,
      { hasParams: ExtractRouteParams<ExtractListenerTopicType<T>> extends NegativeTypes ? false : true }
    >,
    event: ExtractListenerResponseType<T> extends Record<string, any>
      ? ExtractListenerResponseType<T>
      : Record<string, any>,
  ) => {
    const data = constructEventData(listener, event);

    getServer().send(JSON.stringify(data));
  };

  const expectEmitterEvent = <T extends EmitterInstance, Data extends ExtractEmitterPayloadType<T> | void = void>(
    emitter: ExtendEmitter<
      T,
      {
        hasParams: ExtractRouteParams<ExtractEmitterTopicType<T>> extends NegativeTypes ? false : true;
        hasData: Data extends void ? (ExtractEmitterHasDataType<T> extends false ? true : false) : false;
      }
    >,
    data?: Data,
  ) => {
    return expect(getServer()).toReceiveMessage(
      JSON.stringify({
        topic: emitter.topic,
        data: data ?? emitter.data,
      }),
      { timeout: 5000 },
    );
  };

  return {
    url,
    getServer,
    waitForConnection,
    startServer,
    stopServer,
    emitListenerEvent,
    expectEmitterEvent,
  };
};
