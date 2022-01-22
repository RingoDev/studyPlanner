import React, { useMemo } from "react";

interface Props {
  Component: () => JSX.Element;
}

// this wrapper component only exists for performance reasons to stop unnecessary re-rendering
export const WrappedPageComponent = ({ Component }: Props) => {
  return useMemo(() => <Component />, []);
};

export default WrappedPageComponent;
