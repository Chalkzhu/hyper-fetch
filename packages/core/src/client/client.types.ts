import { RequestInstance } from "request";
import { ResponseType, AdapterType, QueryParamsType } from "adapter";
import { Client } from "client";
import type { ExtendRequest, ExtractClientAdapterType, NegativeTypes } from "types";

export type ClientErrorType = Record<string, any> | string;
export type ClientInstance = Client<any, any, any>;

export type RequestGenericType<QueryParams> = {
  response?: any;
  payload?: any;
  error?: any;
  queryParams?: QueryParams;
  endpoint?: string;
  params?: Record<string, string | number>;
};

/**
 * Configuration setup for the client
 */
export type ClientOptionsType<C extends ClientInstance> = {
  /**
   * Url to your server
   */
  url: string;
  /**
   * Custom adapter initialization prop
   */
  adapter?: AdapterType;
  /**
   * Enable dev request reference map
   */
  enableDevRequestMap?: boolean;
  /**
   * Custom cache initialization prop
   */
  cache?: (client: C) => C["cache"];
  /**
   * Custom app manager initialization prop
   */
  appManager?: (client: C) => C["appManager"];
  /**
   * Custom fetch dispatcher initialization prop
   */
  fetchDispatcher?: (client: C) => C["submitDispatcher"];
  /**
   * Custom submit dispatcher initialization prop
   */
  submitDispatcher?: (client: C) => C["fetchDispatcher"];
};

// Interceptors

export type RequestInterceptorType = (request: RequestInstance) => Promise<RequestInstance> | RequestInstance;
export type ResponseInterceptorType<Client extends ClientInstance, Response = any, Error = any> = (
  response: ResponseType<Response, Error, ExtractClientAdapterType<Client>>,
  request: ExtendRequest<
    RequestInstance,
    {
      client: Client;
    }
  >,
) =>
  | Promise<ResponseType<any, any, ExtractClientAdapterType<Client>>>
  | ResponseType<any, any, ExtractClientAdapterType<Client>>;

// Stringify

export type StringifyCallbackType = (queryParams: QueryParamsType | string | NegativeTypes) => string;

// Mapper

export type DefaultEndpointMapper<EndpointType = any> = (endpoint: EndpointType) => string;
