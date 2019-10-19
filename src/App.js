import React from 'react';
import Schedule from './components/Schedule/Schedule';
import ContentCell from './components/ContentCell/ContentCell';

const axios = require('axios');
const db = {
    activeVariantId: 0,
    masses: [
        {
            id: 1,
            time: '7:00'
        },
        {
            id: 2,
            time: '9:00'
        },
        {
            id: 3,
            time: '10:30'
        },
        {
            id: 4,
            time: '12:00'
        },
        {
            id: 5,
            time: '18:00'
        }
    ],
    people: [
        {
            id: 1,
            name: 'Proboszcz'
        },
        {
            id: 2,
            name: 'Robert'
        },
        {
            id: 3,
            name: 'Radek'
        }
    ]
}
const { masses, people } = db;

class App extends React.Component {
    state = {
        dataReady: false
    }

    getData = () => {
        axios.get('/data')
            .then(response => {
                // handle success
                this.setState({
                    dataReady: true
                })
                console.log(response);
                return response;
            })
    }
    // createAllTimetableVariants = () => {
    //     generateTimetable(timetableWeeks.FIRSTWEEK, 'first-week')
    //     generateTimetable(timetableWeeks.SECONDWEEK, 'second-week')
    //     generateTimetable(timetableWeeks.THIRDWEEK, 'third-week')
    // }

    generateMassSchedule = () => {
        const array = masses.map((item, index) => (
            <ContentCell
                modifier='mass'
                key={index}
            >
                {item.time}
            </ContentCell>)
        )
        return array;
    }

    generateTimetable = (offset, modifierName = "") => {
        let counter = 0;
        const array = [];
        for (let i = offset; i < masses.length + offset; i++) {
            if (!people[i]) {

                if (!people[counter]) { counter = 0 }

                array.push(
                    <ContentCell
                        key={i}
                        modifier={modifierName}
                    >
                        {people[counter++].name}
                    </ContentCell>)
                continue;
            }
            array.push(
                <ContentCell
                    key={i}
                    modifier={modifierName}
                >
                    {people[i].name}
                </ContentCell>)
        }
        return array;
    }

    render() {
        return (
            <>
                <header className='topbar'>
                    <div className="topbar__container">
                        <p className="topbar__date">Data</p>
                    </div>
                </header>
                <Schedule
                    generateTimetable={this.generateTimetable}
                    generateMassSchedule={this.generateMassSchedule}
                    activeVariantId={db.activeVariantId}
                />
            </>
        );
    }
}

export default App;