import React, { useEffect, useState } from 'react';
import Table from '../Table';
import Form from '../Form';
import { getDeleteEntityFn, createEntity, getShowsAsOptions, updateEntityData } from '../../utils/entityData';
import * as formConstants from '../../constants/form_strings';
import { getEntityData } from '../../utils/entityData';
import { backendURL } from '../../constants/backendURL';
import RespModal from '../Modal';
import Accordion from '../Accordion';


export default function Producers () {

    // ****************
    // Load data to be displayed in producers table
    // ****************
    const tableTitle = 'Producers';
    const tableHeaders = [
        'ID',
        'First Name',
        'Last Name',
        'Email Address',
        'Phone Number',
        'Show ID'
    ]

    const [producers, setProducers] = useState([]);
    const loadProducers = async () => {
        // get producers data from CS340 MySQL database
        let producersData = await getEntityData('producers');
        // transform json into ordered data
        let producersAsArrays = []
        for (let cnt=0; cnt<producersData.length; cnt++) {
            let { producer_ID, show_ID, first_name, last_name, email_address, phone_number } = producersData[cnt];
            producersAsArrays.push([producer_ID, first_name, last_name, email_address, phone_number, show_ID]);
        }
        setProducers(producersAsArrays);
    }

    // load shows to be displayed as options for which show a producer works on
    const [shows, setShows] = useState([]);
    const loadShowsOptions = async () => {
        const showsAsOptions = await getShowsAsOptions(false); // pass false to get an empty first option since it's a single select
        setShows(showsAsOptions);
    }

    // ****************
    // Define add new producer form
    // ****************
    const [newProducerFirstName, setNewProducerFirstName] = useState('');
    const [newProducerLastName, setNewProducerLastName] = useState('');
    const [newProducerEmail, setNewProducerEmail] = useState('');
    const [newProducerPhone, setNewProducerPhone] = useState('');
    const [newProducerShowID, setNewProducerShowID] = useState('');

    const addNewProducer = async (e) => {
        e.preventDefault();
        const newProducer = { newProducerFirstName, newProducerLastName, newProducerEmail, newProducerPhone, newProducerShowID };
        console.log('new producer show ID: ', newProducer.newProducerShowID);
        newProducer.newProducerShowID = newProducer.newProducerShowID === '' ? undefined : newProducer.newProducerShowID;
        const respStatus = await createEntity('producers', newProducer);
        setRespModalIsOpen(true);
        if (respStatus === 201) {
            setRespModalMsg(`Success! A new producer with name ${newProducerFirstName} ${newProducerLastName}, has been added to the database.`);
            for (let fn of [setNewProducerFirstName, setNewProducerLastName, setNewProducerEmail, setNewProducerPhone, setNewProducerShowID]) {
                fn('');
            };
            await loadProducers();
        } else {
            setRespModalMsg(`Unable to add new producer to the database. Error status: ${respStatus}. Please try again later.`);
        };
    };

    const addNewProducerFormTitle = formConstants.REQUIRED_FIELD_INSTR;
    const addNewProducerFormInputs = [
        {
            type: 'text',
            id: 'new-producer-first-name',
            value: newProducerFirstName,
            placeholder: 'Producer First Name',
            onChange: e => setNewProducerFirstName(e.target.value),
            labelText: formConstants.REQUIRED_FIELD_INDICATOR + 'First Name: ',
            inputIsRequired: true
        },
        {
            type: 'text',
            id: 'new-producer-last-name',
            value: newProducerLastName,
            placeholder: 'Producer Last Name',
            onChange: e => setNewProducerLastName(e.target.value),
            labelText: formConstants.REQUIRED_FIELD_INDICATOR + 'Last Name: ',
            inputIsRequired: true
        },
        {
            type: 'select',
            id: 'new-producer-show-id',
            value: newProducerShowID,
            onChange: e => setNewProducerShowID(e.target.value),
            options: shows,
            labelText: 'Show ID: ',
            inputIsRequired: false
        },
        {
            type: 'text',
            id: 'new-producer-email',
            value: newProducerEmail,
            placeholder: 'Producer Email',
            onChange: e => setNewProducerEmail(e.target.value),
            labelText: formConstants.REQUIRED_FIELD_INDICATOR + 'Email Address: ',
            inputIsRequired: true
        },
        {
            type: 'text',
            id: 'new-producer-phone',
            value: newProducerPhone,
            placeholder: 'Producer Phone #',
            onChange: e => setNewProducerPhone(e.target.value),
            labelText: formConstants.REQUIRED_FIELD_INDICATOR + 'Phone #: ',
            inputIsRequired: true
        },
        {
            type: 'submit',
            id: 'add-new-producer-submit',
            value: 'Add New Producer'
        }
    ]

    // ****************
    // Define update producer form
    // ****************
    const [producerToUpdateID, setProducerToUpdateID] = useState('');
    const [producerToUpdateFirstName, setProducerToUpdateFirstName] = useState('');
    const [producerToUpdateLastName, setProducerToUpdateLastName] = useState('');
    const [producerToUpdateEmail, setProducerToUpdateEmail] = useState('');
    const [producerToUpdatePhone, setProducerToUpdatePhone] = useState('');
    const [producerToUpdateShowID, setProducerToUpdateShowID] = useState([]);

    const fillProducerToUpdateData = (e) => {
        // once we get the backend up and running, search for episodes data
        // based on value in episodeToUpdateID input
        setProducerToUpdateID(e.target.value);
        console.log('onBlur event triggered to fill producer data');
        setProducerToUpdateFirstName('');
        setProducerToUpdateLastName('');
        setProducerToUpdateEmail('');
        setProducerToUpdatePhone('');
        setProducerToUpdateShowID([]);
        if (e.target.value) {
            let producer;
            for (let p of producers) {
                if (p[0] == e.target.value) {
                    producer = p;
                }
            };
            if (producer === undefined) {
                alert(`no Producer associated with ID: ${e.target.value} was found in the database!`)
            } else {
                // set input field values based on episode data return by search
                setProducerToUpdateFirstName(producer[1]);
                setProducerToUpdateLastName(producer[2]);
                setProducerToUpdateEmail(producer[3]);
                setProducerToUpdatePhone(producer[4]);
                setProducerToUpdateShowID(producer[5]);
            };
        }
    }
    
    const updateProducer = async (e) => {
        e.preventDefault();
        const producerToUpdate = { producerToUpdateID, producerToUpdateFirstName, producerToUpdateLastName, producerToUpdateEmail, producerToUpdatePhone, producerToUpdateShowID };
        producerToUpdate.producerToUpdateShowID = producerToUpdate.producerToUpdateShowID === '' ? undefined : producerToUpdate.producerToUpdateShowID;
        const respStatus = await updateEntityData('producers', producerToUpdate);
        setRespModalIsOpen(true);
        if (respStatus === 200) {
            setRespModalMsg(`Success! Producer with id: ${producerToUpdateID} has been updated in the database.`);
            for (let fn of [setProducerToUpdateID, setProducerToUpdateFirstName, setProducerToUpdateLastName, setProducerToUpdateEmail, setProducerToUpdatePhone, setProducerToUpdateShowID]) {
                fn('');
            };
            await loadProducers();
        } else {
            setRespModalMsg(`Unable to update producer in the database. Error status: ${respStatus}. Please try again later`);
        };
    }

    const updateProducerFormTitle = formConstants.REQUIRED_FIELD_INSTR;
    const updateProducerFormInputs = [
        {
            type: 'select',
            id: 'producer-to-update-id',
            multiple: false,
            value: producerToUpdateID,
            onChange: e => fillProducerToUpdateData(e),
            options: [...[{}], ...producers.map((producer) => {
                return {
                    text: `${producer[0]}, ${producer[1]} ${producer[2]}`,
                    value: producer[0]
                };
            })],
            labelText: formConstants.REQUIRED_FIELD_INDICATOR + 'Producer ID: ' + formConstants.AUTO_FILL_UPDATE_FORM_INSTR,
            inputIsRequired: true
        },
        {
            type: 'text',
            id: 'producer-to-update-first-name',
            value: producerToUpdateFirstName,
            placeholder: 'Producer First Name',
            onChange: e => setProducerToUpdateFirstName(e.target.value),
            labelText: formConstants.REQUIRED_FIELD_INDICATOR + 'First Name: ',
            inputIsRequired: true
        },
        {
            type: 'text',
            id: 'producer-to-update-last-name',
            value: producerToUpdateLastName,
            placeholder: 'Producer Last Name',
            onChange: e => setProducerToUpdateLastName(e.target.value),
            labelText: formConstants.REQUIRED_FIELD_INDICATOR + 'Last Name: ',
            inputIsRequired: true
        },
        {
            type: 'select',
            id: 'producer-to-update-show-id',
            multiple: false,
            value: producerToUpdateShowID,
            onChange: e => setProducerToUpdateShowID(e.target.value),
            options: shows,
            labelText: 'Produced Show:',
            inputIsRequired: false
        },
        {
            type: 'text',
            id: 'producer-to-update-email',
            value: producerToUpdateEmail,
            placeholder: 'Producer Email',
            onChange: e => setProducerToUpdateEmail(e.target.value),
            labelText: formConstants.REQUIRED_FIELD_INDICATOR + 'Email Address: ',
            inputIsRequired: true
        },
        {
            type: 'text',
            id: 'producer-to-update-phone',
            value: producerToUpdatePhone,
            placeholder: 'Producer Phone #',
            onChange: e => setProducerToUpdatePhone(e.target.value),
            labelText: formConstants.REQUIRED_FIELD_INDICATOR + 'Phone #: ',
            inputIsRequired: true
        },
        {
            type: 'submit',
            id: 'update-producer-submit',
            value: 'Update Producer'
        }
    ]

    // console.log('producer select input options: ', updateProducerFormInputs[0].options);

    const [respModalIsOpen, setRespModalIsOpen] = useState(false);
    const [respModalMsg, setRespModalMsg] = useState('');

    const deleteProducer = getDeleteEntityFn('Producers', loadProducers, setRespModalIsOpen, setRespModalMsg);

    useEffect(() => {
        loadProducers()
    },
    []);
    
    useEffect(() => {
        loadShowsOptions()
    },
    []);    

    return (
        <div>
            <Table tableTitle={ tableTitle } tableHeaders={ tableHeaders } data={ producers } onDelete={ deleteProducer } setEntityFn={ loadProducers }/>
            <Accordion
                title={'Add New Producer'}
                content={
                    <Form title={ addNewProducerFormTitle } inputs={ addNewProducerFormInputs } onSubmit={ addNewProducer }/>
                }
            />
            <Accordion
                title={'Update Producer'}
                content={
                    <Form title={ updateProducerFormTitle } inputs={ updateProducerFormInputs } onSubmit={ updateProducer }/>
                }
            />
            <RespModal modalIsOpen={ respModalIsOpen } setModalIsOpenFn={ setRespModalIsOpen } modalMsg={ respModalMsg }></RespModal>
        </div>
    )
}
