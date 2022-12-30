
import React from 'react';
import Accordion from '../../Accordion';

import HostsTable from './HostsTable';
import AddHostForm from './forms/AddHostForm';
import UpdateHostForm from './forms/UpdateHostForm';

export default function Hosts () {
    console.log('Rendering Hosts Page component...')

    return (
        <div>
            <HostsTable/>
            <Accordion
                title={'Add New Host'}
                content={<AddHostForm/>}
            />
            <Accordion
                title={'Update Host'}
                content={<UpdateHostForm/>}
            />
        </div>
    )
}
