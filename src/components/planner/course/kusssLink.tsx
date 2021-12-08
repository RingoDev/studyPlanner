import {Link} from "@mui/material";
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import React from "react";

const useStyles = makeStyles(() =>
    createStyles({
        link: {
            color: "#000000"
        }
    }),
);

const KusssLink: React.FC<{ id: string }> = ({id, children}) => {
    const classes = useStyles()
    return (

        <>
            <Link className={classes.link} target={"_blank"} href={"https://kusss.jku.at/kusss/coursecatalogue-get-courseclasses.action?grpCode=" + id}>
                {children}
            </Link>
        </>
    )
}


export default KusssLink
