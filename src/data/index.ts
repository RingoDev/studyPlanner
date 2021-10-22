import semesterConstraints from './semesterConstraints.json'
import steopConstraints from './steopConstraints.json'
import dependencyConstraints from './dependencyConstraints.json'
import xOutOfYConstraints from './xOutOfYConstraints.json'
import groups from './groups.json'
import courses from './courses.json'
import competencies from './competencies.json'



const initialConfig = {
    competencies: competencies,
    groups:groups,
    courses: courses,
    constraints:{
        semesterConstraints:semesterConstraints,
        steopConstraints:steopConstraints,
        dependencyConstraints:dependencyConstraints,
        xOutOfYConstraints:xOutOfYConstraints
    }
}
export default initialConfig