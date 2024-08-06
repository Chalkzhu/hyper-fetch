import { getSocketAdapterBindings } from "@hyper-fetch/sockets";
import { onValue, query, Database, ref, goOffline, goOnline } from "firebase/database";

import { getOrderedResultRealtime, mapRealtimeConstraint } from "./utils";
import { getStatus, isDocOrQuery } from "utils";
import { RealtimeSocketAdapterType } from "adapter";
import { RealtimePermittedMethods } from "../constraints";

export const realtimeSockets = (database: Database): RealtimeSocketAdapterType => {
  return (socket) => {
    const {
      state,
      listeners,
      removeListener,
      onConnect,
      onReconnect,
      onDisconnect,
      onListen,
      onConnected,
      onDisconnected,
      onEvent,
      onError,
    } = getSocketAdapterBindings(socket, { connected: true });

    const connect = () => {
      const enabled = onConnect();

      if (enabled) {
        goOnline(database);
        onConnected();
      }
    };

    const disconnect = () => {
      goOffline(database);
      onDisconnect();
      onDisconnected();
    };

    const reconnect = () => {
      onReconnect(disconnect, connect);
    };

    const listen: ReturnType<RealtimeSocketAdapterType>["listen"] = (listener, callback) => {
      const fullUrl = socket.url + listener.topic;
      const path = ref(database, fullUrl);

      const { options } = listener;
      const onlyOnce = options?.onlyOnce || false;
      const params =
        options?.constraints?.map((constraint: RealtimePermittedMethods) => mapRealtimeConstraint(constraint)) || [];
      const queryConstraints = query(path, ...params);
      let unsubscribe = () => {};
      let unmount = () => {};
      let clearListeners = () => {};
      unsubscribe = onValue(
        queryConstraints,
        (snapshot) => {
          const response = isDocOrQuery(fullUrl) === "doc" ? snapshot.val() : getOrderedResultRealtime(snapshot);
          const status = getStatus(response);
          const extra = { ref: path, snapshot, status };
          callback({ data: response, extra });
          onEvent(listener.topic, response, extra);
        },
        (error) => {
          onError(error);
        },
        { onlyOnce },
      );
      unmount = onListen(listener, callback, unsubscribe);
      clearListeners = () => {
        unsubscribe();
        unmount();
      };

      return clearListeners;
    };

    const emit = async () => {
      throw new Error("Cannot emit from Realtime database socket.");
    };

    return {
      state,
      listeners,
      listen,
      removeListener,
      emit,
      connect,
      reconnect,
      disconnect,
    };
  };
};
