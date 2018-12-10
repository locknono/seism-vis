import Slider, { Range } from "rc-slider";

import * as React from "react";

class Sliders extends React.Component {
  render() {
    return (
      <div>
        {["AC,ML2,ML1,COND,SP"].map(e => (
          <div>
            <Slider />
          </div>
        ))}
      </div>
    );
  }
}

export default Sliders;
