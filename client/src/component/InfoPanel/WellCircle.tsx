import * as React from "react";

export const WellCircle = (props: any) => {
  const { coupleWell } = props;
  let circles = coupleWell.map((e: string) => {
    //TODO:CHANGE FONT STYLE
    return (
      <div style={{ verticalAlign: "middle" }}>
        <div className="wellCircle" key={e} />
        {`  ${e}`}
      </div>
    );
  });
  return <React.Fragment>{circles}</React.Fragment>;
};
