import {createTheme} from '@mui/material/styles';


// A custom theme for this app
const theme = createTheme({
    palette: {
        primary: {
            main: '#99d98c',
        },
        secondary: {
            light: "#dddddd",
            main: '#bbbbbb',
            dark: "#4d4d4d"
        }
    },
});

export default theme;
