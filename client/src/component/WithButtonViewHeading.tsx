import * as React from "react";
import { Panel, Button } from "react-bootstrap";
import { ViewHeading } from "./ViewHeading";

interface Props {
  height: number;
  title: string;
}
const WithButtonViewHeading = (props: Props) => {
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
          marginLeft: "3px"
        }}
      >
        {title}
      </Panel.Title>
      <div className="button-div">
        <span
          className=" oi oi-fullscreen-enter icon-style"
          style={{ right: `1%` }}
        />
        {/*  <span className="oi oi-zoom-in icon-style" style={{ right: `1%` }} /> */}
      </div>
    </Panel.Heading>
  );
};

export default WithButtonViewHeading;
