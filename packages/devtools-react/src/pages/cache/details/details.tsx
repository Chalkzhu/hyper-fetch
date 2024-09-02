import { useMemo, useState } from "react";
import { Resizable } from "re-resizable";
import { TrashIcon, FileXIcon, TriangleAlert, LoaderIcon } from "lucide-react";
import { CacheValueType } from "@hyper-fetch/core";

import { DevtoolsCacheEvent } from "devtools.types";
import { Back } from "./back/back";
import { Separator } from "components/separator/separator";
import { Button } from "components/button/button";
import { Toolbar } from "components/toolbar/toolbar";
import { JSONViewer } from "components/json-viewer/json-viewer";
import { useDevtoolsContext } from "devtools.context";
import { Collapsible } from "components/collapsible/collapsible";
import * as Table from "components/table/table";
import { RowInfo } from "components/table/row-info/row-info";
import { Countdown } from "components/countdown/countdown";
import { Chip } from "components/chip/chip";
import { Key } from "components/key/key";

import { styles } from "../list/cache.styles";

export const CacheDetails = ({ item }: { item: DevtoolsCacheEvent }) => {
  const css = styles.useStyles();

  const [stale, setStale] = useState(item.cacheData.responseTimestamp + item.cacheData.cacheTime < Date.now());

  const { client, requests, inProgress, loadingKeys, setLoadingKeys, simulatedError } =
    useDevtoolsContext("DevtoolsCacheDetails");

  const hasInProgressRequest = inProgress.some((i) => i.cacheKey === item.cacheKey);
  const isLoading = loadingKeys.includes(item.cacheKey);

  const elements = useMemo(() => {
    const {
      data,
      error,
      extra,
      responseTimestamp,
      success,
      status,
      retries,
      isCanceled,
      isOffline,
      ...additionalData
    } = item.cacheData;

    return {
      data: { data, error, extra, status, timestamp: responseTimestamp, success, retries, isCanceled, isOffline },
      additionalData,
    };
  }, [item]);

  const latestItem = useMemo(() => {
    const element = requests.find((el) => el.request.cacheKey === item.cacheKey);
    if (!element)
      return {
        request: {
          cacheKey: item.cacheKey,
        } as any,
        requestId: "",
      };
    return element;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item.cacheKey, requests?.length]);

  const onChangeData = (newData: any) => {
    const data = { ...item.cacheData, ...newData };
    client.cache.storage.set<any, any, any>(item.cacheKey, data);
    client.cache.lazyStorage?.set<any, any, any>(item.cacheKey, data);
    client.cache.events.emitCacheData<any, any, any>(item.cacheKey, data);
  };

  const invalidate = () => {
    client.cache.invalidate(item.cacheKey);
  };

  const remove = () => {
    client.cache.delete(item.cacheKey);
  };

  const toggleLoading = () => {
    if (!hasInProgressRequest) {
      setLoadingKeys((prev) => {
        if (prev.includes(item.cacheKey)) {
          client.requestManager.events.emitLoading({
            loading: false,
            isOffline: false,
            isRetry: false,
            request: latestItem?.request,
            requestId: latestItem.requestId,
          });
          return prev.filter((i) => i !== item.cacheKey);
        }
        client.requestManager.events.emitLoading({
          loading: true,
          isOffline: false,
          isRetry: false,
          request: latestItem.request,
          requestId: latestItem.requestId,
        });
        return [...prev, item.cacheKey];
      });
    }
  };

  const error = () => {
    const data: CacheValueType<unknown, unknown, any> = {
      ...item.cacheData,
      data: null,
      error: simulatedError,
      responseTimestamp: Date.now(),
      extra: client.defaultExtra,
      success: false,
    };
    client.cache.storage.set(item.cacheKey, data);
    client.cache.events.emitCacheData(item.cacheKey, data);
  };

  return (
    <Resizable
      bounds="parent"
      defaultSize={{ width: "60%", height: "100%" }}
      maxWidth="90%"
      minWidth="200px"
      boundsByDirection
      className={css.details}
    >
      <Toolbar style={{ borderBottom: "0px", flexWrap: "nowrap" }}>
        <Back />
        <Separator style={{ height: "18px", margin: "0 4px 0 0" }} />
        <Key value={item.cacheKey} type="cache" />
        <Chip color={stale ? "orange" : "green"}>{stale ? "Stale" : "Fresh"}</Chip>
        {item.cacheData.hydrated && <Chip color="green">Hydrated</Chip>}
        <div style={{ flex: "1 1 auto" }} />
      </Toolbar>
      <div className={css.detailsContent}>
        <Collapsible title="General" defaultOpen>
          <div style={{ padding: "10px" }}>
            <Table.Root>
              <Table.Body>
                <RowInfo
                  label="Last updated:"
                  value={`${new Date(item.cacheData.responseTimestamp).toLocaleDateString()}, ${new Date(item.cacheData.responseTimestamp).toLocaleTimeString()}`}
                />
                <RowInfo
                  label="Time left before stale:"
                  value={
                    <Countdown
                      value={item.cacheData.responseTimestamp + item.cacheData.cacheTime}
                      onDone={() => setStale(true)}
                      onStart={() => setStale(false)}
                      doneText={<Chip color="gray">Cache data is stale</Chip>}
                    />
                  }
                />
                <RowInfo
                  label="Time left for garbage collection:"
                  value={
                    <Countdown
                      value={item.cacheData.responseTimestamp + item.cacheData.garbageCollection}
                      doneText={<Chip color="gray">Data removed from cache</Chip>}
                    />
                  }
                />
              </Table.Body>
            </Table.Root>
          </div>
        </Collapsible>
        <Collapsible title="Actions" defaultOpen>
          <div className={css.buttons}>
            <Button color={isLoading ? "teal" : "blue"} onClick={toggleLoading} disabled={hasInProgressRequest}>
              <LoaderIcon />
              {isLoading ? "Restore" : "Set"} loading
            </Button>
            <Button color="red" onClick={error}>
              <TriangleAlert />
              Simulate Error
            </Button>
            <Button color="pink" onClick={invalidate}>
              <FileXIcon />
              Invalidate
            </Button>
            <Button color="gray" onClick={remove}>
              <TrashIcon />
              Remove
            </Button>
          </div>
        </Collapsible>
        <Collapsible title="Config" defaultOpen>
          <div style={{ padding: "10px" }}>
            <JSONViewer data={elements.additionalData} onChange={onChangeData} sortObjectKeys />
          </div>
        </Collapsible>
        <Collapsible title="Cache" defaultOpen>
          <div style={{ padding: "10px" }}>
            <JSONViewer data={elements.data} onChange={onChangeData} />
          </div>
        </Collapsible>
      </div>
    </Resizable>
  );
};
