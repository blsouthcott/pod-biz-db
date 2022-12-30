import React, { useState } from "react";
import { dataToObj } from "../../../../utils/displayDataUtils";
import { getEntityData } from "../../../../utils/entityData";
import { backendURL } from "../../../../constants/backendURL";
import { subscribersToArrays } from "../../../../utils/displayDataUtils";
import Form from "../../../Form";


export default function SearchSubscribersForm ({ setDisplaySearched, setLocalSubscribersDisplayData}) {

    const [subscriberSearchFirstName, setSubscriberSearchFirstName] = useState('');
    const [subscriberSearchLastName, setSubscriberSearchLastName] = useState('');

    const clearSearchForm = () => {
        setSubscriberSearchFirstName('');
        setSubscriberSearchLastName('');
        // const tableHeader = document.getElementById('table-header-row');
        // tableHeader.scrollIntoView();
    };
    
    const searchForSubscriber = async (e) => {
        e.preventDefault();
        let url;
        if (subscriberSearchFirstName !== '' && subscriberSearchLastName !== '') {
            url = `${backendURL}/subscribers?firstName=${subscriberSearchFirstName}&lastName=${subscriberSearchLastName}`
        } else if (subscriberSearchFirstName !== '') {
            url = `${backendURL}/subscribers?firstName=${subscriberSearchFirstName}`
        } else {
            url = `${backendURL}/subscribers?lastName=${subscriberSearchLastName}`
        };
        const [
            searchResp,
            showsData
        ] = await Promise.all([
            fetch(url),
            getEntityData('shows')
        ]);
        const subscribersData = await searchResp.json();
        const showsObj = dataToObj(showsData, 'show_ID');
        setLocalSubscribersDisplayData(subscribersToArrays(subscribersData, showsObj));
        setDisplaySearched();
        clearSearchForm();
    };

    const searchSubscriberFormTitle = '';
    const searchSubscriberFormInputs = [
        {
            type: 'text',
            id: 'subscriber-search-first-name',
            value: subscriberSearchFirstName,
            placeholder: 'Subscriber First Name',
            onChange: e => setSubscriberSearchFirstName(e.target.value),
            labelText: 'First name:'
        },
        {
            type: 'text',
            id: 'subscriber-search-last-name',
            value: subscriberSearchLastName,
            placeholder: 'Subscriber Last Name',
            onChange: e => setSubscriberSearchLastName(e.target.value),
            labelText: 'Last name:'
        },
        {
            type: 'submit',
            id: 'search-subscribers-submit',
            value: 'Search Subscribers'
        }
    ]

    return (
        <div>
            <Form title={ searchSubscriberFormTitle } inputs={ searchSubscriberFormInputs } onSubmit={ searchForSubscriber }/>
        </div>
    )
}
