import React from 'react';
import './ScheduleWidget.scss';

const ScheduleWidget = props => {

    const { isDataReady, isDataFetchingError, data } = props;

    return (
        <section className='schedule'>
            <div className="schedule__container schedule__container--mass">
                {isDataReady && props.generateMassSchedule(data)}
            </div>
            <div className="schedule__container ">
                {isDataReady && props.generateTimetable(data)}
            </div>
        </section>
    );
}

export default ScheduleWidget;