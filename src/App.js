import React from 'react';
import ScheduleWidget from './components/ScheduleWidget/ScheduleWidget';
import ContentCell from './components/ContentCell/ContentCell';
import ClassifiedsWidget from './components/ClassifiedsWidget/ClassifiedsWidget';
import ClassifiedItem from './components/ClassifiedItem/ClassifiedItem';
import { DB } from './common/dbConstants';
const axios = require('axios').default;

class App extends React.Component {
    state = {
        dataReady: false,
        classifiedsReady: false,
        isDataFetchingError: false,
        data: {},
        classifieds: {}
    }

    getScheduleData = () => {
        axios.get(DB.URL_REST)
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
        axios.get('/ogloszenia')
            .then(res => res.data)
            .then(result => this.setState({
                classifiedsReady: true,
                classifieds: result
            }))

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

    generateClassifiedsList = (posts) =>
        (
            <ul className='classifieds__list'>
                {
                    posts.map((el, index) => (
                        <ClassifiedItem key={index}>{el}</ClassifiedItem>
                    ))
                }
            </ul >

        );




    componentDidMount() { //do testowania
        this.getScheduleData()
        this.getClassifieds()
    }
    render() {
        const { generateTimetable, generateMassSchedule, generateClassifiedsList, state } = this;
        const { data, classifieds, dataReady, classifiedsReady, isDataFetchingError } = state;
        return (
            <>
                <header className='topbar'>
                    <div className="topbar__container">
                        <p className="topbar__date">Data</p>
                    </div>
                </header>
                <ScheduleWidget
                    generateTimetable={generateTimetable}
                    generateMassSchedule={generateMassSchedule}
                    data={data}
                    isDataReady={dataReady}
                    isDataFetchingError={isDataFetchingError}
                />
                <ClassifiedsWidget
                    classifieds={classifieds}
                    areClassifiedsReady={classifiedsReady}
                    generateClassifiedsList={generateClassifiedsList} />
            </>
        );
    }
}

export default App;