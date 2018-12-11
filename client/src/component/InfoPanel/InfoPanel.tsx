import * as React from "react";
import { connect } from "react-redux";
import { Panel } from "react-bootstrap";
import { WellCircle } from "./WellCircle";
import { ViewHeading } from "../ViewHeading";
import { CoupleWell } from "src/ts/Type";
import SliderWithLabel from "./SliderWithLabel";
import { colorScale } from "../../constraint";
import { v4 } from "uuid";
import DataInfo from "./DataInfo";
import ParaSetting from "./ParaSetting";
interface Props {
  planeName: string;
  depth: number;
  coupleWell: CoupleWell;
}
const mapStateToProps = (state: any, ownProps?: any) => {
  const { planeName, depth } = state.figReducer;
  const { xStart, yStart, xEnd, yEnd } = state.globalVarReducer;
  const { coupleWell } = state.wellReducer;
  return { planeName, depth, xStart, yStart, xEnd, yEnd, coupleWell };
};

class InfoPanel extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  componentDidMount() {}
  render() {
    const { planeName, depth, coupleWell } = this.props;
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
      <div className="info-panel panel panel-primary">
        <ViewHeading height={22} title={`Control Panel`} />
        <div className="panel-font">
          <DataInfo />
          <WellCircle coupleWell={coupleWell} />
          <ParaSetting />
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
              <div className="sliders">{sliders}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(InfoPanel);
