import { BarChart2, Calendar, FileText, Menu, Settings } from "lucide-react";
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import { NavLink } from "react-router-dom";
import DownloadPDFLink from "./downloadPDFLink";
import DownloadButton from "./downloadButton";
import UploadButton from "../general/uploadButton";

const StyledNavLink = styled(NavLink)(({ theme }) => ({
  textDecoration: "none",
  "&.active > *": {
    backgroundColor: theme.palette.secondary.light,
  },
  "*": {
    color: theme.palette.primary.main,
    textTransform: "uppercase",
  },
}));

const MobileMenuButton = styled(Button)(({ theme }) => ({
  marginLeft: "auto",
  color: "black",
  [theme.breakpoints.up("md")]: {
    display: "none",
  },
}));

const StyledActionWrapper = styled("div")(({ theme }) => ({
  textDecoration: "none",
  "*": {
    textDecoration: "none",
    color: theme.palette.primary.main,
    textTransform: "upperse",
  },
}));

const MobileNavbar = () => {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  // todo this needs refactoring, very confusing -> go from links to buttons that activate links

  return (
    <>
      <MobileMenuButton onClick={() => setMenuOpen(true)}>
        <Menu />
      </MobileMenuButton>
      <Drawer
        anchor={"right"}
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
      >
        <Box
          sx={{ width: 275 }}
          role="presentation"
          onClick={() => setMenuOpen(false)}
          onKeyDown={() => setMenuOpen(false)}
        >
          <List>
            <StyledNavLink to={"/plan"}>
              <ListItem button color={"primary"}>
                <ListItemIcon>
                  <Calendar />
                </ListItemIcon>
                <ListItemText>Planung</ListItemText>
              </ListItem>
            </StyledNavLink>
            <StyledNavLink to={"/progress"}>
              <ListItem button>
                <ListItemIcon>
                  <BarChart2 />
                </ListItemIcon>
                <ListItemText>Übersicht</ListItemText>
              </ListItem>
            </StyledNavLink>
            <StyledNavLink to={"/settings"}>
              <ListItem button>
                <ListItemIcon>
                  <Settings />
                </ListItemIcon>
                <ListItemText>Einstellungen</ListItemText>
              </ListItem>
            </StyledNavLink>
          </List>
          <Divider />
          <List>
            <StyledActionWrapper>
              <DownloadButton isMobile />
            </StyledActionWrapper>
            <StyledActionWrapper>
              <UploadButton isMobile />
            </StyledActionWrapper>
            <StyledActionWrapper>
              <DownloadPDFLink
                loadingComponent={
                  <ListItem button>
                    <ListItemIcon>
                      <CircularProgress />
                    </ListItemIcon>
                    <ListItemText>Download PDF</ListItemText>
                  </ListItem>
                }
              >
                <ListItem button>
                  <ListItemIcon>
                    <FileText />
                  </ListItemIcon>
                  <ListItemText>Download PDF</ListItemText>
                </ListItem>
              </DownloadPDFLink>
            </StyledActionWrapper>
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default MobileNavbar;
