import { CSSTransition } from "react-transition-group";
import React, { useRef } from "react";
import { match } from "react-router-dom";
import { styled } from "@mui/material/styles";

interface Props {
  match: match<any> | null;
  Component: () => JSX.Element;
}

const PageWrapper = styled("div")(() => ({
  position: "absolute",
  height: "100%",
  left: 0,
  right: 0
}));


export const Page = ({ match, Component }: Props) => {

  const ref = useRef(null);

  return (<CSSTransition
    in={match != null}
    classNames="page"
    timeout={200}
    unmountOnExit
    nodeRef={ref}
  >
    <PageWrapper ref={ref}>
      <Component />
    </PageWrapper>
  </CSSTransition>);
};

export default Page;