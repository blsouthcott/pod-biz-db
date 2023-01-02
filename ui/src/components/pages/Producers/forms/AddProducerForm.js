import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createEntity } from "../../../../utils/entityData";
import Form from "../../../Form";
import RespModal from "../../../Modal";
import { loadProducers } from "../../../../store/actions/entitiesActions";
import * as formConstants from '../../../../constants/form_strings';


export default function AddProducerForm () {

    const dispatch = useDispatch();

    const showsOptions = useSelector(state => state.entityData.showsOptions);
    const producersDisplayData = useSelector(state => state.entityData.producersDisplayData);

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
        if (respStatus === 201) {
            dispatch(loadProducers());
            setRespModalMsg(`Success! A new producer with name ${newProducerFirstName} ${newProducerLastName}, has been added to the database.`);
            setIsSuccessResp(true);
            for (let fn of [setNewProducerFirstName, setNewProducerLastName, setNewProducerEmail, setNewProducerPhone, setNewProducerShowID]) {
                fn('');
            };
        } else {
            setRespModalMsg(`Unable to add new producer to the database. Error status: ${respStatus}. Please try again later.`);
            setIsSuccessResp(false);
        };
        setRespModalIsOpen(true);
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
            options: [...[{}], ...showsOptions],
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

    const [respModalIsOpen, setRespModalIsOpen] = useState(false);
    const [respModalMsg, setRespModalMsg] = useState('');
    const [isSuccessResp, setIsSuccessResp] = useState();

    return (
        <div>
            <Form title={ addNewProducerFormTitle } inputs={ addNewProducerFormInputs } onSubmit={ addNewProducer }/>
            <RespModal 
            modalIsOpen={ respModalIsOpen } 
            setModalIsOpenFn={ setRespModalIsOpen } 
            modalMsg={ respModalMsg }
            isSuccessResp={ isSuccessResp }
            respType={ 'create' }
            entityDisplayData={ producersDisplayData }
            />
        </div>
    )
}