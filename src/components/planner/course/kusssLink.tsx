import {Link} from "@mui/material";
import React from "react";

const KusssLink: React.FC<{ id: string }> = ({id, children}) => (
    <Link target={"_blank"}
          href={"https://kusss.jku.at/kusss/coursecatalogue-get-courseclasses.action?grpCode=" + id}
          color={"text.primary"}>
        {children}
    </Link>
)

export default KusssLink
