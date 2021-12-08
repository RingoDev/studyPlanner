import {Download} from "lucide-react";
import {Button} from "@mui/material";
import React from "react";
import {useAppSelector} from "../../redux/hooks";

const DownloadButton = () => {

    const curriculum = useAppSelector(state => state.data.curriculum)
    const initialConfig = useAppSelector(state => state.data.initialConfig)

    const download = () => {
        const href = URL.createObjectURL(new Blob([JSON.stringify({config: initialConfig, curriculum: curriculum})]));
        const link = document.createElement('a');
        link.href = href;
        link.download = "curriculum.jku";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    return <Button onClick={download}><Download/></Button>
}

export default DownloadButton
