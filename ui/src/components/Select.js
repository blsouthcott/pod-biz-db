import React from "react";
import Option from "./Option";

export default function Select ({ id, value, multiple, onChange, options, labelText, inputIsRequired }) {
    
    function renderSelect(multiple, required) {
        // selects render based on whether multiple selections are allowed and if the input is required
        if (multiple === true && required === true) {
            return <select id={ id } value={ value } onChange={ onChange } multiple required>
                    { options.map((option, i) => <Option value={option.value} text={option.text} key={i}/>)}
                    </select>
        } else if (multiple === true) {
            return <select id={ id } value={ value } onChange={ onChange } multiple>
                    { options.map((option, i) => <Option value={option.value} text={option.text} key={i}/>)}
                    </select>
        } else if (required === true) {
            return <select id={ id } value={ value } onChange={ onChange } required>
                    { options.map((option, i) => <Option value={option.value} text={option.text} key={i}/>)}
                    </select>
        } else {
            return <select id={ id } value={ value } onChange={ onChange } >
                    { options.map((option, i) => <Option value={option.value} text={option.text} key={i}/>)}
                    </select>
        }
    }
    
    return (
        <React.Fragment>
            <label htmlFor={ id }>{ labelText }</label>
            { renderSelect(multiple, inputIsRequired )}       
        </React.Fragment>
    )
}
