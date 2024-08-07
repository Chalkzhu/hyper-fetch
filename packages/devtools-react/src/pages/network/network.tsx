import { useMemo, useState } from "react";

import { Content } from "./content/content";
import { Toolbar } from "./toolbar/toolbar";
import { NetworkProvider } from "./network.context";
import { useDevtoolsContext } from "devtools.context";
import { Details } from "./details/details";

export const Network = () => {
  const { requests } = useDevtoolsContext("DevtoolsNetworkContent");

  const [requestId, setRequestId] = useState<string | null>(null);

  const activatedRequest = useMemo(() => {
    if (!requestId) return null;
    return requests.find((request) => request.requestId === requestId);
  }, [requestId, requests]);

  return (
    <NetworkProvider requestId={requestId} setRequestId={setRequestId}>
      {activatedRequest && <Details request={activatedRequest} />}
      {!activatedRequest && (
        <div style={{ flex: "1 1 auto" }}>
          <Toolbar />
          <Content />
        </div>
      )}
    </NetworkProvider>
  );
};
