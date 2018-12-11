import * as React from "react";
import SliderWithLabel from "./SliderWithLabel";
import { v4 } from "uuid";
import { colorScale } from "../../constraint";

interface Props {
  changeWeight: any;
  weightList: number[];
}
class AttrWeight extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    this.changeOneWeight = this.changeOneWeight.bind(this);
  }
  changeOneWeight(index: number, value: number) {
    const { weightList, changeWeight } = this.props;
    const newWeightList = [];
    for (let i = 0; i < weightList.length; i++) {
      if (i === index) newWeightList.push(value);
      else newWeightList.push(weightList[i]);
    }
    changeWeight(newWeightList);
  }
  render() {
    const sliders = ["AC", "ML2", "ML1", "COND", "SP"].map((e, i) => {
      return (
        <SliderWithLabel
          key={e}
          name={e}
          color={colorScale(i.toString())}
          min={0}
          max={1}
          step={0.01}
          index={i}
          changeOneWeight={this.changeOneWeight}
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
          <div className="sliders" id="attr-weight-sliders">
            {sliders}
          </div>
        </div>
      </div>
    );
  }
}

export default AttrWeight;
