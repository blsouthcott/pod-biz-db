import React from 'react';
import Accordion from '../../Accordion';
import ProducersTable from './ProducersTable';
import AddProducerForm from './forms/AddProducerForm';
import UpdateProducerForm from './forms/UpdateProducerForm';


export default function Producers () {
    console.log('Rendering Producers component...')

    return (
        <div>
            <ProducersTable/>
            <Accordion
                title={'Add New Producer'}
                content={<AddProducerForm/>}
            />
            <Accordion
                title={'Update Producer'}
                content={<UpdateProducerForm/>}
            />
        </div>
    )
}
