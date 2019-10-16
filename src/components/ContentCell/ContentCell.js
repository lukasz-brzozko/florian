import React from 'react';
import './ContentCell.scss';

const ContentCell = props => {
    return (
        <div className={`schedule__content-cell schedule__content-cell--${props.type}`}>
            <p className="schedule__content">
                {props.children}
            </p>
        </div>);
}

export default ContentCell;