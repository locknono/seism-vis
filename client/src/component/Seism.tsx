import * as React from "react";
import Map from "./Map";
import Matrix from "./Matrix";
import WellMatch from "./WellMatch";
import AttrDiff from "./AttrDiff";
import ControlPanel from "./ControlPanel";
import InfoPanel from "./InfoPanel/InfoPanel";
import { connect } from "react-redux";
import { AllDiff, CurSelectedIndex } from "src/ts/Type";
import { getCurIndex } from "../action/changeWell";
const mapStateToProps = (state: any, ownProps?: any) => {
  const { allDiff, curSelectedIndex } = state.wellReducer;
  return { allDiff, curSelectedIndex };
};

const mapDispatchToProps = {
  getCurIndex
};

interface Props {
  allDiff: AllDiff;
  curSelectedIndex: CurSelectedIndex;
  getCurIndex: typeof getCurIndex;
}

const Seism = function(props: Props) {
  const { allDiff, curSelectedIndex, getCurIndex } = props;
  return (
    <React.Fragment>
      <div className="seism">
        <InfoPanel />
        <Map />
        <div className="right-side">
          <WellMatch />
          <AttrDiff
            allDiff={allDiff}
            curSelectedIndex={curSelectedIndex}
            getCurIndex={getCurIndex}
          />
        </div>
      </div>
    </React.Fragment>
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Seism);
