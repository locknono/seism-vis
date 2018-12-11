import * as React from "react";
import SliderWithLabel from "./SliderWithLabel";
import { v4 } from "uuid";
import { colorScale } from "../../constraint";
class AttrWeight extends React.Component {
  render() {
    const sliders = ["AC", "ML2", "ML1", "COND", "SP"].map((e, i) => {
      return (
        <SliderWithLabel
          key={v4()}
          name={e}
          color={colorScale(i.toString())}
          min={0}
          max={1}
          defaultValue={0.2}
          step={0.01}
        />
      );
    });
    return (
      <div
        className="panel panel-info attr-control-panel sub-infopanel"
        style={{ height: `205px` }}
      >
        <div
          className="panel-heading info-panel-heading"
          style={{ paddingRight: 0, whiteSpace: `nowrap` }}
        >
          Attribute Weights
        </div>
        <div className="sub-panel-body">
          <div className="sliders" id='attr-weight-sliders'>{sliders}</div>
        </div>
      </div>
    );
  }
}

export default AttrWeight;
