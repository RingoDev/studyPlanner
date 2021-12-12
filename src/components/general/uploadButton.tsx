import {Button} from "@mui/material";
import React from "react";
import {useFilePicker} from "use-file-picker";
import {useAppDispatch} from "../../redux/hooks";
import {setApplicationState} from "../../redux/data/data.actions";
import initialConfig from "../../data";
import {CurriculumType} from "../../types/types";

const UploadButton: React.FC = ({children}) => {

    const dispatch = useAppDispatch()

    const [openFileSelector, {filesContent, clear}] = useFilePicker({
        accept: '.jku',
    });


    if (filesContent !== undefined) {
        filesContent.forEach(file => {
            clear()
            const upload = JSON.parse(file.content) as { config: typeof initialConfig, curriculum: CurriculumType }
            dispatch(setApplicationState(upload))
        })
    }

    return <Button onClick={openFileSelector}>{children}</Button>
}

export default UploadButton
