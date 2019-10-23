import React from 'react';
import Schedule from './components/Schedule/Schedule';
import ContentCell from './components/ContentCell/ContentCell';

const axios = require('axios').default;

class App extends React.Component {
    state = {
        dataReady: false,
        isDataFetchingError: false,
        data: {}
    }

    getScheduleData = () => {
        axios.get('https://florian-8cd60.firebaseio.com/data.json')
            .then(response => response.data)
            .then(data => {
                this.setState({
                    dataReady: true,
                    data
                })
                console.log(data)
                return data;
            })
            .catch(err => {
                this.setState({
                    isDataFetchingError: true,
                })
                console.log(err);
                setTimeout(this.getScheduleData, 10000)
            })
    }

    getClassifieds = () => {
        axios.get('/classfields').then(res => console.log(res.data))

    }
    // createAllTimetableVariants = () => {
    //     generateTimetable(timetableWeeks.FIRSTWEEK, 'first-week')
    //     generateTimetable(timetableWeeks.SECONDWEEK, 'second-week')
    //     generateTimetable(timetableWeeks.THIRDWEEK, 'third-week')
    // }

    generateMassSchedule = data => {
        const { masses } = data;
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

    generateTimetable = (data, modifierName = "") => {
        const { masses, people, activeVariantId } = data;
        let counter = 0;
        const array = [];

        for (let i = activeVariantId; i < masses.length + activeVariantId; i++) {
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
    componentDidMount() {
        this.getScheduleData()
        this.getClassifieds()
    }
    render() {
        const { generateTimetable, generateMassSchedule, state } = this;
        const { data, dataReady, isDataFetchingError } = state;
        return (
            <>
                <header className='topbar'>
                    <div className="topbar__container">
                        <p className="topbar__date">Data</p>
                    </div>
                </header>
                <Schedule
                    generateTimetable={generateTimetable}
                    generateMassSchedule={generateMassSchedule}
                    data={data}
                    isDataReady={dataReady}
                    isDataFetchingError={isDataFetchingError}
                />
            </>
        );
    }
}

export default App;