import React from "react";
import SpanError from './SpanError.jsx';

const LiInput = (obj) => {
    const props = obj.props;
    const {errorValue, isError} = props;
    
    return (
        <li id={props.name}>
            <label htmlFor={props.name}>{props.label}:</label>
            <input onChange={props.onChange} name={props.name} type={props.type} value={props.value} required/>
            {isError && <SpanError errorValue={errorValue}/>}
        </li>
    );
};

export default LiInput;