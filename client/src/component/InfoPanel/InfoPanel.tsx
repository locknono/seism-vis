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
import { changeWeight } from "../../action/control";
interface Props {
  planeName: string;
  depth: number;
  coupleWell: CoupleWell;
  insideWells: AllWells;
  changeWeight: typeof changeWeight;
  weightList: number[];
}
const mapStateToProps = (state: any, ownProps?: any) => {
  const { planeName, depth } = state.figReducer;
  const { xStart, yStart, xEnd, yEnd } = state.globalVarReducer;
  const { coupleWell, insideWells } = state.wellReducer;
  const { weightList } = state.controlReducer;
  console.log("weightList: ", weightList);

  return {
    planeName,
    depth,
    xStart,
    yStart,
    xEnd,
    yEnd,
    coupleWell,
    insideWells,
    weightList
  };
};

const mapDispatchToProps = {
  changeWeight
};

class InfoPanel extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  componentDidMount() {}
  render() {
    const {
      planeName,
      depth,
      coupleWell,
      insideWells,
      changeWeight,
      weightList
    } = this.props;
    return (
      <div className="info-panel panel panel-primary">
        <ViewHeading height={22} title={`Control Panel`} />
        <div className="panel-font">
          <DataInfo />
          <WellCircle coupleWell={coupleWell} insideWells={insideWells} />
          <ParaSetting />
          <AttrWeight changeWeight={changeWeight} weightList={weightList} />
        </div>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InfoPanel);
