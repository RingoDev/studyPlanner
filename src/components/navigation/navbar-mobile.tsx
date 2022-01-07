import { BarChart2, Calendar, Menu, Settings } from "lucide-react";
import { Button, Divider, Drawer, List } from "@mui/material";
import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import DownloadButton from "./actions/download-button";
import UploadButton from "./actions/upload-button";
import PdfDownloadButton from "./actions/pdf-download-button";
import DeleteButton from "./actions/delete-button";
import NavLinkMobile from "./nav-link-mobile";

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
    color: "#000000",
    textTransform: "uppercase",
  },
  "& svg": {
    color: theme.palette.primary.main,
    stroke: theme.palette.primary.main,
  },
}));

const NavbarMobile = () => {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

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
        <List
          sx={{ width: 275 }}
          role="presentation"
          onClick={() => setMenuOpen(false)}
          onKeyDown={() => setMenuOpen(false)}
        >
          <NavLinkMobile to={"/plan"} text={"Planung"} icon={<Calendar />} />
          <NavLinkMobile
            to={"/progress"}
            text={"Übersicht"}
            icon={<BarChart2 />}
          />
          <NavLinkMobile
            to={"/settings"}
            text={"Einstellungen"}
            icon={<Settings />}
          />
          <Divider />
          <StyledActionWrapper>
            <DeleteButton />
          </StyledActionWrapper>

          <StyledActionWrapper>
            <DownloadButton />
          </StyledActionWrapper>

          <StyledActionWrapper>
            <UploadButton />
          </StyledActionWrapper>

          <StyledActionWrapper>
            <PdfDownloadButton />
          </StyledActionWrapper>
        </List>
      </Drawer>
    </>
  );
};

export default NavbarMobile;
