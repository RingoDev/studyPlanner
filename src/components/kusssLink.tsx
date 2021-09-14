import {Link} from "@material-ui/core";
import React from "react";

const KusssLink: React.FC<{ id: string }> = ({id, children}) => {
    return (

        <>
            <Link target={"_blank"} href={"https://kusss.jku.at/kusss/coursecatalogue-get-courseclasses.action?grpCode=" + id}>
                {children}
            </Link>
        </>
    )
}


export default KusssLink