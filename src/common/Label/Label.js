import React from "react";
import "./_Label.scss";

const Label = props => {
  const { title, mobileText, desktopText } = props;

  return (
    <div className="label" title={title}>
      <span
        className="label__text"
        data-mobile={mobileText}
        data-desktop={desktopText}
      ></span>
    </div>
  );
};

export default Label;
