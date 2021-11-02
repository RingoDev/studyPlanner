import React, {useRef} from 'react';
import {
    Container,
    createStyles,
    makeStyles,
} from "@material-ui/core";
import {Chart, Doughnut} from "react-chartjs-2";
import {useAppSelector} from "./redux/hooks";
import {ChartData} from "chart.js";
import Course, {Competency} from "./types/types";
import Color from "color";
import {getCoursesFromGroups} from "./data";

const Progress = () => {

    // const curriculumCourses = useAppSelector(state => state.data.curriculum.semesters).flatMap(s => s.courses)
    // const storage = useAppSelector(state => state.data.storage)
    const initialConfig = useAppSelector(state => state.data.initialConfig)

    const chartRef = useRef<Chart<"doughnut", number[], string>>(null)

    const useStyles = makeStyles(() =>
        createStyles({
            container: {
                padding: "2rem",
                height: "100%"
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

    const generateCompetencies = (): Competency[] => {

        const result: Competency[] = []

        for (let competency of initialConfig.competencies) {

            const groupIds = competency.groups;
            // resolve groups to courses

            const groups = groupIds.map(id => {
                const index = initialConfig.groups.findIndex(group => group.id === id)
                return initialConfig.groups[index]
            })

            let allCoursesEcts = 0;
            let finishedCoursesEcts = 0;

            for (let group of groups) {

                const allCourses: Course[] = getCoursesFromGroups([group])
                //     .map(c => {
                //     const index = curriculumCourses.findIndex(course => course.id === c.id)
                //     if (index !== -1) return curriculumCourses[index]
                //     else return {...storage[storage.findIndex(course => course.id === c.id)], ects: 0}
                // })

                // if a x out of y constraint exists, use it to set the max ects of the competency
                const constraint = initialConfig.constraints.xOutOfYConstraints.find(c => c.group === group.id)
                if (constraint !== undefined) {
                    allCoursesEcts += constraint.maxEcts
                } else {
                    allCoursesEcts += allCourses.map(c => c.ects).reduce((x1, x2) => x1 + x2, 0)
                }

                finishedCoursesEcts += allCourses.filter(c => c.finished).map(c => c.ects).reduce((x1, x2) => x1 + x2, 0)

                // courses.push(...group.courses.map(id => {
                //     const index = storage.findIndex(course => course.id === id)
                //     if (index !== -1) return storage[index]
                //     else return curriculumCourses[curriculumCourses.findIndex(course => course.id === id)]
                // }))
            }


            result.push({
                ...competency,
                allCoursesEcts: allCoursesEcts,
                finishedCoursesEcts: finishedCoursesEcts,
                color: new Color<string>(competency.color, "hex")
            })
        }
        return result
    }

    const generateData = (): ChartData<"doughnut", number[], string> => {
        const labels: string[] = []
        const data = []
        const backgroundColor: string[] = []
        const borderColor: string[] = []
        const hoverBackgroundColor: string[] = []
        const hoverBorderColor: string[] = []

        for (let competency of generateCompetencies()) {

            const doneValue = Math.min(competency.finishedCoursesEcts, competency.allCoursesEcts)
            const notDoneValue = Math.max(competency.allCoursesEcts - competency.finishedCoursesEcts, 0)

            if (doneValue !== 0) {
                labels.push(competency.title)
                data.push(doneValue)
                backgroundColor.push(competency.color.string())
                borderColor.push(competency.color.string())
                hoverBackgroundColor.push(competency.color.darken(0.4).string())
                hoverBorderColor.push(competency.color.darken(0.4).string())
            }

            if (notDoneValue !== 0) {
                labels.push(competency.title + " - offen")
                data.push(notDoneValue)
                backgroundColor.push(competency.color.alpha(0.5).string() || "rgba(0, 0, 0, 0.5)")
                borderColor.push(competency.color.string() || "rgba(0, 0, 0, 0.5)")
                hoverBackgroundColor.push(competency.color.alpha(0.5).darken(0.4).string())
                hoverBorderColor.push(competency.color.darken(0.4).string())
            }

            if (notDoneValue !== 0 || doneValue !== 0) {
                labels.push("")
                data.push(1)
                backgroundColor.push("rgba(0, 0, 0, 0)")
                borderColor.push("rgba(0, 0, 0, 0)")
                hoverBackgroundColor.push("rgba(0, 0, 0, 0)")
                hoverBorderColor.push("rgba(0, 0, 0, 0)")
            }
        }


        labels.push("Fehlende Kurse")

        const gaps = data.filter(x => x === 1).length
        data.push(180 - (data.reduce((x1, x2) => x1 + x2, 0) - gaps))
        backgroundColor.push("rgba(0, 0, 0, 0)")
        borderColor.push("rgba(0, 0, 0, 0)")
        hoverBackgroundColor.push("rgba(0, 0, 0, 0)")
        hoverBorderColor.push("rgba(0, 0, 0, 0)")

        labels.push("")
        data.push(1)
        backgroundColor.push("rgba(0, 0, 0, 0)")
        borderColor.push("rgba(0, 0, 0, 0)")
        hoverBackgroundColor.push("rgba(0, 0, 0, 0)")
        hoverBorderColor.push("rgba(0, 0, 0, 0)")

        // add custom ects competency
        // labels.push("Freie Studienleistungen")
        // labels.push("offene Freie Studienleistungen")
        // labels.push("")
        //
        // data.push(customEcts)
        // data.push(9 - customEcts)
        // data.push(1)
        //
        // backgroundColor.push("rgba(0, 0, 0, 1)")
        // backgroundColor.push("rgba(0, 0, 0, 0.5)")
        // backgroundColor.push("rgba(0, 0, 0, 0)")
        //
        // borderColor.push("rgba(0, 0, 0, 1)")
        // borderColor.push("rgba(0, 0, 0, 0.5)")
        // borderColor.push("rgba(0, 0, 0, 0)")


        return {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: backgroundColor,
                borderColor: borderColor,
                hoverBackgroundColor: hoverBackgroundColor,
                hoverBorderColor: hoverBorderColor
            }]
        }
    }

    return (
        <div className="App">
            <Container className={classes.container} maxWidth={"xl"}>
                <div style={{position: "relative", height: "50vh"}}>
                    <Doughnut ref={chartRef} options={{
                        maintainAspectRatio: false,
                        cutout: "50%",
                        plugins: {
                            legend: {
                                position: "left",

                                labels: {
                                    font: {size: 24},
                                    color: "black",
                                    filter: (legendItem) => {
                                        if (legendItem.text === "Fehlende Kurse") return false
                                        return legendItem.text !== ""
                                    }
                                }
                            },
                            tooltip: {filter: (tooltip) => tooltip.label !== ""}
                        }
                    }} data={generateData}/>
                </div>
            </Container>
        </div>
    );
}

export default Progress;
