import {AppBar, Button, CircularProgress, Toolbar, Typography} from "@mui/material";
import {NavLink} from "react-router-dom";
import {Download, FileText, Settings, Upload} from "lucide-react";
import UploadButton from "../general/uploadButton";
import React from "react";
import {styled} from "@mui/material/styles";
import DownloadPDFLink from "./downloadPDFLink";
import DownloadLink from "./downloadLink";
import MobileNavbar from "./mobileNavbar";


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

const StyledLinkContainer = styled("div")(({theme}) => ({
    display: "none",
    [theme.breakpoints.up("md")]: {
        display: "unset"
    }
}))


const Navbar = () => {
    return (
        <AppBar position={"static"}>
            <StyledToolbar>
                <StyledLinkContainer>
                    <MyNavLink to={"/plan"}>
                        <Button><Typography>Planung</Typography></Button>
                    </MyNavLink>
                    <MyNavLink to={"/progress"}>
                        <Button><Typography>Übersicht</Typography></Button>
                    </MyNavLink>
                </StyledLinkContainer>
                <StyledLinkContainer>
                    <DownloadLink><Button><Download/></Button></DownloadLink>
                    <UploadButton><Upload/></UploadButton>
                    <DownloadPDFLink loadingComponent={<Button><CircularProgress/></Button>}>
                        <Button><FileText/></Button>
                    </DownloadPDFLink>
                    <MyNavLink to={"/settings"}>
                        <Button><Settings/></Button>
                    </MyNavLink>
                </StyledLinkContainer>
                <MobileNavbar/>
            </StyledToolbar>
        </AppBar>
    )
}


export default Navbar
