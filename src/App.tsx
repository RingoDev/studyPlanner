import {Route, Switch} from "react-router-dom";
import Configuration from "./configuration";
import Planner from "./Planner";

const App = () => {
    return (
        <>
            <Switch>
                <Route path={"/configuration"}>
                    <Configuration/>
                </Route>
                <Route>
                    <Planner/>
                </Route>
            </Switch>
        </>
    )
}
export default App
