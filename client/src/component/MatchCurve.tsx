import * as React from "react";
import * as d3 from "d3";

interface Props {
  pathList: [number, number][];
}
interface State {
  pathGen: any;
}
class MatchCurve extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      pathGen: d3
        .line()
        .x(d => d[0])
        .y(d => d[1])
    };
  }

  onClick() {
    
  }

  render() {
    const { pathList } = this.props;
    const { pathGen } = this.state;
    const style = { fill: "grey", stroke: "none", fillOpacity: 0.8 };
    return (
      <path d={pathGen(pathList)} style={style} className="well-match-axis" />
    );
  }
}

export default MatchCurve;
