import React from 'react';
import './App.css';
import Schedule from './components/Schedule/Schedule';
import ContentCell from './components/ContentCell/ContentCell';

const masses = ['7:00', '9:00', '10:30', '12:00', '18:00'] //wydzielić
const people = ['Proboszcz', 'Robert', 'Radek']


class App extends React.Component {
    state = {}

    generateSchedule = offset => {
        let counter = 0;
        const array = [];
        for (let i = offset; i < masses.length + offset; i++) {
            if (!people[i]) {

                if (!people[counter]) { counter = 0 }

                array.push(<ContentCell type='mass' key={i}>{people[counter++]}</ContentCell>)
                continue;
            }
            array.push(<ContentCell type='mass' key={i}>{people[i]}</ContentCell>)
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
                <Schedule generateSchedule={this.generateSchedule} />
            </>
        );
    }
}

export default App;