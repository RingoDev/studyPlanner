import { Redirect, Route, Switch } from "react-router-dom";
import Planner from "./components/planner/planner";
import Progress from "./components/progress/progress";
import React, { useEffect } from "react";
import Navbar from "./components/navigation/navbar";
import Settings from "./components/settings/settings";
import { styled } from "@mui/material/styles";
import { useAppDispatch } from "./redux/hooks";
import { loadSavedCurriculum } from "./redux/data/data.actions";

const StyledApp = styled("div")(({ theme }) => ({
  overflowY: "auto",
  height: "100%",
  background: theme.palette.secondary.dark,
}));

const App = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(loadSavedCurriculum());
  });
  return (
    <>
      <Navbar />
      <StyledApp>
        <Switch>
          <Route exact path="/">
            <Redirect to="/plan" />
          </Route>
          <Route path={"/progress"}>
            <Progress />
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
};

export default App;
