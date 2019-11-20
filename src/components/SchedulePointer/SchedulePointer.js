import React from "react";
import "./SchedulePointer.scss";

class SchedulePointer extends React.Component {
  state = {
    pointerVisible: false,
    pointerTopPosition: 0
  };
  interval = null;

  checkPointerPosition = () => {
    const date = new Date();
    const day = date.getDay();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const currentTime = `${hours < 10 ? "0" + hours : hours}:${
      minutes < 10 ? "0" + minutes : minutes
    }:${seconds < 10 ? "0" + seconds : seconds}`;
    const { pointerVisible, pointerTopPosition } = this.state;
    if (day === 0) {
      const mass = [
        ...document.querySelectorAll(".schedule__content--mass")
      ].find(el => el.textContent > currentTime);
      // console.log(mass.textContent);
      // console.log(currentTime);
      // console.log(mass.textContent > currentTime);
      if (mass && !pointerVisible) {
        this.setState({
          pointerVisible: true,
          pointerTopPosition: mass.offsetTop
        });
      } else if (mass && pointerVisible) {
        if (mass.offsetTop !== pointerTopPosition) {
          this.setState({
            pointerTopPosition: mass.offsetTop
          });
        }
      } else {
        this.setState({
          pointerVisible: false
        });
        return;
      }
      this.interval = setTimeout(this.checkPointerPosition, 1000);
    }
  };

  componentDidMount() {
    this.checkPointerPosition();
  }

  componentWillUnmount() {
    if (this.interval) {
      clearTimeout(this.interval);
    }
  }
  render() {
    const { pointerVisible, pointerTopPosition } = this.state;
    return (
      <>
        {pointerVisible && (
          <div
            className="schedule__pointer"
            style={pointerTopPosition ? { top: `${pointerTopPosition}px` } : {}}
          ></div>
        )}
      </>
    );
  }
}

export default SchedulePointer;
