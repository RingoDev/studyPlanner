import {Link, Route, Switch} from "react-router-dom";
import Configuration from "./configuration";
import Planner from "./Planner";
import {AppBar, Toolbar} from "@material-ui/core";
import React from "react";

const App = () => {
    return (
        <>
            <div style={{
                height: "100%",
                backgroundImage: "linear-gradient(180deg,#168aad 5%,#1e6091 20%,#1e6091 60%,#168aad 95%)"
            }}>
                <Switch>
                    <Route path={"/configuration"}>
                        <Configuration/>
                    </Route>
                    <Route>
                        <Planner/>
                    </Route>
                </Switch>
            </div>
        </>
    )
}
export default App
