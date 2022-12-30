import React from 'react';
import Accordion from '../../Accordion';
import StreamsTable from './StreamsTable';
import AddStreamForm from './forms/AddStreamForm';


export default function Streams () {
    console.log('Rendering Streams component...')

    return (
        <div>
            <StreamsTable/>
            <Accordion
                title={'Add New Stream'}
                content={<AddStreamForm/>}
            />
        </div>
    )
}
