import { Redirect, Route } from "react-router-dom";
import Planner from "./components/planner/planner";
import Progress from "./components/progress/progress";
import React, { useEffect, useRef } from "react";
import Settings from "./components/settings/settings";
import { styled } from "@mui/material/styles";
import { useAppDispatch, useAppSelector } from "./redux/hooks";
import { loadSavedCurriculum } from "./redux/data/data.actions";
import Page from "./page";

const StyledApp = styled("div")(({ theme }) => ({
  overflowY: "auto",
  height: "100%",
  position: "relative",
  background: theme.palette.secondary.dark,
}));

const routes = [
  { path: "/plan", name: "Plan", Component: Planner },
  { path: "/progress", name: "Progress", Component: Progress },
  { path: "/settings", name: "Settings", Component: Settings },
];

const App = () => {
  const dataLoaded = useAppSelector((state) => state.data.dataLoaded);
  const isFirstLoad = useRef(true);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isFirstLoad.current) dispatch(loadSavedCurriculum());
    isFirstLoad.current = false;
  });

  if (dataLoaded) {
    return (
      <StyledApp>
        {routes.map(({ path, Component }) => (
          <Route key={path} exact path={path}>
            {({ match }) => {
              return <Page match={match} Component={Component} />;
            }}
          </Route>
        ))}
        <Route exact path={"/"}>
          <Redirect to={"/progress"} />
        </Route>
      </StyledApp>
    );
  }

  return <StyledApp />;
};

export default App;
