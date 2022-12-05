
import React, { useEffect, useState } from 'react';
import Table from '../components/Table';
import Form from '../components/Form';
import { createEntity, getDeleteEntityFn, getEntityData, updateEntityData, getShowsAsOptions } from '../utils/entityData';
import { updateSelectedVals } from '../utils/selectMultiple';
import * as formConstants from '../constants/form_strings';
import { backendURL } from '../constants/backendURL';
import Accordion from '../components/Accordion';
import RespModal from '../components/Modal';

export default function Subscribers () {

    const validateAgeInput = (e, ageVar, setAgeVarFn) =>
    {e.target.value == '' || e.target.value >= 1 ? setAgeVarFn(e.target.value) : setAgeVarFn(ageVar)}
         
    // set gender select options
    const genderOptions = [
        {
            value: '',
            text: '',

        },
        {
            value: 'Female',
            text: 'Female'
        },
        {
            value: 'Male',
            text: 'Male',
        },
        {
            value: 'Non-Binary',
            text: 'Non-Binary'
        },
        {
            value: 'Prefer not to say',
            text: 'Prefer not to say'
        }
    ]

    // ****************
    // Load data to be displayed in table
    // ****************
    const tableTitle = 'Subscribers';
    const tableHeaders = [
        'ID',
        'First Name',
        'Last Name',
        'Email Address',
        'Phone Number',
        'Age',
        'Gender',
        'Subscribed Shows'
    ]

    const [showsOptions, setShowsOptions] = useState([]);
    const loadShowsOptions = async () => {
        const showsAsOptions = await getShowsAsOptions(true); // pass true so we don't get a blank first option since it's a multi select
        setShowsOptions(showsAsOptions);
    };

    const subscribersToArrays = (subscribersData) => {
        let subscribersAsArrays = []
        for (let cnt=0; cnt<subscribersData.length; cnt++) {
            let { subscriber_ID, first_name, last_name, email_address, phone_number, age, gender, show_ID } = subscribersData[cnt];
            console.log(subscriber_ID, first_name, last_name, email_address, phone_number, age, gender, show_ID)
            subscribersAsArrays.push([subscriber_ID, first_name, last_name, email_address, phone_number, age, gender, show_ID === null ? [show_ID] : show_ID.length > 1 ? show_ID : [show_ID]]);
        }
        setSubscribers(subscribersAsArrays);
    };


    const [subscribers, setSubscribers] = useState([]);
    const loadSubscribers = async () => {
        // get subscribers data from db
        const subscribersData = await getEntityData('subscribers');
        // transform data into ordered array
        subscribersToArrays(subscribersData, setSubscribers)
    };

    const clearSearchForm = () => {
        setSubscriberSearchFirstName('');
        setSubscriberSearchLastName('');
    };

    // ****************
    // Define subscriber search form
    // ****************
    const [subscriberSearchFirstName, setSubscriberSearchFirstName] = useState('');
    const [subscriberSearchLastName, setSubscriberSearchLastName] = useState('');

    const searchForSubscriber = async (e) => {
        e.preventDefault();
        setSubscriberSearchFirstName(subscriberSearchFirstName === '' ? undefined : subscriberSearchFirstName);
        setSubscriberSearchLastName(subscriberSearchLastName === '' ? undefined : subscriberSearchLastName);
        let url;
        if (subscriberSearchFirstName !== '' && subscriberSearchLastName !== '') {
            url = `${backendURL}/subscribers?firstName=${subscriberSearchFirstName}&lastName=${subscriberSearchLastName}`
        } else if (subscriberSearchFirstName !== '') {
            url = `${backendURL}/subscribers?firstName=${subscriberSearchFirstName}`
        } else {
            url = `${backendURL}/subscribers?lastName=${subscriberSearchLastName}`
        };
        const resp = await fetch(url);
        console.log(resp);
        const subscribersData = await resp.json()
        subscribersToArrays(subscribersData);     
        // alert(`Searching for subscriber with name: ${searchSubscriber.subscriberSearchFirstName} ${searchSubscriber.subscriberSearchLastName}`);
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


    // ****************
    // Load add new subscriber form
    // ****************
    const [newSubscriberFirstName, setNewSubscriberFirstName] = useState('');
    const [newSubscriberLastName, setNewSubscriberLastName] = useState('');
    const [newSubscriberEmail, setNewSubscriberEmail] = useState('');
    const [newSubscriberPhone, setNewSubscriberPhone] = useState('');
    const [newSubscriberAge, setNewSubscriberAge] = useState('');
    const [newSubscriberGender, setNewSubscriberGender] = useState('');
    const [newSubscriberShowIDs, setNewSubscriberShowIDs] = useState([]);

    const addNewSubscriber = async (e) => {
        e.preventDefault();
        const newSubscriber = {newSubscriberFirstName, newSubscriberLastName, newSubscriberEmail, newSubscriberPhone, newSubscriberAge, newSubscriberGender, newSubscriberShowIDs}
        newSubscriber.newSubscriberPhone = newSubscriber.newSubscriberPhone === '' ? undefined : newSubscriber.newSubscriberPhone;
        newSubscriber.newSubscriberAge = newSubscriber.newSubscriberAge === '' ? undefined : newSubscriber.newSubscriberAge;
        newSubscriber.newSubscriberGender = newSubscriber.newSubscriberGender === '' ? undefined: newSubscriber.newSubscriberGender;
        const respStatus = await createEntity('subscribers', newSubscriber);
        setRespModalIsOpen(true);
        if (respStatus === 201) {
            setRespModalMsg(`a new Subscriber with name: ${newSubscriber.newSubscriberFirstName} ${newSubscriber.newSubscriberLastName} has been aded to the database!`);
            await loadSubscribers();
            for (let fn of [setNewSubscriberFirstName, setNewSubscriberLastName, setNewSubscriberEmail, setNewSubscriberPhone, setNewSubscriberAge, setNewSubscriberGender]) {
                fn('');
            };
            setNewSubscriberShowIDs([]);
        } else {
            setRespModalMsg(`Unable to add new subscribers to database. Error status ${respStatus} Please try again later.`);
        };
    }

    const addNewSubscriberFormTitle = formConstants.REQUIRED_FIELD_INSTR;
    const addNewSubscriberFormInputs = [
        {
            type: 'text',
            id: 'new-subscriber-first-name',
            value: newSubscriberFirstName,
            placeholder: 'Subscriber First Name',
            onChange: e => setNewSubscriberFirstName(e.target.value),
            labelText: formConstants.REQUIRED_FIELD_INDICATOR + 'First Name: ',
            inputIsRequired: true
        },
        {
            type: 'text',
            id: 'new-subscriber-last-name',
            value: newSubscriberLastName,
            placeholder: 'Subscriber Last Name',
            onChange: e => setNewSubscriberLastName(e.target.value),
            labelText: formConstants.REQUIRED_FIELD_INDICATOR + 'Last Name: ',
            inputIsRequired: true
        },
        {
            type: 'text',
            id: 'new-subscriber-email',
            value: newSubscriberEmail,
            placeholder: 'Subscriber Email',
            onChange: e => setNewSubscriberEmail(e.target.value),
            labelText: formConstants.REQUIRED_FIELD_INDICATOR + 'Email Address: ',
            inputIsRequired: true
        },
        {
            type: 'text',
            id: 'new-subscriber-phone',
            value: newSubscriberPhone,
            placeholder: 'Subscriber Phone #',
            onChange: e => setNewSubscriberPhone(e.target.value),
            labelText: 'Phone #: ',
            inputIsRequired: false
        },
        {
            type: 'number',
            id: 'new-subscriber-age',
            value: newSubscriberAge,
            placeholder: 'Subscriber Age',
            onChange: e => setNewSubscriberAge(e.target.value), 
            labelText: 'Age: ',
            inputIsRequired: false
        },
        {
            type: 'select',
            id: 'new-subscriber-gender',
            value: newSubscriberGender,
            onChange: e => setNewSubscriberGender(e.target.value),
            options: genderOptions,
            labelText: 'Gender: ',
            inputIsRequired: false
        },
        {
            type: 'select',
            id: 'new-subscriber-show-ids',
            multiple: true,
            value: newSubscriberShowIDs,
            onChange: e => updateSelectedVals(e, setNewSubscriberShowIDs),
            options: showsOptions,
            labelText: formConstants.REQUIRED_FIELD_INDICATOR + 'Subscribed Shows ' + formConstants.MULTI_SELECT_INSTR + ':',
            inputIsRequired: true
        },
        {
            type: 'submit',
            id: 'add-new-subscriber-submit',
            value: 'Add New Subscriber'
        }
    ]

    // ****************
    // Define update subscriber form
    // ****************
    const [subscriberToUpdateID, setSubscriberToUpdateID] = useState(''); 
    const [subscriberToUpdateFirstName, setSubscriberToUpdateFirstName] = useState('');
    const [subscriberToUpdateLastName, setSubscriberToUpdateLastName] = useState('');
    const [subscriberToUpdateEmail, setSubscriberToUpdateEmail] = useState('');
    const [subscriberToUpdatePhone, setSubscriberToUpdatePhone] = useState('');
    const [subscriberToUpdateAge, setSubscriberToUpdateAge] = useState('');
    const [subscriberToUpdateGender, setSubscriberToUpdateGender] = useState('');
    const [subscriberToUpdateSubscribedShowIDs, setSubscriberToUpdateSubscribedShowIDs] = useState([]);

    const setSubscriberToUpdateSubscribedShows = (e) => {
        let vals = []
        for (let i=0; i<e.target.options.length; i++) {
            if (e.target.options[i].selected) {
                vals.push(e.target.options[i].value);
            }
        };
        setSubscriberToUpdateSubscribedShowIDs(vals);
    };

    const fillSubscriberToUpdateData = (e) => {
        // this function autofills the data in the update form based on the user input

        // once we get the backend up and running, search for Subscribers data
        // based on value in SubscriberToUpdateID input
        setSubscriberToUpdateID(e.target.value);
        console.log('onBlur event triggered to fill Subscriber data');
        setSubscriberToUpdateFirstName('');
        setSubscriberToUpdateLastName('');
        setSubscriberToUpdateEmail('');
        setSubscriberToUpdatePhone('');
        setSubscriberToUpdateAge('');
        setSubscriberToUpdateGender('');
        setSubscriberToUpdateSubscribedShowIDs([]);

        if (e.target.value) {
            let subscriber;
            for (let s of subscribers) {
                if (s[0] == e.target.value) {
                    subscriber = s;
                }
            };
            if (subscriber === undefined) {
                alert(`no subscribers associated with ID: ${e.target.value} were found in the database!`)
            }
            else {
                // set input field values based on subscriber data return by search
                setSubscriberToUpdateFirstName(subscriber[1]);
                setSubscriberToUpdateLastName(subscriber[2]);
                setSubscriberToUpdateEmail(subscriber[3]);
                setSubscriberToUpdatePhone(subscriber[4]);
                setSubscriberToUpdateAge(subscriber[5]);
                setSubscriberToUpdateGender(subscriber[6]);
                setSubscriberToUpdateSubscribedShowIDs(subscriber[7]);
            };
        }
    }   

    const updateSubscriber = async (e) => {
        e.preventDefault();
        const subscriberToUpdate = {subscriberToUpdateID, subscriberToUpdateFirstName, subscriberToUpdateLastName, subscriberToUpdateEmail, subscriberToUpdatePhone, subscriberToUpdateAge, subscriberToUpdateGender, subscriberToUpdateSubscribedShowIDs};        
        subscriberToUpdate.subscriberToUpdatePhone = subscriberToUpdate.subscriberToUpdatePhone === '' ? undefined : subscriberToUpdate.subscriberToUpdatePhone;
        subscriberToUpdate.subscriberToUpdateAge = subscriberToUpdate.subscriberToUpdateAge === '' ? undefined : subscriberToUpdate.subscriberToUpdateAge;
        subscriberToUpdate.subscriberToUpdateGender = subscriberToUpdate.subscriberToUpdateGender === '' ? undefined : subscriberToUpdate.subscriberToUpdateGender;
        const respStatus = await updateEntityData('subscribers', subscriberToUpdate);
        setRespModalIsOpen(true);
        if (respStatus === 200) {
            setRespModalMsg(`Success! Subscriber with ID: ${subscriberToUpdate.subscriberToUpdateID} has been updated in the database.`)
            await loadSubscribers();
            for (let fn of [setSubscriberToUpdateID, setSubscriberSearchFirstName, setSubscriberSearchLastName, setSubscriberToUpdateEmail, setSubscriberToUpdatePhone, setSubscriberToUpdateAge, setSubscriberToUpdateGender]) {
                fn('');
            };
            setSubscriberToUpdateSubscribedShowIDs([]);
        } else {
            setRespModalMsg(`Unable to update subscriber in the database. Error status: ${respStatus} Please try again later.`);
        };
    }

    const updateSubscriberFormTitle = formConstants.REQUIRED_FIELD_INSTR;
    const updateSubscriberFormInputs = [
        {
            type: 'select',
            id: 'subscriber-to-update-id',
            value: subscriberToUpdateID,
            placeholder: 'Subscriber ID',
            onChange: e => fillSubscriberToUpdateData(e),
            options: [...[{}], ...subscribers.map((subscriber) => {
                return {
                    text: `${subscriber[0]}, ${subscriber[1]} ${subscriber[2]}`,
                    value: subscriber[0]
                };
            })],
            labelText: formConstants.REQUIRED_FIELD_INDICATOR + 'Subscriber ID: ' + formConstants.AUTO_FILL_UPDATE_FORM_INSTR,
            inputIsRequired: true
        },
        {
            type: 'text',
            id: 'subscriber-to-update-first-name',
            value: subscriberToUpdateFirstName,
            placeholder: 'Subscriber First Name',
            onChange: e => setSubscriberToUpdateFirstName(e.target.value),
            labelText: formConstants.REQUIRED_FIELD_INDICATOR + 'First Name: ',
            inputIsRequired: true
        },
        {
            type: 'text',
            id: 'subscriber-to-update-last-name',
            value: subscriberToUpdateLastName,
            placeholder: 'Subscriber Last Name',
            onChange: e => setSubscriberToUpdateLastName(e.target.value),
            labelText: formConstants.REQUIRED_FIELD_INDICATOR + 'Last Name: ',
            inputIsRequired: true
        },
        {
            type: 'text',
            id: 'subscriber-to-update-email',
            value: subscriberToUpdateEmail,
            placeholder: 'Subscriber Email',
            onChange: e => setSubscriberToUpdateEmail(e.target.value),
            labelText: formConstants.REQUIRED_FIELD_INDICATOR + 'Email Address: ',
            inputIsRequired: true
        },
        {
            type: 'text',
            id: 'subscriber-to-update-phone',
            value: subscriberToUpdatePhone,
            placeholder: 'Subscriber Phone #',
            onChange: e => setSubscriberToUpdatePhone(e.target.value),
            labelText: 'Phone #: ',
            inputIsRequired: false
        },
        {
            type: 'number',
            id: 'subscriber-to-update-age',
            value: subscriberToUpdateAge,
            placeholder: 'Subscriber Age',
            onChange: e => validateAgeInput(e, subscriberToUpdateAge, setSubscriberToUpdateAge),
            labelText: 'Age: ',
            inputIsRequired: false
        },
        {
            type: 'select',
            id: 'subscriber-to-update-gender',
            value: subscriberToUpdateGender,
            onChange: e => setSubscriberToUpdateGender(e.target.value),
            options: genderOptions,
            labelText: 'Gender: ',
            inputIsRequired: false
        },
        {
            type: 'select',
            id: 'subscriber-to-update-show-ids',
            multiple: true,
            value: subscriberToUpdateSubscribedShowIDs,
            onChange: e => setSubscriberToUpdateSubscribedShows(e),
            options: showsOptions,
            labelText: formConstants.REQUIRED_FIELD_INDICATOR + 'Subscribed Shows ' + formConstants.MULTI_SELECT_INSTR + ':',
            inputIsRequired: true
        },
        {
            type: 'submit',
            id: 'update-subscriber-submit',
            value: 'Update Subscriber'
        }
    ]

    const [respModalIsOpen, setRespModalIsOpen] = useState(false);
    const [respModalMsg, setRespModalMsg] = useState('');

    const deleteSubscriber = getDeleteEntityFn('Subscribers', loadSubscribers, setRespModalIsOpen, setRespModalMsg);

    useEffect(() => {
        loadSubscribers()
    },
    []);

    useEffect(() => {
        loadShowsOptions()
    },
    []);

    return (
        <div>
            <Table tableTitle={ tableTitle } tableHeaders={ tableHeaders } data={ subscribers.map(subscriber => subscriber.map((val, i) => i === 7 ? JSON.stringify(val) : val)) } onDelete={ deleteSubscriber } setEntityFn={ loadSubscribers }/>            
            <button className={ 'reset-table' } onClick={ () => { loadSubscribers(); clearSearchForm(); }}>Reset Table</button>
            <Accordion
                 title={'Search Subscriber'}
                 content={
                     <Form title={ searchSubscriberFormTitle } inputs={ searchSubscriberFormInputs } onSubmit={ searchForSubscriber }/>
                 }                    
             />
             <Accordion
                 title={'Add New Subscriber'}
                 content={
                     <Form title={ addNewSubscriberFormTitle } inputs={ addNewSubscriberFormInputs } onSubmit={ addNewSubscriber }/>
                 }
             />
             <Accordion
                 title={'Update Subscriber'}
                 content={
                     <Form title={ updateSubscriberFormTitle } inputs={ updateSubscriberFormInputs } onSubmit={ updateSubscriber }/>
                 }
             />  
            <RespModal modalIsOpen={ respModalIsOpen } setModalIsOpenFn={ setRespModalIsOpen } modalMsg={ respModalMsg }></RespModal>      
        </div>
    )
}
