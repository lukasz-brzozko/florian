import React from "react";
import "./LogoNavigator.scss";
import logo from "../../assets/florian_logo.png";

const LogoNavigator = (props) => {
  return (
    <aside className="logo logo__container widget">
      <p className="logo__title widget__title">Oficjalna strona parafii</p>
      <a href="https://florianbialystok.wordpress.com/" className="logo__link">
        <img className="logo__img" src={logo} alt="św. Florian" />
      </a>
    </aside>
  );
};

export default LogoNavigator;
