import React from 'react';
import './Schedule.scss';

const Schedule = props => {
    const { generateMassSchedule, generateTimetable, activeVariantId } = props;
    return (
        <section className='schedule'>
            <div className="schedule__container schedule__container--mass">
                {generateMassSchedule()}
            </div>
            <div className="schedule__container ">
                {generateTimetable(activeVariantId)}
            </div>
        </section>
    );
}

export default Schedule;