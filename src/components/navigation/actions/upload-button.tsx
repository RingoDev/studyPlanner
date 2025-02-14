import { ListItem, ListItemIcon, ListItemText } from "@mui/material";
import React, { ChangeEvent, useRef } from "react";
import { useAppDispatch } from "../../../redux/hooks";
import { CurriculumType } from "../../../types/types";
import initialConfig from "../../../data";
import {
  setApplicationState,
  setUploadedCurriculum,
} from "../../../redux/data/data.actions";
import { SavedCurriculum, SavedCurriculumV3 } from "../../../lib/storeAndLoad";
import { Upload } from "lucide-react";

interface Props {
  onClose?: () => void;
}

const UploadButton = ({ onClose }: Props) => {
  const dispatch = useAppDispatch();
  const ref = useRef<HTMLInputElement>(null);

  const openFileSelector = () => {
    ref.current?.click();
  };

  const handleChange = (ev: ChangeEvent<HTMLInputElement>) => {
    if (ev.target.files === null || ev.target.files.length < 1) return;
    ev.target.files[0]
      .text()
      .then((file) => {
        parseCurriculum(file);
        //  reset file input
        ev.target.value = "";
        if (onClose) {
          onClose();
        }
      })
      .catch((reason) =>
        console.error(`Couldn't upload file due to ${reason}`)
      );
  };

  const parseCurriculum = (filesContent?: string) => {
    if (filesContent === undefined) return;
    console.log(filesContent);
    const upload = JSON.parse(filesContent);
    if ("version" in upload) {
      // console.log(`setting curriculum with version: ${upload.version}`);
      switch (upload.version) {
        case "0.0.1": {
          dispatch(
            setApplicationState(
              upload as {
                config: typeof initialConfig;
                curriculum: CurriculumType;
              }
            )
          );
          break;
        }
        case "0.0.2": {
          dispatch(
            setUploadedCurriculum({
              curriculum: {
                ...(upload as SavedCurriculum),
                version: "0.0.3",
                startSemester: { isWS: true, year: 2020 },
              },
            })
          );
          break;
        }
        case "0.0.3": {
          dispatch(
            setUploadedCurriculum({ curriculum: upload as SavedCurriculumV3 })
          );
          break;
        }
        default:
          console.log(
            `not supported version for uploaded curriculum: ${upload.version}`
          );
      }
    }
  };

  return (
    <>
      <input
        ref={ref}
        type={"file"}
        accept={".jku"}
        onClick={console.log}
        onChange={handleChange}
        style={{ display: "none" }}
      />
      <ListItem button onClick={openFileSelector}>
        <ListItemIcon>
          <Upload />
        </ListItemIcon>
        <ListItemText>Upload</ListItemText>
      </ListItem>
    </>
  );
};

export default UploadButton;
