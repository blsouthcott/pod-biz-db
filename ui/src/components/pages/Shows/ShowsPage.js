import React from 'react';
import Accordion from '../../Accordion';
import ShowsTable from './ShowsTable';
import AddShowForm from './forms/AddShowForm';


export default function Shows () {
    console.log('Rendering Shows component...')

    return (
        <div>
            <ShowsTable/>
            <Accordion
                title={'Add New Show'}
                content={<AddShowForm/>}
            />
        </div>
    )
}
