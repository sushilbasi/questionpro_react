import React from 'react';
import {BrowserRouter} from "react-router-dom";
import Routes from "./routes";
import {createTheme, ThemeProvider} from '@mui/material';
import './App.css';
import MyRoutes from "./routes";
import {Provider} from "react-redux";
import {store} from "./store/store";

const theme = createTheme({
    palette: {
        primary: {
            main: '#73affa', // Define your primary color
        },
        secondary: {
            main: '#ff6f61', // Define your secondary color
        },
        background: {
            default: '#f0f0f0', // Define the default background color
        },
        text: {
            primary: '#333', // Define the primary text color
        },
    },
});

function App() {
    return (
        <BrowserRouter>
            <Provider store={store}>
                <ThemeProvider theme={theme}>
                    <MyRoutes />
                </ThemeProvider>
            </Provider>
        </BrowserRouter>
    );
}

export default App;
