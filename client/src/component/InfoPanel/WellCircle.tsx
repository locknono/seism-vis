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
      <div key={e} style={{ verticalAlign: "middle" }}>
        <div className="wellCircle" key={e} />
        {`  ${e}`}
      </div>
    );
  });
  return <React.Fragment>{circles}</React.Fragment>;
};
