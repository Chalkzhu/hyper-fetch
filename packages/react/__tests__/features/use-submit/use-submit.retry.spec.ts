import { act, waitFor } from "@testing-library/react";

import { startServer, resetInterceptors, stopServer, createRequestInterceptor } from "../../server";
import { client, createRequest, renderUseSubmit, waitForRender } from "../../utils";

describe("useSubmit [ Retry ]", () => {
  let request = createRequest<null, null>({ method: "POST" });

  beforeAll(() => {
    startServer();
  });

  afterEach(() => {
    resetInterceptors();
  });

  afterAll(() => {
    stopServer();
  });

  beforeEach(() => {
    jest.resetModules();
    client.clear();
    request = createRequest({ method: "POST" });
  });

  describe("when request retry attribute is set to false", () => {
    it("should not retry request on failure", async () => {
      const spy = jest.fn();
      createRequestInterceptor(request, { status: 400, delay: 5 });
      const response = renderUseSubmit(request.setRetry(0).setRetryTime(0));

      act(() => {
        response.result.current.onSubmitRequestStart(spy);
        response.result.current.submit();
      });

      await waitForRender(150);

      expect(spy).toHaveBeenCalledTimes(1);
    });
  });
  describe("when request retry attribute is set to true", () => {
    it("should retry request once", async () => {
      const spy = jest.fn();
      createRequestInterceptor(request, { status: 400, delay: 5 });
      const response = renderUseSubmit(request.setRetry(1).setRetryTime(10));

      act(() => {
        response.result.current.onSubmitRequestStart(spy);
        response.result.current.submit();
      });

      await waitForRender(150);

      expect(spy).toHaveBeenCalledTimes(2);
    });
    it("should retry request twice", async () => {
      const spy = jest.fn();
      createRequestInterceptor(request, { status: 400, delay: 5 });
      const response = renderUseSubmit(request.setRetry(2).setRetryTime(10));

      act(() => {
        response.result.current.onSubmitRequestStart(spy);
        response.result.current.submit();
      });

      await waitForRender(150);

      expect(spy).toHaveBeenCalledTimes(3);
    });
    it("should trigger retries with the config interval", async () => {
      const time: number[] = [];
      createRequestInterceptor(request, { status: 400, delay: 0 });
      const response = renderUseSubmit(request.setRetry(1).setRetryTime(100));

      act(() => {
        response.result.current.onSubmitRequestStart(() => {
          time.push(+new Date());
        });
        response.result.current.submit();
      });

      await waitFor(() => {
        expect(time[1] - time[0]);
        expect(time[1] - time[0]).toBeGreaterThan(99);
      });
    });
  });
});
