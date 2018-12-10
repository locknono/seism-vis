import * as React from "react";
import { Panel, Button } from "react-bootstrap";
import { ViewHeading } from "./ViewHeading";
import { colorScale } from "../constraint";
import { v4 } from "uuid";
interface Props {
  height: number;
  title: string;
  changeFocus: any;
}

class WithButtonViewHeading extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  handleClick() {}
  render() {
    const { height, title, changeFocus } = this.props;
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
            onClick={function() {
              changeFocus(true);
            }}
          />
          {["SP", "COND", "ML1", "ML2", "AC"].map((e, i) => {
            const margin = i === 0 ? `100px` : `10px`;
            return (
              <React.Fragment key={v4()}>
                <span
                  key={v4()}
                  style={{ float: "right", marginRight: margin }}
                >
                  {e}
                </span>
                <div
                  key={v4()}
                  className="attr-legend"
                  style={{ backgroundColor: colorScale(i.toString()) }}
                />
              </React.Fragment>
            );
          })}
          {/* <form role="form">
            <div
              className="checkbox checkbox-success heading-checkbox"
              style={{ marginRight: `50px` }}
            >
              <input id="checkbox1" type="checkbox" />
              <label htmlFor="checkbox1">{`推荐算法1     `}</label>
            </div>
          </form>
          <form role="form">
            <div className="checkbox checkbox-success heading-checkbox">
              <input id="checkbox2" type="checkbox" />
              <label htmlFor="checkbox2">{`推荐算法2     `}</label>
            </div>
          </form> */}
          {/*  <span className="oi oi-zoom-in icon-style" style={{ right: `1%` }} /> */}
        </div>
      </Panel.Heading>
    );
  }
}

export default WithButtonViewHeading;
