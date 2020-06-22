import React from "react";
import "./_Label.scss";

const Label = (props) => {
  const { title, mobileText, desktopText, type } = props;

  return (
    <div className={`label label--${type}`} title={title}>
      <span
        className={`label__text label__text--${type}`}
        data-mobile={mobileText}
        data-desktop={desktopText}
      ></span>
    </div>
  );
};

export default Label;
