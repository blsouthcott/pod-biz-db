import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateEntityData } from "../../../../utils/entityData";
import { loadProducers } from "../../../../store/actions/entitiesActions";
import * as formConstants from '../../../../constants/form_strings';
import Form from "../../../Form";
import RespModal from "../../../Modal";


export default function UpdateProducerForm () {

    const dispatch = useDispatch();

    const producersData = useSelector(state => state.entityData.producersData);
    const producersDisplayData = useSelector(state => state.entityData.producersDisplayData);
    const producersOptions = useSelector(state => state.entityData.producersOptions);
    const showsOptions = useSelector(state => state.entityData.showsOptions);

    const [producerToUpdateID, setProducerToUpdateID] = useState('');
    const [producerToUpdateFirstName, setProducerToUpdateFirstName] = useState('');
    const [producerToUpdateLastName, setProducerToUpdateLastName] = useState('');
    const [producerToUpdateEmail, setProducerToUpdateEmail] = useState('');
    const [producerToUpdatePhone, setProducerToUpdatePhone] = useState('');
    const [producerToUpdateShowID, setProducerToUpdateShowID] = useState([]);

    const [updatedProducerID, setUpdatedProducerID] = useState('');

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
            for (let p of producersData) {
                if (p.producer_ID == e.target.value) {
                    producer = p;
                }
            };
            if (producer === undefined) {
                alert(`no Producer associated with ID: ${e.target.value} was found in the database!`)
            } else {
                // set input field values based on episode data return by search
                setProducerToUpdateFirstName(producer.first_name);
                setProducerToUpdateLastName(producer.last_name);
                setProducerToUpdateEmail(producer.email_address);
                setProducerToUpdatePhone(producer.phone_number);
                setProducerToUpdateShowID(producer.show_ID !== null ? producer.show_ID : '');
            };
        }
    }
    
    const updateProducer = async (e) => {
        e.preventDefault();
        const producerToUpdate = { producerToUpdateID, producerToUpdateFirstName, producerToUpdateLastName, producerToUpdateEmail, producerToUpdatePhone, producerToUpdateShowID };
        producerToUpdate.producerToUpdateShowID = producerToUpdate.producerToUpdateShowID === '' ? undefined : producerToUpdate.producerToUpdateShowID;
        const respStatus = await updateEntityData('producers', producerToUpdate);
        if (respStatus === 200) {
            setUpdatedProducerID(producerToUpdateID);
            setRespModalMsg(`Success! Producer with id: ${producerToUpdateID} has been updated in the database.`);
            for (let fn of [setProducerToUpdateID, setProducerToUpdateFirstName, setProducerToUpdateLastName, setProducerToUpdateEmail, setProducerToUpdatePhone, setProducerToUpdateShowID]) {
                fn('');
            };
            dispatch(loadProducers());
        } else {
            setRespModalMsg(`Unable to update producer in the database. Error status: ${respStatus}. Please try again later`);
        };
        setRespModalIsOpen(true);
    }

    const updateProducerFormTitle = formConstants.REQUIRED_FIELD_INSTR;
    const updateProducerFormInputs = [
        {
            type: 'select',
            id: 'producer-to-update-id',
            multiple: false,
            value: producerToUpdateID,
            onChange: e => fillProducerToUpdateData(e),
            options: [...[{}], ...producersOptions],
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
            options: [...[{}], ...showsOptions],
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

    const [respModalIsOpen, setRespModalIsOpen] = useState(false);
    const [respModalMsg, setRespModalMsg] = useState('');
    const [isSuccessResp, setIsSuccessResp] = useState();

    return (
        <div>
            <Form title={ updateProducerFormTitle } inputs={ updateProducerFormInputs } onSubmit={ updateProducer }/>
            <RespModal 
            modalIsOpen={ respModalIsOpen } 
            setModalIsOpenFn={ setRespModalIsOpen } 
            modalMsg={ respModalMsg }
            isSuccessResp={ isSuccessResp }
            respType={ 'update' }
            rowID={ updatedProducerID }
            entityDisplayData={ producersDisplayData }
            />
        </div>
    )
}
