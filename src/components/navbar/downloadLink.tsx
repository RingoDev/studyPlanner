import React from "react";
import {useAppSelector} from "../../redux/hooks";

const DownloadLink: React.FC = ({children}) => {

    const curriculum = useAppSelector(state => state.data.curriculum)
    const initialConfig = useAppSelector(state => state.data.initialConfig)

    return <a download={"curriculum.jku"} href={URL.createObjectURL(new Blob([JSON.stringify({
        config: initialConfig,
        curriculum: curriculum
    })]))}>
        {children}
    </a>
}

export default DownloadLink
