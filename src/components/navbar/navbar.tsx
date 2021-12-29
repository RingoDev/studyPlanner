import {
  AppBar,
  Button,
  CircularProgress,
  Toolbar,
  Typography,
} from "@mui/material";
import { NavLink } from "react-router-dom";
import { Download, FileText, Settings, Upload } from "lucide-react";
import UploadButton from "../general/uploadButton";
import React from "react";
import { styled } from "@mui/material/styles";
import DownloadPDFLink from "./downloadPDFLink";
import DownloadLink from "./downloadLink";
import MobileNavbar from "./mobileNavbar";
import Search from "./search";
import PlanningProgress from "./planningProgress";

const MyNavLink = styled(NavLink)(({ theme }) => ({
  textDecoration: "none",
  "&.active > button": {
    backgroundColor: theme.palette.primary.light,
  },
}));

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  justifyContent: "space-between",

  [theme.breakpoints.up("md")]: {
    height: "80px",
  },
  "*": {
    color: "black",
  },
}));

const ActionContainer = styled("div")(({ theme }) => ({
  display: "none",
  [theme.breakpoints.up("md")]: {
    display: "unset",
  },
}));

const StyledSearchContainer = styled(ActionContainer)(({ theme }) => ({
  minWidth: "30rem",
}));

const StyledAppbar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.light,
}));

const Navbar = () => {
  return (
    <StyledAppbar position={"static"}>
      <StyledToolbar>
        <ActionContainer>
          <MyNavLink to={"/plan"}>
            <Button>
              <Typography>Planung</Typography>
            </Button>
          </MyNavLink>
          <MyNavLink to={"/progress"}>
            <Button>
              <Typography>Übersicht</Typography>
            </Button>
          </MyNavLink>
        </ActionContainer>
        <StyledSearchContainer>
          <Search />
        </StyledSearchContainer>
        <ActionContainer>
          <PlanningProgress />
        </ActionContainer>
        <ActionContainer>
          <DownloadLink>
            <Button>
              <Download />
            </Button>
          </DownloadLink>
          <UploadButton>
            <Upload />
          </UploadButton>
          <DownloadPDFLink
            loadingComponent={
              <Button>
                <CircularProgress />
              </Button>
            }
          >
            <Button>
              <FileText />
            </Button>
          </DownloadPDFLink>
          <MyNavLink to={"/settings"}>
            <Button>
              <Settings />
            </Button>
          </MyNavLink>
        </ActionContainer>
        <MobileNavbar />
      </StyledToolbar>
    </StyledAppbar>
  );
};

export default Navbar;
