import * as React from "react";
import { Panel } from "react-bootstrap";

interface Props {
  height: number;
  title: string;
}
export const ViewHeading = (props: Props) => {
  const { height, title } = props;
  return (
    <Panel.Heading
      style={{
        width: "100%",
        height: height,
        display: "flex",
        justifyContent: "start",
        padding: 0
      }}
    >
      <Panel.Title
        componentClass="h6"
        style={{
          marginTop: "auto",
          marginBottom: "auto",
          marginLeft: "3px",
          whiteSpace: "nowrap"
        }}
      >
        {title}
      </Panel.Title>
    </Panel.Heading>
  );
};
