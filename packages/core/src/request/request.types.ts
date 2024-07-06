import {
  NullableKeys,
  NegativeTypes,
  ExtractParamsType,
  ExtractPayloadType,
  ExtractAdapterType,
  ExtractEndpointType,
  ExtractHasDataType,
  ExtractHasParamsType,
  ExtractHasQueryParamsType,
  ExtractErrorType,
  ExtractResponseType,
  HttpMethodsType,
  ExtractQueryParamsType,
  ExtractLocalErrorType,
  TypeWithDefaults,
  ExtractClientType,
} from "types";
import { Request } from "request";
import { ResponseType, ExtractAdapterOptionsType, ExtractAdapterMethodType, ExtractAdapterEndpointType } from "adapter";
import { RequestEventType, RequestProgressEventType, RequestResponseEventType } from "managers";
import { Client, ClientInstance } from "client";

// Progress
export type AdapterProgressEventType = { total: number; loaded: number };
export type AdapterProgressType = {
  progress: number;
  timeLeft: number;
  sizeLeft: number;
};

/**
 * Dump of the request used to later recreate it
 */
export type RequestJSON<Request extends RequestInstance> = {
  requestOptions: RequestOptionsType<
    ExtractEndpointType<Request>,
    ExtractAdapterOptionsType<ExtractAdapterType<Request>>,
    ExtractAdapterMethodType<ExtractAdapterType<Request>>
  >;
  endpoint: ExtractEndpointType<Request>;
  method: ExtractAdapterMethodType<ExtractAdapterType<Request>>;
  headers?: HeadersInit;
  auth: boolean;
  cancelable: boolean;
  retry: number;
  retryTime: number;
  garbageCollection: number;
  cache: boolean;
  cacheTime: number;
  queued: boolean;
  offline: boolean;
  disableResponseInterceptors: boolean | undefined;
  disableRequestInterceptors: boolean | undefined;
  options?: ExtractAdapterOptionsType<ExtractAdapterType<Request>>;
  data: PayloadType<ExtractPayloadType<Request>>;
  params: ExtractParamsType<Request> | NegativeTypes;
  queryParams: ExtractQueryParamsType<Request> | NegativeTypes;
  abortKey: string;
  cacheKey: string;
  queueKey: string;
  effectKey: string;
  used: boolean;
  updatedAbortKey: boolean;
  updatedCacheKey: boolean;
  updatedQueueKey: boolean;
  updatedEffectKey: boolean;
  deduplicate: boolean;
  deduplicateTime: number;
};

// Request

/**
 * Configuration options for request creation
 */
export type RequestOptionsType<GenericEndpoint, AdapterOptions, RequestMethods = HttpMethodsType> = {
  /**
   * Determine the endpoint for request request
   */
  endpoint: GenericEndpoint;
  /**
   * Custom headers for request
   */
  headers?: HeadersInit;
  /**
   * Should the onAuth method get called on this request
   */
  auth?: boolean;
  /**
   * Request method picked from method names handled by adapter
   * With default adapter it is GET | POST | PATCH | PUT | DELETE
   */
  method?: RequestMethods;
  /**
   * Should enable cancelable mode in the Dispatcher
   */
  cancelable?: boolean;
  /**
   * Retry count when request is failed
   */
  retry?: number;
  /**
   * Retry time delay between retries
   */
  retryTime?: number;
  /**
   * Should we trigger garbage collection or leave data in memory
   */
  garbageCollection?: number;
  /**
   * Should we save the response to cache
   */
  cache?: boolean;
  /**
   * Time for which the cache is considered up-to-date
   */
  cacheTime?: number;
  /**
   * Should the requests from this request be send one-by-one
   */
  queued?: boolean;
  /**
   * Do we want to store request made in offline mode for latter use when we go back online
   */
  offline?: boolean;
  /**
   * Disable post-request interceptors
   */
  disableResponseInterceptors?: boolean;
  /**
   * Disable pre-request interceptors
   */
  disableRequestInterceptors?: boolean;
  /**
   * Additional options for your adapter, by default XHR options
   */
  options?: AdapterOptions;
  /**
   * Key which will be used to cancel requests. Autogenerated by default.
   */
  abortKey?: string;
  /**
   * Key which will be used to cache requests. Autogenerated by default.
   */
  cacheKey?: string;
  /**
   * Key which will be used to queue requests. Autogenerated by default.
   */
  queueKey?: string;
  /**
   * Key which will be used to use effects. Autogenerated by default.
   */
  effectKey?: string;
  /**
   * Should we deduplicate two requests made at the same time into one
   */
  deduplicate?: boolean;
  /**
   * Time of pooling for the deduplication to be active (default 10ms)
   */
  deduplicateTime?: number;
};

export type PayloadMapperType<Payload> = <NewDataType>(data: Payload) => NewDataType;

export type PayloadType<Payload> = Payload | NegativeTypes;

export type RequestConfigurationType<
  Payload,
  Params,
  QueryParams,
  GenericEndpoint extends string,
  AdapterOptions,
  MethodsType = HttpMethodsType,
> = {
  used?: boolean;
  params?: Params | NegativeTypes;
  queryParams?: QueryParams | NegativeTypes;
  data?: PayloadType<Payload>;
  headers?: HeadersInit;
  updatedAbortKey?: boolean;
  updatedCacheKey?: boolean;
  updatedQueueKey?: boolean;
  updatedEffectKey?: boolean;
} & Partial<NullableKeys<RequestOptionsType<GenericEndpoint, AdapterOptions, MethodsType>>>;

export type ParamType = string | number;
export type ParamsType = Record<string, ParamType>;

export type ExtractRouteParams<T extends string> = string extends T
  ? NegativeTypes
  : T extends `${string}:${infer Param}/${infer Rest}`
    ? { [k in Param | keyof ExtractRouteParams<Rest>]: ParamType }
    : T extends `${string}:${infer Param}`
      ? { [k in Param]: ParamType }
      : NegativeTypes;

export type FetchOptionsType<AdapterOptions> = Omit<
  Partial<RequestOptionsType<string, AdapterOptions>>,
  "endpoint" | "method"
>;

/**
 * It will check if the query params are already set
 */
export type FetchQueryParamsType<QueryParams, HasQuery extends true | false = false> = HasQuery extends true
  ? { queryParams?: NegativeTypes }
  : {
      queryParams?: QueryParams;
    };

/**
 * If the request endpoint parameters are not filled it will throw an error
 */
export type FetchParamsType<Params, HasParams extends true | false> = Params extends NegativeTypes
  ? { params?: never }
  : HasParams extends true
    ? { params?: NegativeTypes }
    : { params: Params };

/**
 * If the request data is not filled it will throw an error
 */
export type FetchPayloadType<Payload, HasData extends true | false> = Payload extends NegativeTypes
  ? { data?: NegativeTypes }
  : HasData extends true
    ? { data?: NegativeTypes }
    : { data: NonNullable<Payload> };

export type RequestQueueOptions = {
  dispatcherType?: "auto" | "fetch" | "submit";
};

// Request making

export type RequestSendOptionsType<Request extends RequestInstance> = FetchQueryParamsType<
  ExtractQueryParamsType<Request>,
  ExtractHasQueryParamsType<Request>
> &
  FetchParamsType<ExtractParamsType<Request>, ExtractHasParamsType<Request>> &
  FetchPayloadType<ExtractPayloadType<Request>, ExtractHasDataType<Request>> &
  Omit<FetchOptionsType<ExtractAdapterOptionsType<ExtractAdapterType<Request>>>, "params" | "data"> &
  FetchSendActionsType<Request> &
  RequestQueueOptions;

export type FetchSendActionsType<Request extends RequestInstance> = {
  onSettle?: (data: RequestEventType<Request>) => void;
  onRequestStart?: (data: RequestEventType<Request>) => void;
  onResponseStart?: (data: RequestEventType<Request>) => void;
  onUploadProgress?: (data: RequestProgressEventType<Request>) => void;
  onDownloadProgress?: (data: RequestProgressEventType<Request>) => void;
  onResponse?: (data: RequestResponseEventType<Request>) => void;
  onRemove?: (details: RequestEventType<Request>) => void;
};

// If no data or params provided - options should be optional. If either data or params are provided - mandatory.
export type RequestSendType<Request extends RequestInstance> =
  RequestSendOptionsType<Request>["data"] extends NegativeTypes
    ? RequestSendOptionsType<Request>["params"] extends NegativeTypes
      ? (
          options?: RequestSendOptionsType<Request>,
        ) => Promise<ResponseType<ExtractResponseType<Request>, ExtractErrorType<Request>, ExtractAdapterType<Request>>>
      : (
          options: RequestSendOptionsType<Request>,
        ) => Promise<ResponseType<ExtractResponseType<Request>, ExtractErrorType<Request>, ExtractAdapterType<Request>>>
    : (
        options: RequestSendOptionsType<Request>,
      ) => Promise<ResponseType<ExtractResponseType<Request>, ExtractErrorType<Request>, ExtractAdapterType<Request>>>;

// Instance

export type RequestInstance = Request<any, any, any, any, any, ClientInstance, any, any, any>;

export type ExtendRequest<
  Req extends RequestInstance,
  Properties extends {
    response?: any;
    payload?: any;
    queryParams?: any;
    globalError?: any;
    localError?: any;
    endpoint?: ExtractAdapterEndpointType<ExtractAdapterType<Req>>;
    client?: Client<any, any, any>;
    hasData?: true | false;
    hasParams?: true | false;
    hasQuery?: true | false;
  },
> = Request<
  TypeWithDefaults<Properties, "response", ExtractResponseType<Req>>,
  TypeWithDefaults<Properties, "payload", ExtractPayloadType<Req>>,
  TypeWithDefaults<Properties, "queryParams", ExtractQueryParamsType<Req>>,
  TypeWithDefaults<Properties, "localError", ExtractLocalErrorType<Req>>,
  Properties["endpoint"] extends string ? Properties["endpoint"] : ExtractEndpointType<Req>,
  Properties["client"] extends ClientInstance ? Properties["client"] : ExtractClientType<Req>,
  Properties["hasData"] extends true ? true : ExtractHasDataType<Req>,
  Properties["hasParams"] extends true ? true : ExtractHasParamsType<Req>,
  Properties["hasQuery"] extends true ? true : ExtractHasQueryParamsType<Req>
>;

// Mappers

export type RequestMapper<Request extends RequestInstance, NewRequest extends RequestInstance> = (
  request: Request,
  requestId: string,
) => NewRequest | Promise<NewRequest>;

export type ResponseMapper<Request extends RequestInstance, NewResponse, NewError> = (
  response: ResponseType<ExtractResponseType<Request>, ExtractErrorType<Request>, ExtractAdapterType<Request>>,
) =>
  | ResponseType<NewResponse, NewError, ExtractAdapterType<Request>>
  | Promise<ResponseType<NewResponse, NewError, ExtractAdapterType<Request>>>;
