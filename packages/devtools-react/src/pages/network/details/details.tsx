import { useMemo } from "react";
import { Resizable } from "re-resizable";

import { DevtoolsRequestEvent } from "devtools.types";
import { Back } from "./back/back";
import { getStatus, getStatusColor, RequestStatusIcon } from "utils/request.status.utils";
import { Separator } from "components/separator/separator";
import { Button } from "components/button/button";
import { Table } from "components/table/table";
import { Toolbar } from "components/toolbar/toolbar";
import { Collapsible } from "components/collapsible/collapsible";
import { RowInfo } from "components/table/row-info/row-info";
import { Chip } from "components/chip/chip";
import { JSONViewer } from "components/json-viewer/json-viewer";

import { styles } from "../network.styles";

const nameStyle = {
  display: "flex",
  alignItems: "center",
  gap: "4px",
};

const buttonsStyle = {
  display: "flex",
  alignItems: "center",
  gap: "4px",
};

export const Details = ({ item }: { item: DevtoolsRequestEvent }) => {
  const css = styles.useStyles();

  const config = useMemo(() => {
    const values = item.request.toJSON();
    delete values.data;
    delete values.params;
    delete values.queryParams;
    delete values.headers;
    return values;
  }, [item.request]);

  const status = useMemo(() => {
    return getStatus(item);
  }, [item]);

  const color = useMemo(() => {
    return getStatusColor(status);
  }, [status]);

  return (
    <Resizable
      bounds="parent"
      defaultSize={{ width: "60%", height: "100%" }}
      maxWidth="90%"
      minWidth="200px"
      boundsByDirection
      className={css.details}
    >
      <Toolbar>
        <Back />
        <Separator style={{ height: "18px", margin: "0 12px" }} />
        <div style={{ ...nameStyle, color }}>
          <RequestStatusIcon status={status} />
          {item.request.endpoint}
        </div>
        <div style={{ flex: "1 1 auto" }} />
        <div style={{ ...buttonsStyle, color }}>
          <Button color="primary">Refetch</Button>
          <Button color="secondary">Invalidate</Button>
          <Button color="quaternary">Simulate Loading</Button>
          <Button color="tertiary">Simulate Errors</Button>
          <Button color="error">Remove</Button>
        </div>
      </Toolbar>
      <div className={css.detailsContent}>
        <div style={{ padding: "10px" }}>
          <Table>
            <RowInfo label="Request URL:" value={`${item.request.client.url}${item.request.endpoint}`} />
            <RowInfo label="Request Method:" value={String(item.request.method)} />
            <RowInfo label="Status Code:" value={item.response?.status ? String(item.response.status) : status} />
          </Table>
          {!!item.details?.retries && <Chip>Retried Request ({item.details.retries})</Chip>}
          {item.request.isMockEnabled && !!(item.request.mock || item.request.mockData) && (
            <Chip color="orange">Mocked</Chip>
          )}
        </div>
        <Collapsible title="Request">
          <div style={{ padding: "10px" }}>
            <JSONViewer data={config} sortObjectKeys />
          </div>
        </Collapsible>
        <Collapsible title="Payload">
          <div style={{ padding: "10px" }}>
            <JSONViewer
              data={{
                params: item.request.params,
                queryParams: item.request.queryParams,
                headers: item.request.headers,
                payload: item.request.data,
              }}
            />
          </div>
        </Collapsible>
        <Collapsible title="Response" initiallyExpanded>
          <div style={{ padding: "10px" }}>
            <JSONViewer data={item.response} />
          </div>
        </Collapsible>
      </div>
    </Resizable>
  );
};

// endpoint: Endpoint;
// headers?: HeadersInit;
// auth: boolean;
// method: ExtractAdapterMethodType<ExtractClientAdapterType<Client>>;
// params: ExtractRouteParams<Endpoint> | NegativeTypes;
// data: PayloadType<Payload>;
// queryParams: QueryParams | NegativeTypes;
// options?: ExtractAdapterOptionsType<ExtractClientAdapterType<Client>> | undefined;
// cancelable: boolean;
// retry: number;
// retryTime: number;
// garbageCollection: number;
// cache: boolean;
// cacheTime: number;
// queued: boolean;
// offline: boolean;
// abortKey: string;
// cacheKey: string;
// queueKey: string;
// effectKey: string;
// used: boolean;
// deduplicate: boolean;
// deduplicateTime: number;
// dataMapper?: PayloadMapperType<Payload>;
// mock?: Generator<GeneratorReturnMockTypes<Response, any>, GeneratorReturnMockTypes<Response, any>, GeneratorReturnMockTypes<Response, any>>;
// mockData?: RequestDataMockTypes<Response, any>;
// isMockEnabled: boolean;
