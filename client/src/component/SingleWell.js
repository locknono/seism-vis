import React, { Component } from "react";

const SingleWell = props => {
  function handleClick(e) {
    props.getTwoCoorsID(props.id);
  }
  const { cx, cy, r, selected, id } = props;
  const className =
    selected === true ? "well-circle-selected well-circle" : "well-circle";
  return (
    <circle cx={cx} cy={cy} r={r} className={className} onClick={handleClick} />
  );
};

export default SingleWell;
