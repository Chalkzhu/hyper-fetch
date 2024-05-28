import { Stack } from "@mui/material";
import * as ReactDOM from "react-dom/client";
import { SnackbarProvider } from "notistack";

import { routing } from "./constants/routing.constants";
import DashboardPage from "./pages/index";

const { Route } = routing;

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <SnackbarProvider
    maxSnack={6}
    autoHideDuration={1000}
    anchorOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
  >
    <Stack direction="row">
      <Route to="Dashboard" children={<DashboardPage />} />
      <Route to="Details" />
      <Route to="List" />
      <Route to="Form" />
      <Route to="Websockets" />
    </Stack>
  </SnackbarProvider>,
);
