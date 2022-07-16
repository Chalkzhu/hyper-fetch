import { Builder } from "@better-typed/hyper-fetch";

export const builder = new Builder({ baseUrl: "http://localhost:5000" }).setLoggerSeverity(2).setDebug(true);
