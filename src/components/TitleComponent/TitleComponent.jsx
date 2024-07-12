import React from 'react';
import './TitleComponent.css';

const TitleComponent = ({ text }) => {
    return (
        <div className="title-component">
            <h1>{text}</h1>
        </div>
    );
};

export default TitleComponent;