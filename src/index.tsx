import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {store} from './redux/store'
import {Provider} from 'react-redux'
import {BrowserRouter} from "react-router-dom";
import {StyledEngineProvider, ThemeProvider} from "@mui/material/styles";
import theme from "./theme";

ReactDOM.render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>
            <StyledEngineProvider injectFirst>
                <Provider store={store}>
                    <BrowserRouter>
                        <App/>
                    </BrowserRouter>
                </Provider>
            </StyledEngineProvider>
        </ThemeProvider>
    </React.StrictMode>,
    document.getElementById('root')
);
