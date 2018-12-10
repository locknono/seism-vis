import Slider from "rc-slider";
import * as React from "react";
import "rc-slider/assets/index.css";

interface Props {
  name: string;
  color: string;
}
interface State {
  value: number;
}
class SliderWithLabel extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { value: 0.2 };
    this.handleSlide = this.handleSlide.bind(this);
  }

  handleSlide(e: number) {
    this.setState({ value: e });
  }
  render() {
    const { name, color } = this.props;
    const { value } = this.state;
    return (
      <div>
        <span className="slider-text">{name}</span>
        <span className="slider-value-text">{value.toFixed(2)}</span>
        <div className="slider-div">
          <Slider
            min={0}
            max={1}
            step={0.01}
            defaultValue={0.2}
            value={value}
            onChange={this.handleSlide}
            trackStyle={{ backgroundColor: color }}
            handleStyle={{ borderColor: color, borderRadius: `25%` }}
          />
        </div>
      </div>
    );
  }
}

export default SliderWithLabel;
