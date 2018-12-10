import * as React from "react";
import { CoupleWell } from "src/ts/Type";

interface Props {
  coupleWell: CoupleWell;
}
export const WellCircle = (props: Props) => {
  const { coupleWell } = props;
  let circles = coupleWell.map((e, i: number) => {
    //TODO:CHANGE FONT STYLE
    return (
      <div key={e} style={{ display: "flex" }}>
        <div style={{ marginRight: 0, margin: `auto` }}>
          <div className="wellCircle" key={e} />
          {`  ${e}`}
        </div>
      </div>
    );
  });
  return (
    <div className="panel panel-default info-well-circle-div">{circles}</div>
  );
};
