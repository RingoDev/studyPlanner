import React from 'react';
import {
    Container,
    createStyles,
    makeStyles,
} from "@material-ui/core";
import Curriculum from "./Curriculum";
import Storage from "./Storage";
import {DndProvider} from "react-dnd";
import {HTML5Backend} from "react-dnd-html5-backend";

const Planner = () => {

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
        })
    )

    const classes = useStyles()

    return (
        <div className="App">

            <DndProvider backend={HTML5Backend}>
                <Container className={classes.container} maxWidth={"xl"}>
                    <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                        <div style={{
                            maxHeight: "90vh",
                            height: "85vh",
                            overflowY: "auto",
                            flex: "0 1 25%",
                            backgroundColor: "#dddddd"
                        }}>
                            <Storage/>
                        </div>
                        <div style={{
                            flex: "1 1 70%",
                            maxHeight: "90vh",
                            height: "85vh",
                            overflowY: "auto",
                        }}>
                            <Curriculum/>
                        </div>
                    </div>
                </Container>
            </DndProvider>
        </div>
    );
}

export default Planner;
