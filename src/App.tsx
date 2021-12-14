import { Redirect, Route, Switch } from "react-router-dom";
import Planner from "./components/planner/planner";
import ProgressPage from "./components/progress/progressPage";
import React from "react";
import Navbar from "./components/navbar/navbar";
import Settings from "./components/general/settings";
import { styled } from "@mui/material/styles";

const StyledApp = styled("div")(({ theme }) => ({
  height: "100%",
  background: theme.palette.secondary.dark,
}));

const App = () => (
  <>
    <Navbar />
    <StyledApp>
      <Switch>
        <Route exact path="/">
          <Redirect to="/plan" />
        </Route>
        <Route path={"/progress"}>
          <ProgressPage />
        </Route>
        <Route path={"/plan"}>
          <Planner />
        </Route>
        <Route path={"/settings"}>
          <Settings />
        </Route>
      </Switch>
    </StyledApp>
  </>
);

export default App;
