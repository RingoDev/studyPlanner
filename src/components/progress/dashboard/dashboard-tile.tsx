import { styled } from "@mui/material/styles";
import React from "react";
import { Typography } from "@mui/material";

interface Props {
  Component: (props: { semesterIndex?: number }) => JSX.Element;
  semesterIndex?: number;
  title: string;
}

const CardWrapper = styled("div")(() => ({
  padding: "0 1rem 2rem 1rem",
}));

const Card = styled("div")(({ theme }) => ({
  aspectRatio: "1",
  backgroundColor: theme.palette.secondary.light,
  padding: "2rem",
  borderRadius: "1rem",
}));

const DashboardTile: React.FC<Props> = ({
  semesterIndex,
  title,
  Component,
}: Props) => {
  return (
    <CardWrapper>
      <Card>
        <Typography align={"center"} fontWeight={"bold"}>
          {title}
        </Typography>
        <Component semesterIndex={semesterIndex} />
      </Card>
    </CardWrapper>
  );
};

export default DashboardTile;
