import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { store } from "./redux/store";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { StyledEngineProvider, ThemeProvider } from "@mui/material/styles";
import theme from "./theme";
import AppWrapper from "./AppWrapper";
import { Chart } from "chart.js";
import { centerPlugin } from "./lib/chartPlugin";

Chart.register([centerPlugin]);

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <StyledEngineProvider injectFirst>
        <Provider store={store}>
          <BrowserRouter>
            <AppWrapper />
          </BrowserRouter>
        </Provider>
      </StyledEngineProvider>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
