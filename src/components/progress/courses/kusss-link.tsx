import { Link } from "@mui/material";
import React from "react";
import { styled } from "@mui/material/styles";

const StyledLink = styled(Link)(() => ({
  textDecoration: "none",
  "&:hover": {
    textDecoration: "underline",
  },
}));

const KusssLink: React.FC<{ id: string }> = ({ id, children }) => (
  <StyledLink
    target={"_blank"}
    href={`https://kusss.jku.at/kusss/coursecatalogue-get-courseclasses.action?grpCode=${id}`}
    color={"text.primary"}
  >
    {children}
  </StyledLink>
);

export default KusssLink;
