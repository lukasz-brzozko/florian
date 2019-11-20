import React from "react";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import "./Spinner.scss";
class Spinner extends React.Component {
  render() {
    const { dimensions } = this.props;

    return (
      <div className="spinner">
        <Loader
          type="Oval"
          color="#555"
          height={dimensions}
          width={dimensions}
        />
      </div>
    );
  }
}
export default Spinner;
