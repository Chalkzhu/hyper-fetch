import { Client, ClientInstance } from "client";

export type ExtractClientGlobalError<T extends ClientInstance> = T extends Client<infer P, any, any> ? P : never;
export type ExtractClientAdapterType<T extends ClientInstance> = T extends Client<any, infer P, any> ? P : never;
export type ExtractClientMapperType<T extends ClientInstance> = T extends Client<any, any, infer P> ? P : never;
