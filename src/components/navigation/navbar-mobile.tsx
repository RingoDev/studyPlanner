import { LucideProps, Menu } from "lucide-react";
import { Button, Divider, Drawer, List } from "@mui/material";
import React, { useState } from "react";
import { styled } from "@mui/material/styles";
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

interface Props {
  links: {
    to: string;
    text: string;
    Icon: (props: LucideProps) => JSX.Element;
  }[];
  actions: ((props: ButtonProps) => JSX.Element)[];
}

interface ButtonProps {
  onClose?: () => void;
}

const NavbarMobile = ({ links, actions }: Props) => {
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
          {links.map(({ to, text, Icon }) => (
            <NavLinkMobile key={to} to={to} text={text} icon={<Icon />} />
          ))}
          <Divider />
          {actions.map((Action, index) => (
            <StyledActionWrapper key={index}>
              <Action />
            </StyledActionWrapper>
          ))}
        </List>
      </Drawer>
    </>
  );
};

export default NavbarMobile;
