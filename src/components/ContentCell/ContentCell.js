import React from 'react';
import './ContentCell.scss';

const ContentCell = props => {
    const { modifier, children } = props;
    return (
        <div className={`schedule__content-cell${modifier ? ' schedule__content-cell--' + modifier : ''
            }`}>
            <p className="schedule__content">
                {children}
            </p>
        </div>);
}

export default ContentCell;