import * as React from "react";
import SliderWithLabel from "./SliderWithLabel";
class ParaSetting extends React.Component {
  render() {
    return (
      <div className="panel panel-info sub-infopanel">
        <div className="panel-heading info-panel-heading">
          Parameter Setting
        </div>
        <div className="sub-panel-body" id="para-body">
          <div className="sliders">
            <SliderWithLabel
              name="KNN"
              color=""
              min={0}
              max={12}
              defaultValue={5}
              step={1}
            />
            <SliderWithLabel
              name="Rec_N"
              color=""
              min={6}
              max={20}
              defaultValue={10}
              step={1}
            />
            <SliderWithLabel
              name={"Searching Region"}
              color=""
              min={0}
              max={6}
              defaultValue={1}
              step={1}
            />
            <SliderWithLabel
              name={"Threshold"}
              color=""
              min={0}
              max={3}
              defaultValue={1}
              step={1}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default ParaSetting;
