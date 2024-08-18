/* eslint-disable react/no-array-index-key */
import { useMemo } from "react";

import { useDevtoolsContext } from "devtools.context";
import { Request } from "./request/request";
import { Table } from "components/table/table";
import { NoContent } from "components/no-content/no-content";
import { Status } from "utils/request.status.utils";
import { PathsOf, useSearch } from "hooks/use-search";
import { Label } from "components/table/label/label";
import { DevtoolsRequestEvent } from "devtools.types";

import { styles } from "../network.styles";

export const Content = () => {
  const { client, requests, networkFilter, networkSearchTerm, networkSort, setNetworkSort } =
    useDevtoolsContext("DevtoolsNetworkContent");
  const css = styles.useStyles();

  const data = useMemo(() => {
    if (!networkFilter) return requests;
    switch (networkFilter) {
      case Status.SUCCESS:
        return requests.filter((item) => item.isSuccess);
      case Status.FAILED:
        return requests.filter((item) => item.isFinished && !item.isCanceled && !item.isSuccess);
      case Status.IN_PROGRESS:
        return requests.filter((item) => !item.isFinished);
      case Status.PAUSED:
        return requests.filter((item) => item.isPaused);
      case Status.CANCELED:
        return requests.filter((item) => item.isCanceled);
      default:
        return requests;
    }
  }, [requests, networkFilter]);

  const handleSort = (key: PathsOf<DevtoolsRequestEvent>) => {
    return (sort: "asc" | "desc" | null) => {
      const sorting = sort ? { key, order: sort } : null;
      setNetworkSort(sorting);
    };
  };

  const handleGetSort = (key: PathsOf<DevtoolsRequestEvent>) => {
    if (!networkSort) return null;
    if (networkSort.key === key) return networkSort.order;
    return null;
  };

  const { items } = useSearch({
    data,
    searchKeys: [
      "request.endpoint",
      "request.method",
      "request.queueKey",
      "request.cacheKey",
      "request.abortKey",
      "request.effectKey",
    ],
    searchTerm: networkSearchTerm,
    baseSort: networkSort
      ? (a, b) => {
          const { key, order } = networkSort;

          const path = key.split(".");

          const valueA = path.reduce((acc, k) => (acc as any)[k as any], a.item);
          const valueB = path.reduce((acc, k) => (acc as any)[k as any], b.item);

          if (valueA === valueB) return 0;
          if (order === "asc") return valueA > valueB ? 1 : -1;
          return valueA < valueB ? 1 : -1;
        }
      : undefined,
    dependencies: [networkSort],
  });

  if (!items.length) {
    return <NoContent text="Make some request to see them here!" />;
  }

  return (
    <Table>
      <thead style={{ opacity: !requests.length ? 0.4 : 1 }}>
        <tr>
          <Label sort={handleGetSort("request.endpoint")} onSort={handleSort("request.endpoint")}>
            Endpoint
          </Label>
          {typeof client.defaultMethod === "string" && (
            <Label sort={handleGetSort("request.method")} onSort={handleSort("request.method")}>
              Method
            </Label>
          )}
          <Label sort={handleGetSort("response.success")} onSort={handleSort("response.success")}>
            Success
          </Label>
          <Label sort={handleGetSort("triggerTimestamp")} onSort={handleSort("triggerTimestamp")}>
            Timestamp
          </Label>
        </tr>
      </thead>
      <tbody className={css.tbody}>
        {items.map((item, index) => {
          return <Request key={index} item={item} />;
        })}
      </tbody>
    </Table>
  );
};
