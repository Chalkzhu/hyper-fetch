import { ExtractRouteParams, ParamsType } from "@hyper-fetch/core";

import { Socket } from "socket";
import { ListenType, ListenerListenOptionsType, ListenerOptionsType } from "listener";
import { SocketAdapterInstance } from "adapter";
import { ExtractAdapterListenerOptionsType } from "types";

export class Listener<
  Response,
  Topic extends string,
  AdapterType extends SocketAdapterInstance,
  HasParams extends boolean = false,
> {
  readonly topic: Topic;
  params?: ParamsType;
  options?: ExtractAdapterListenerOptionsType<AdapterType>;

  constructor(
    readonly socket: Socket<AdapterType>,
    readonly listenerOptions: ListenerOptionsType<Topic, AdapterType>,
  ) {
    const { topic, options } = listenerOptions;
    this.topic = topic;
    this.options = options;
  }

  setOptions(options: ExtractAdapterListenerOptionsType<AdapterType>) {
    return this.clone({ options });
  }

  setParams(params: ExtractRouteParams<Topic>) {
    return this.clone<true>({ params });
  }

  clone<Params extends true | false = HasParams>(options?: Partial<ListenerOptionsType<Topic, AdapterType>>) {
    const newInstance = new Listener<Response, Topic, AdapterType, Params>(this.socket, {
      ...this.listenerOptions,
      ...options,
      topic: this.paramsMapper(options?.params || this.params),
    });

    return newInstance;
  }

  listen: ListenType<this, AdapterType> = (
    callback: Parameters<ListenType<this, AdapterType>>[0],
    options: Parameters<ListenType<this, AdapterType>>[1],
  ) => {
    const opts = options as ListenerListenOptionsType<this>;
    const instance = options ? this.clone(opts as Partial<ListenerOptionsType<Topic, AdapterType>>) : this;

    this.socket.adapter.listen(instance, callback);

    const removeListener = () => {
      this.socket.adapter.removeListener(instance.topic, callback);
    };

    return removeListener;
  };

  private paramsMapper = (params: ParamsType | null | undefined): Topic => {
    let topic = this.listenerOptions.topic as string;
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        topic = topic.replace(new RegExp(`:${key}`, "g"), String(value));
      });
    }

    return topic as Topic;
  };
}
