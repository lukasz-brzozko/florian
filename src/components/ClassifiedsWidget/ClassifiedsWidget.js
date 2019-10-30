import React from 'react';
import './ClassifiedsWidget.scss';

const ClassifiedsWidget = props => {
    const { areClassifiedsReady, classifieds, generateClassifiedsList } = props;
    return (
        <section className='classifieds'>

            {areClassifiedsReady && generateClassifiedsList(classifieds)}


        </section>



    );
}

export default ClassifiedsWidget;