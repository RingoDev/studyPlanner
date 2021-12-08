import {Redirect, Route, Switch} from "react-router-dom";
import Planner from "./components/planner/Planner";
import ProgressPage from "./components/progress/progressPage";
import React from "react";
import Navbar from "./components/navbar/navbar";
import Settings from "./components/general/settings";
import {Box} from "@mui/material";

const App = () => {

    return (
        <>
            <Navbar/>
            <Box sx={{
                height: "100%",
                background: "#4d4d4d"
            }}>
                <Switch>
                    <Route exact path="/">
                        <Redirect to="/plan"/>
                    </Route>
                    <Route path={"/progress"}>
                        <ProgressPage/>
                    </Route>
                    <Route path={"/plan"}>
                        <Planner/>
                    </Route>
                    <Route path={"/settings"}>
                        <Settings/>
                    </Route>
                </Switch>
            </Box>
        </>

    )
}
export default App
