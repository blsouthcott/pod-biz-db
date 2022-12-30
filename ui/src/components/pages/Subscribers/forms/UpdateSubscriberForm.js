import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { formatShowIDs } from "../../../../utils/displayDataUtils";
import { updateEntityData } from "../../../../utils/entityData";
import { loadSubscribers } from "../../../../store/actions/entitiesActions";
import * as formConstants from '../../../../constants/form_strings';
import { validateAgeInput, genderOptions } from "../../../../utils/formUtils";
import { updateSelectedVals } from "../../../../utils/selectMultiple";
import Form from "../../../Form";
import RespModal from "../../../Modal";


export default function UpdateSubscriberForm () {

    const dispatch = useDispatch();

    const subscribersData = useSelector(state => state.entityData.subscribersData);
    const subscribersOptions = useSelector(state => state.entityData.subscribersOptions);
    const showsOptions = useSelector(state => state.entityData.showsOptions);

    const [subscriberToUpdateID, setSubscriberToUpdateID] = useState(''); 
    const [subscriberToUpdateFirstName, setSubscriberToUpdateFirstName] = useState('');
    const [subscriberToUpdateLastName, setSubscriberToUpdateLastName] = useState('');
    const [subscriberToUpdateEmail, setSubscriberToUpdateEmail] = useState('');
    const [subscriberToUpdatePhone, setSubscriberToUpdatePhone] = useState('');
    const [subscriberToUpdateAge, setSubscriberToUpdateAge] = useState('');
    const [subscriberToUpdateGender, setSubscriberToUpdateGender] = useState('');
    const [subscriberToUpdateSubscribedShowIDs, setSubscriberToUpdateSubscribedShowIDs] = useState([]);

    const fillSubscriberToUpdateData = (e) => {
        // this function autofills the data in the update form based on the user input
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
            for (let s of subscribersData) {
                if (s.subscriber_ID == e.target.value) {
                    subscriber = s;
                }
            };
            if (subscriber === undefined) {
                alert(`no subscribers associated with ID: ${e.target.value} were found in the database!`)
            }
            else {
                // set input field values based on subscriber data return by search
                setSubscriberToUpdateFirstName(subscriber.first_name);
                setSubscriberToUpdateLastName(subscriber.last_name);
                setSubscriberToUpdateEmail(subscriber.email_address);
                setSubscriberToUpdatePhone(subscriber.phone_number);
                setSubscriberToUpdateAge(subscriber.age);
                setSubscriberToUpdateGender(subscriber.gender);
                setSubscriberToUpdateSubscribedShowIDs(formatShowIDs(subscriber.show_ID, {toStr: false}));
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
            for (let fn of [setSubscriberToUpdateID, setSubscriberToUpdateFirstName, setSubscriberToUpdateLastName, setSubscriberToUpdateEmail, setSubscriberToUpdatePhone, setSubscriberToUpdateAge, setSubscriberToUpdateGender]) {
                fn('');
            };
            setSubscriberToUpdateSubscribedShowIDs([]);
            dispatch(loadSubscribers());
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
            options: [...[{}], ...subscribersOptions],
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
            onChange: e => updateSelectedVals(e, setSubscriberToUpdateSubscribedShowIDs),
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

    return (
        <div>
            <Form title={ updateSubscriberFormTitle } inputs={ updateSubscriberFormInputs } onSubmit={ updateSubscriber }/>
            <RespModal modalIsOpen={ respModalIsOpen } setModalIsOpenFn={ setRespModalIsOpen } modalMsg={ respModalMsg }></RespModal>      
        </div>
    )
}
