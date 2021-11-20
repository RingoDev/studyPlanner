import {AppBar, Button, createStyles, makeStyles, Toolbar} from "@material-ui/core";
import Color from "color";
import {Link, useLocation} from "react-router-dom";
import {Download, Settings} from "lucide-react";
import UploadButton from "./components/general/uploadButton";
import React from "react";
import {useAppSelector} from "./redux/hooks";

const useStyles = makeStyles(() =>
    createStyles({
        toolbar: {
            justifyContent: "space-between",
            backgroundColor: "#99d98c"
        }
    })
)

interface Props {
    setShowModal: (open: boolean) => void
}

const Navbar = ({setShowModal}: Props) => {

    const location = useLocation()


    const curriculum = useAppSelector(state => state.data.curriculum)
    const initialConfig = useAppSelector(state => state.data.initialConfig)

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
        <AppBar position={"static"}>
            <Toolbar className={classes.toolbar}>
                <div>
                    <Button
                        style={{backgroundColor: location.pathname === "/" ? Color("#99d98c").lighten(0.2).string() : ""}}>
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
                    <Button onClick={() => setShowModal(true)}><Settings/></Button>
                </div>
            </Toolbar>
        </AppBar>
    )
}


export default Navbar
