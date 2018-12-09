import * as React from "react";
import Map from "./Map";
import Matrix from "./Matrix";
import WellMatch from "./WellMatch";
import AttrDiff from "./AttrDiff";
import ControlPanel from "./ControlPanel";
import InfoPanel from "./InfoPanel/InfoPanel";
import { connect } from "react-redux";
import { AllDiff, CurSelectedIndex, AllRecords } from "src/ts/Type";
import { getCurIndex, getRecVertex } from "../action/changeWell";
const mapStateToProps = (state: any, ownProps?: any) => {
  const { allDiff, curSelectedIndex, topRecords, } = state.wellReducer;
  return { allDiff, curSelectedIndex, topRecords };
};

const mapDispatchToProps = {
  getCurIndex,
  getRecVertex
};

interface Props {
  allDiff: AllDiff;
  curSelectedIndex: CurSelectedIndex;
  getCurIndex: typeof getCurIndex;
  topRecords: AllRecords;
  getRecVertex: typeof getRecVertex;
}

const Seism = function(props: Props) {
  const {
    allDiff,
    curSelectedIndex,
    getCurIndex,
    topRecords,
    getRecVertex
  } = props;
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
            topRecords={topRecords}
            getRecVertex={getRecVertex}
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
