import {PDFDownloadLink} from "@react-pdf/renderer";
import PdfDocument from "../pdf/main";
import {Button, CircularProgress} from "@mui/material";
import {FileText} from "lucide-react";
import React from "react";
import {useAppSelector} from "../../redux/hooks";

const PdfDownloadButton = () => {
    const startSemesterIndex = useAppSelector((state) => (state.data.startSemesterIndex))
    const curriculum = useAppSelector(state => state.data.curriculum)

    return (<PDFDownloadLink fileName={"plan.pdf"}
                             document={<PdfDocument startSemesterIndex={startSemesterIndex} curriculum={curriculum}/>}>
        {({loading}) => (loading
                ? <Button> <CircularProgress/></Button>
                : <Button> <FileText/></Button>
        )}
    </PDFDownloadLink>)
}

export default PdfDownloadButton
