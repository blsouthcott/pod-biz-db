import React from 'react';

function Input ({ type, id, value, placeholder, onChange, onBlur, labelText, inputIsRequired }) {
    // console.log('onBlur is: ' + onBlur);
    return (

        <React.Fragment>
            <label htmlFor={ id }>{ labelText }</label>
            {/* render the input based on whether it's a required input or not */}
            {inputIsRequired === true ?
                <input
                type={ type }
                value={ value }
                placeholder={ placeholder }
                onChange={ onChange }
                onBlur={ onBlur !== undefined ? onBlur : null }
                required/>
                : <input
                    type={ type }
                    value={ value }
                    placeholder={ placeholder }
                    onChange={ onChange }
                    onBlur={ onBlur !== undefined ? onBlur : null }/>
            }
        </React.Fragment>
    )
}

export default Input;