import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createEntity } from "../../../../utils/entityData";
import { loadSubscribers } from "../../../../store/actions/entitiesActions";
import * as formConstants from '../../../../constants/form_strings';
import { updateSelectedVals } from "../../../../utils/selectMultiple";
import Form from "../../../Form";
import RespModal from "../../../Modal";
import { validateAgeInput, genderOptions } from "../../../../utils/formUtils";


export default function AddSubscriberForm () {

    const dispatch = useDispatch();

    const showsOptions = useSelector(state => state.entityData.showsOptions);
    const subscribersDisplayData = useSelector(state => state.entityData.subscribersDisplayData);

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
        if (respStatus === 201) {
            dispatch(loadSubscribers());
            setRespModalMsg(`a new Subscriber with name: ${newSubscriber.newSubscriberFirstName} ${newSubscriber.newSubscriberLastName} has been aded to the database!`);
            setIsSuccessResp(true);
            for (let fn of [setNewSubscriberFirstName, setNewSubscriberLastName, setNewSubscriberEmail, setNewSubscriberPhone, setNewSubscriberAge, setNewSubscriberGender]) {
                fn('');
            };
            setNewSubscriberShowIDs([]);
        } else {
            setRespModalMsg(`Unable to add new subscribers to database. Error status ${respStatus} Please try again later.`);
            setIsSuccessResp(false);
        };
        setRespModalIsOpen(true);
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
            onChange: e => validateAgeInput(e, newSubscriberAge, setNewSubscriberAge), 
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

    const [respModalIsOpen, setRespModalIsOpen] = useState(false);
    const [respModalMsg, setRespModalMsg] = useState('');
    const [isSuccessResp, setIsSuccessResp] = useState();

    return (
        <div>
            <Form title={ addNewSubscriberFormTitle } inputs={ addNewSubscriberFormInputs } onSubmit={ addNewSubscriber }/>
            <RespModal 
            modalIsOpen={ respModalIsOpen } 
            setModalIsOpenFn={ setRespModalIsOpen } 
            modalMsg={ respModalMsg }
            isSuccessResp={ isSuccessResp }
            respType={ 'create' }
            entityDisplayData={ subscribersDisplayData }
            />      
        </div>
    )
}
