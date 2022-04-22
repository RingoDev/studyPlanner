import { Link, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

const SettingsContainer = styled("div")(({ theme }) => ({
  marginTop: "2rem",
  backgroundColor: "#333333",
  padding: "2rem",

  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "flex-start",
  "> div": {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "2rem",
  },
  "> div > *": {
    padding: "0.25rem",
  },

  [theme.breakpoints.up("md")]: {
    "> div": {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      padding: 0,
    },
    borderRadius: "1rem",
    "> div > *": {
      padding: "0.5rem",
    },
  },
}));

export const About = () => {
  return (
    <SettingsContainer>
      <Typography color={"primary"}>
        Diese Anwendung wurde von {" "}
        <Link href={"https://ringodev.com"} target={"_blank"}>
          Thomas Grininger
        </Link>{" "}
        im Zuge einer Bachelorarbeit unter der Leitung der Assoz. Univ.-Prof.
        <sup>in</sup> Iris Groher entwickelt.
      </Typography>
    </SettingsContainer>
  );
};
