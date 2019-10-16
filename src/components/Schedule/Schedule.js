import React from 'react';
import './Schedule.scss';
import ContentCell from '../ContentCell/ContentCell';
const masses = ['7:00', '9:00', '10:30', '12:00', '18:00'] //wydzielić

const Schedule = props => {
    return (
        <section className='schedule'>
            <div className="schedule__container schedule__container--mass">
                {masses.map((item, index) => <ContentCell type='mass' key={index}>{item}</ContentCell>)}
            </div>
            <div className="schedule__container schedule__container--first-week">
                {props.generateSchedule(0)}
            </div>
            <div className="schedule__container schedule__container--second-week">
                {props.generateSchedule(1)}
            </div>
            <div className="schedule__container schedule__container--third-week">
                {props.generateSchedule(2)}
            </div>
        </section>
    );
}

export default Schedule;