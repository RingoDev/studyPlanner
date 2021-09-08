import React from 'react';
import data from './courses.json';
import {Container} from "@material-ui/core";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import {Draggable, Droppable} from "react-beautiful-dnd";
import Course from "./types";


interface Curriculum {
    semesters: {
        number: number,
        courses: Course[]
    }[]
}

const plan: Curriculum = {
    semesters: [
        {
            number: 1,
            courses: data.sections[0].courses
        },
        {
            number: 2,
            courses: []
        },
        {
            number: 3,
            courses: []
        },
        {
            number: 4,
            courses: []
        },
        {
            number: 5,
            courses: []
        },
        {
            number: 6,
            courses: []
        },

    ]

}

// const moveMainToSemester = (mainList: typeof data, semester: typeof plan.semesters[0], id: string, index: any) => {
//
//
// }

const App = () => {


    // const [curriculum, setCurriculum] = useState<Curriculum | undefined>()

    return (
        <div className="App">
            <header className="App-header">
            </header>
            <Container>
                <div style={{display: "flex", flexDirection: "row"}}>
                    <div style={{maxHeight: "90vh", height: "90vh", overflowY: "scroll", flexBasis: "40%"}}>
                        <Droppable droppableId={"mainList"}>
                            {(provided => {
                                return (
                                    <List {...provided.droppableProps} ref={provided.innerRef}>
                                        {data.sections.map((d, index) => (
                                            <Draggable key={d.title} draggableId={d.title} index={index}>
                                                {(provided => {
                                                    return (
                                                        <ListItem
                                                            ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                                            <ListItemText
                                                                primary={d.title}
                                                            />
                                                        </ListItem>
                                                    )
                                                })}
                                            </Draggable>
                                        ))}
                                    </List>

                                )
                            })}

                        </Droppable>
                    </div>
                    <div style={{
                        display: "flex",
                        flexDirection: "row",
                        flexWrap: "wrap",
                        justifyContent: "space-evenly"
                    }}>

                        {plan.semesters.map(s => (
                            <div style={{flexBasis: "50%"}}>

                                <Droppable droppableId={"semester" + s.number}>
                                    {(provided) => {
                                        return (
                                            <div style={{padding: "1rem", height: "100%"}} {...provided.droppableProps}
                                                 ref={provided.innerRef}>
                                                <div> {s.number}</div>
                                                {s.courses.length === 0 ? "Drag Courses Here" :
                                                    <List>
                                                        {
                                                            s.courses.map((c, index) => {
                                                                return (
                                                                    <Draggable draggableId={c.title} index={index}>
                                                                        {(provided) => {
                                                                            return (
                                                                                <ListItem
                                                                                    ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                                                                    <ListItemText>
                                                                                        {c.title}
                                                                                    </ListItemText>
                                                                                </ListItem>
                                                                            )
                                                                        }}


                                                                    </Draggable>
                                                                )
                                                            })
                                                        }

                                                    </List>
                                                }
                                            </div>
                                        )
                                    }}


                                </Droppable>
                            </div>
                        ))}
                    </div>
                </div>
            </Container>
        </div>
    );
}

export default App;
