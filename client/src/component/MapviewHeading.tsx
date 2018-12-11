import * as React from "react";
import { Panel, Button } from "react-bootstrap";
import { ViewHeading } from "./ViewHeading";
import { colorScale } from "../constraint";
import { v4 } from "uuid";
interface Props {
  height: number;
  title: string;
}

class MapviewHeading extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }
  handleClick() {}
  render() {
    const { height, title } = this.props;
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
            whiteSpace: `nowrap`
          }}
        >
          {title}
        </Panel.Title>
        <div className="input-group" style={{ maxHeight: `22px` }} />
      </Panel.Heading>
    );
  }
}

export default MapviewHeading;
