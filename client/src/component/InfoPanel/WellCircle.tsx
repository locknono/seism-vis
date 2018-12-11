import * as React from "react";
import { CoupleWell, AllWells } from "src/ts/Type";

interface Props {
  coupleWell: CoupleWell;
  insideWells: AllWells;
}
export const WellCircle = (props: Props) => {
  const { coupleWell, insideWells } = props;
  let circles = coupleWell.map((e, i: number) => {
    //TODO:CHANGE FONT STYLE
    return (
      <div key={e} style={{ display: "flex" }}>
        <div className="well-circle-container ">
          <div className="wellCircle well-circle-selected" key={e} />
          {`  ${e}`}
        </div>
      </div>
    );
  });
  let insideCircles = insideWells.map((e, i: number) => {
    return (
      <div key={e.id} style={{ display: "flex" }}>
        <div className="well-circle-container">
          <div className="wellCircle" key={e.id} />
          {`  ${e.id}`}
        </div>
      </div>
    );
  });
  return (
    <div className="panel panel-info info-well-circle-div sub-infopanel">
      <div className="panel-heading info-panel-heading">Well_IDs</div>
      <div
        className="sub-panel-body"
        style={{ maxHeight: `160px`, overflow: "auto" }}
      >
        {circles}
        {insideCircles}
      </div>
    </div>
  );
};
