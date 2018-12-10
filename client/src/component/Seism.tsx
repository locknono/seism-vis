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
  const {
    allDiff,
    curSelectedIndex,
    topRecords,
    sameLayerFlags
  } = state.wellReducer;
  const { focusFlag } = state.controlReducer;

  return { allDiff, curSelectedIndex, topRecords, sameLayerFlags, focusFlag };
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
  sameLayerFlags: boolean[];
  focusFlag: boolean;
}

const Seism = function(props: Props) {
  const {
    allDiff,
    curSelectedIndex,
    getCurIndex,
    topRecords,
    getRecVertex,
    sameLayerFlags,
    focusFlag
  } = props;
  return (
    <React.Fragment>
      <div className="seism">
        <InfoPanel />
        <Map />
        {focusFlag === false ? (
          <div className="right-side">
            <WellMatch />
            <AttrDiff
              allDiff={allDiff}
              curSelectedIndex={curSelectedIndex}
              getCurIndex={getCurIndex}
              topRecords={topRecords}
              getRecVertex={getRecVertex}
              sameLayerFlags={sameLayerFlags}
              focusFlag={focusFlag}
            />
          </div>
        ) : null}
      </div>
      {focusFlag === true ? (
        <div className="focus-div">
          <WellMatch />
          <AttrDiff
            allDiff={allDiff}
            curSelectedIndex={curSelectedIndex}
            getCurIndex={getCurIndex}
            topRecords={topRecords}
            getRecVertex={getRecVertex}
            sameLayerFlags={sameLayerFlags}
            focusFlag={focusFlag}
          />
        </div>
      ) : null}
    </React.Fragment>
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Seism);
