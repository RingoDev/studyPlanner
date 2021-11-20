import {Route, Switch} from "react-router-dom";
import Planner from "./components/planner/Planner";
import ProgressPage from "./components/progress/progressPage";
import React, {useState} from "react";
import {createStyles, makeStyles} from "@material-ui/core";
import ConfigurationModal from "./components/general/configurationModal";
import Navbar from "./navbar";

const useStyles = makeStyles(() =>
    createStyles({
        container: {
            height: "100%",
            background: "#4d4d4d"
        }
    })
)
const App = () => {

    const [showModal, setShowModal] = useState<boolean>(false)
    const classes = useStyles()

    return (
        <div className={classes.container}>
            <Navbar setShowModal={setShowModal}/>
            <ConfigurationModal open={showModal} setOpen={setShowModal}/>
            <Switch>
                <Route path={"/progress"}>
                    <ProgressPage/>
                </Route>
                <Route path={"/"}>
                    <Planner/>
                </Route>
            </Switch>
        </div>
    )
}
export default App
