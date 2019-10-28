import React from 'react';

const ClassifiedsWidget = props => {
    const { areClassifiedsReady, classifieds, generateClassifiedsList } = props;
    return (
        <section className='classifieds'>

            {areClassifiedsReady && generateClassifiedsList(classifieds)}


        </section>



    );
}

export default ClassifiedsWidget;