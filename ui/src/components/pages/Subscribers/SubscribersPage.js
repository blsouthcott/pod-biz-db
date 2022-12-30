
import React, { useState, useReducer } from 'react';
import Accordion from '../../Accordion';
import SubscribersTable from './SubscribersTable';
import SearchSubscribersForm from './forms/SearchSubscribersForm';
import AddSubscriberForm from './forms/AddSubscriberForm';
import UpdateSubscriberForm from './forms/UpdateSubscriberForm';

export default function Subscribers () {
    console.log('Rendering Subscribers component...')

    const [displaySearched, setDisplaySearched] = useReducer(displaySearched => !displaySearched, false);
    const [localSubscribersDisplayData, setLocalSubscribersDisplayData] = useState([]);

    return (
        <div>
            <SubscribersTable displaySearched={ displaySearched } setDisplaySearched={ setDisplaySearched } localSubscribersDisplayData={ localSubscribersDisplayData }/>
            <Accordion
                 title={'Search Subscriber'}
                 content={<SearchSubscribersForm setDisplaySearched={ setDisplaySearched } setLocalSubscribersDisplayData={ setLocalSubscribersDisplayData }/>}             
            />
             <Accordion
                 title={'Add New Subscriber'}
                 content={<AddSubscriberForm/>}
             />
             <Accordion
                 title={'Update Subscriber'}
                 content={<UpdateSubscriberForm/>}
             />
        </div>
    )
}
