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

    if (day === 0) {
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const seconds = date.getSeconds();
      const currentTime = `${hours < 10 ? "0" + hours : hours}:${
        minutes < 10 ? "0" + minutes : minutes
      }:${seconds < 10 ? "0" + seconds : seconds}`;
      const { pointerVisible, pointerTopPosition } = this.state;

      const mass = [
        ...document.querySelectorAll(".schedule__content--mass")
      ].find(el => el.textContent > currentTime);

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
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const dayOfMonth = date.getDate();
      const massTimeMiliseconds = new Date(
        `${year}-${month}-${dayOfMonth} ${mass.textContent}:00`
      ).getTime();

      const currentTimeMiliseconds = date.getTime();
      const differTime = massTimeMiliseconds - currentTimeMiliseconds;
      console.log(new Date(currentTimeMiliseconds + differTime));

      this.interval = setTimeout(this.checkPointerPosition, differTime);
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
