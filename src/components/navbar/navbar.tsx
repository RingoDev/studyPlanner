import {AppBar, Box, Button, Toolbar, Typography} from "@mui/material";
import {NavLink} from "react-router-dom";
import {Settings} from "lucide-react";
import UploadButton from "../general/uploadButton";
import React from "react";
import {styled} from "@mui/material/styles";
import PdfDownloadButton from "./pdfDownloadButton";
import DownloadButton from "./downloadButton";


const MyNavLink = styled(NavLink)(({theme}) => ({
    textDecoration: "none",
    "&.active > button": {
        backgroundColor: theme.palette.primary.light
    }
}))

const StyledToolbar = styled(Toolbar)(() => ({
    justifyContent: "space-between",
    "*": {
        color: "black"
    }
}))

const Navbar = () => {

    return (
        <AppBar position={"static"}>
            <StyledToolbar>
                <Box>
                    <MyNavLink to={"/plan"}>
                        <Button><Typography>Planung</Typography></Button>
                    </MyNavLink>
                    <MyNavLink to={"/progress"}>
                        <Button><Typography>Übersicht</Typography></Button>
                    </MyNavLink>
                </Box>
                <Box>
                    <DownloadButton/>
                    <UploadButton/>
                    <PdfDownloadButton/>
                    <MyNavLink to={"/settings"}>
                        <Button><Settings/></Button>
                    </MyNavLink>
                </Box>
            </StyledToolbar>
        </AppBar>
    )
}


export default Navbar
