import * as React from "react";
import { connect } from "react-redux";
import { Panel } from "react-bootstrap";
import { WellCircle } from "./WellCircle";
import { ViewHeading } from "../ViewHeading";
import { CoupleWell } from "src/ts/Type";
import * as $ from "jquery";
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

  componentDidMount() {
    ($("#ex1") as any).slider({
      formatter: function(value: any) {
        return "Current value: " + value;
      }
    });
    var slider = new Slider("#ex1", {
      formatter: function(value) {
        return "Current value: " + value;
      }
    });
  }
  render() {
    const { planeName, depth, coupleWell } = this.props;
    return (
      <div className="info-panel panel panel-primary">
        <ViewHeading height={22} title={`Info`} />
        <div />
        <WellCircle coupleWell={coupleWell} />
        <div>
          <input
            id="ex1"
            data-slider-id="ex1Slider"
            type="text"
            data-slider-min="0"
            data-slider-max="20"
            data-slider-step="1"
            data-slider-value="14"
          />
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(InfoPanel);
