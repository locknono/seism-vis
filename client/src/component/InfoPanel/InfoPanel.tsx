import * as React from "react";
import { connect } from "react-redux";
import { Panel } from "react-bootstrap";
import { WellCircle } from "./WellCircle";
import { ViewHeading } from "../ViewHeading";
import { CoupleWell, AllWells } from "src/ts/Type";
import SliderWithLabel from "./SliderWithLabel";
import { colorScale } from "../../constraint";
import { v4 } from "uuid";
import DataInfo from "./DataInfo";
import ParaSetting from "./ParaSetting";
import AttrWeight from "./AttrWeight";
interface Props {
  planeName: string;
  depth: number;
  coupleWell: CoupleWell;
  insideWells: AllWells;
}
const mapStateToProps = (state: any, ownProps?: any) => {
  const { planeName, depth } = state.figReducer;
  const { xStart, yStart, xEnd, yEnd } = state.globalVarReducer;
  const { coupleWell, insideWells } = state.wellReducer;
  return {
    planeName,
    depth,
    xStart,
    yStart,
    xEnd,
    yEnd,
    coupleWell,
    insideWells
  };
};

class InfoPanel extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  componentDidMount() {}
  render() {
    const { planeName, depth, coupleWell, insideWells } = this.props;
    return (
      <div className="info-panel panel panel-primary">
        <ViewHeading height={22} title={`Control Panel`} />
        <div className="panel-font">
          <DataInfo />
          <WellCircle coupleWell={coupleWell} insideWells={insideWells} />
          <ParaSetting />
          <AttrWeight />
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(InfoPanel);
