import React from 'react';
import Input from './Input';
import Select from './Select';

// export default function Form ({ title, inputs, onSubmit }) {
export default function Form ({ title, inputs, onSubmit }) {
    // console.log('trying to render form for: ' + title);
    return (
        <div className='form'>
            <p><strong>{ title }</strong></p>
            <form onSubmit={ onSubmit }>
                <fieldset>
                    {inputs.map(
                        (input, i) => 
                            // render inputs for the form based on whether they're selects or otherwise
                            input.type !== 'select' ? 
                                <Input type={input.type} id={ input.id } value={input.value} placeholder={input.placeholder} onChange={input.onChange} onBlur={input.onBlur} labelText={ input.labelText } inputIsRequired={ input.inputIsRequired } key={i}/> 
                                : <Select value={input.value} id={ input.id } multiple={ input.multiple } onChange={input.onChange} options={input.options} labelText={ input.labelText } inputIsRequired={ input.inputIsRequired } key={i}/>
                        )
                    }
                </fieldset>
                {/* <button onClick={ buttonOnClick }>{ buttonText }</button> */}
            </form>
        </div>
    )
}
