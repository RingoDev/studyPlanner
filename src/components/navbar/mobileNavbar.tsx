import {
  BarChart2,
  Calendar,
  Download,
  FileText,
  Menu,
  Settings,
  Upload,
} from "lucide-react";
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
import { NavLink, Redirect } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { useFilePicker } from "use-file-picker";
import { CurriculumType } from "../../types/types";
import { setApplicationState } from "../../redux/data/data.actions";
import DownloadPDFLink from "./downloadPDFLink";
import DownloadLink from "./downloadLink";

const MyNavLink = styled(NavLink)(({ theme }) => ({
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

const StyledLinkWrapper = styled("a")(({ theme }) => ({
  textDecoration: "none",
  "&.active > *": {
    backgroundColor: theme.palette.secondary.light,
  },
  "*": {
    textDecoration: "none",
    color: theme.palette.primary.main,
    textTransform: "uppercase",
  },
}));

const MobileNavbar = () => {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  const initialConfig = useAppSelector((state) => state.data.initialConfig);
  const dispatch = useAppDispatch();

  const [openFileSelector, { filesContent, clear }] = useFilePicker({
    accept: ".jku",
  });

  if (filesContent !== undefined) {
    filesContent.forEach((file) => {
      clear();
      const upload = JSON.parse(file.content) as {
        config: typeof initialConfig;
        curriculum: CurriculumType;
      };
      dispatch(setApplicationState(upload));
      return <Redirect to={"/plan"} />;
    });
  }

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
            <MyNavLink to={"/plan"}>
              <ListItem button color={"primary"}>
                <ListItemIcon>
                  <Calendar />
                </ListItemIcon>
                <ListItemText>Planung</ListItemText>
              </ListItem>
            </MyNavLink>
            <MyNavLink to={"/progress"}>
              <ListItem button>
                <ListItemIcon>
                  <BarChart2 />
                </ListItemIcon>
                <ListItemText>Übersicht</ListItemText>
              </ListItem>
            </MyNavLink>
            <MyNavLink to={"/settings"}>
              <ListItem button>
                <ListItemIcon>
                  <Settings />
                </ListItemIcon>
                <ListItemText>Einstellungen</ListItemText>
              </ListItem>
            </MyNavLink>
          </List>
          <Divider />
          <List>
            <StyledLinkWrapper>
              <DownloadLink>
                <ListItem button>
                  <ListItemIcon>
                    <Download />
                  </ListItemIcon>
                  <ListItemText>Export</ListItemText>
                </ListItem>
              </DownloadLink>
            </StyledLinkWrapper>
            <StyledLinkWrapper>
              <ListItem button onClick={openFileSelector}>
                <ListItemIcon>
                  <Upload />
                </ListItemIcon>
                <ListItemText>Import</ListItemText>
              </ListItem>
            </StyledLinkWrapper>
            <StyledLinkWrapper>
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
            </StyledLinkWrapper>
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default MobileNavbar;
