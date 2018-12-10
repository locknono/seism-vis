import * as React from "react";
import { connect } from "react-redux";
import { Panel } from "react-bootstrap";
import { WellCircle } from "./WellCircle";
import { ViewHeading } from "../ViewHeading";
import { CoupleWell } from "src/ts/Type";
import SliderWithLabel from "./SliderWithLabel";
import { colorScale } from "../../constraint";
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
      return <SliderWithLabel name={e} color={colorScale(i.toString())} />;
    });
    return (
      <div className="info-panel panel panel-primary">
        <ViewHeading height={22} title={`Info`} />
        <div />
        <WellCircle coupleWell={coupleWell} />
        <div className="panel panel-primary attr-control-panel">
          <ViewHeading height={22} title={`untitled`} />
          {sliders}
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(InfoPanel);
