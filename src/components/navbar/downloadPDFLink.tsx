import { PDFDownloadLink } from "@react-pdf/renderer";
import PdfDocument from "../pdf/main";
import React, { ReactElement } from "react";
import { useAppSelector } from "../../redux/hooks";

interface Props {
  loadingComponent?: ReactElement;
}

const DownloadPDFLink: React.FC<Props> = ({ loadingComponent, children }) => {
  const startSemesterIndex = useAppSelector(
    (state) => state.data.startSemesterIndex
  );
  const curriculum = useAppSelector((state) => state.data.curriculum);

  return (
    <PDFDownloadLink
      fileName={"plan.pdf"}
      document={
        <PdfDocument
          startSemesterIndex={startSemesterIndex}
          curriculum={curriculum}
        />
      }
    >
      {({ loading }) =>
        loading && loadingComponent !== undefined ? (
          <>{loadingComponent}</>
        ) : (
          <>{children}</>
        )
      }
    </PDFDownloadLink>
  );
};

export default DownloadPDFLink;
