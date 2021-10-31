import {Link, Route, Switch, useLocation} from "react-router-dom";
import Planner from "./Planner";
import Progress from "./Progress";
import React, {useState} from "react";
import {AppBar, Button, createStyles, makeStyles, Toolbar} from "@material-ui/core";
import {Download, Settings} from "lucide-react";
import UploadButton from "./components/uploadButton";
import ConfigurationModal from "./components/configurationModal";
import {useAppSelector} from "./redux/hooks";
import Color from "color";

const App = () => {

    const [open, setOpen] = useState<boolean>(false)

    const curriculum = useAppSelector(state => state.data.curriculum)
    const initialConfig = useAppSelector(state => state.data.initialConfig)

    const location = useLocation()


    const useStyles = makeStyles(() =>
        createStyles({
            container: {
                padding: "2rem"
            },
            box: {
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 400,
                padding: "4rem",
                backdropFilter: "blur(20px)",
                boxShadow: "0 8px 32px 0 rgba( 31, 38, 135, 0.37 )",
                borderRadius: "1rem",
                minHeight: "50rem",
                background: "rgba( 255, 255, 255, 0.3 )",
                border: "1px solid rgba( 255, 255, 255, 0.18 )",
            },
            toolbar: {
                justifyContent: "space-between",
                backgroundColor: "#99d98c"
            }
        })
    )

    const classes = useStyles()


    const download = () => {
        const href = URL.createObjectURL(new Blob([JSON.stringify({config: initialConfig, curriculum: curriculum})]));
        const link = document.createElement('a');
        link.href = href;
        link.download = "curriculum.jku";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    return (
        <>
            <div style={{
                height: "100%",
                backgroundImage: "linear-gradient(180deg,#168aad 5%,#1e6091 20%,#1e6091 60%,#168aad 95%)"
            }}>
                <AppBar position={"static"}>
                    <Toolbar className={classes.toolbar}>
                        <div>
                            <Button style={{backgroundColor: location.pathname === "/" ? Color("#99d98c").lighten(0.2).string() : ""}}>
                                <Link style={{textDecoration: "none", color: "black"}} to={"/"}>Planung</Link>
                            </Button>
                            <Button
                                style={{backgroundColor: location.pathname === "/progress" ? Color("#99d98c").lighten(0.2).string() : ""}}>
                                <Link style={{textDecoration: "none", color: "black"}}
                                      to={"/progress"}>Übersicht</Link>
                            </Button>
                        </div>
                        <div>
                            <Button onClick={download}><Download/></Button>
                            <UploadButton/>
                            <Button onClick={() => setOpen(!open)}><Settings/></Button>
                        </div>
                    </Toolbar>
                </AppBar>
                <ConfigurationModal open={open} setOpen={setOpen}/>
                <Switch>
                    <Route path={"/progress"}>
                        <Progress/>
                    </Route>
                    <Route path={"/"}>
                        <Planner/>
                    </Route>
                </Switch>
            </div>
        </>
    )
}
export default App
