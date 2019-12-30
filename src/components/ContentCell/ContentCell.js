import React from "react";
import "./_ContentCell.scss";

const ContentCell = props => {
  const { modifier, children } = props;
  return (
    <span
      className={`schedule__content${
        modifier ? " schedule__content--" + modifier : ""
      }`}
    >
      {children}
    </span>
  );
};

export default ContentCell;
