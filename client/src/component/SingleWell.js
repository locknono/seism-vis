import React from "react";

const SingleWell = props => {
  function handleClick(e) {
    props.getTwoCoorsID(props.id);
  }
  const { cx, cy, r, selected, isNear } = props;
  let className =
    selected === true ? "well-circle-selected well-circle" : "well-circle";
  if (isNear === true) {
    className += ` well-near`;
  }
  return (
    <circle cx={cx} cy={cy} r={r} className={className} onClick={handleClick} />
  );
};

export default SingleWell;
