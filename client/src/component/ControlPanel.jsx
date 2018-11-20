import * as React from "react";
import { Button } from "react-bootstrap";

interface Props {}
class ControlPanel extends React.Component<Props> {
  render() {
    return (
      <div className="panel panel-default">
        <Button />
      </div>
    );
  }
}

export default ControlPanel;
