import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createEntity } from "../../../../utils/entityData";
import { loadHosts } from "../../../../store/actions/entitiesActions";
import * as formConstants from '../../../../constants/form_strings';
import { updateSelectedVals } from "../../../../utils/selectMultiple";
import Form from "../../../Form";
import RespModal from "../../../Modal";


export default function AddHostForm () {

    const dispatch = useDispatch();

    const showsOptions = useSelector(state => state.entityData.showsOptions);
    const hostsDisplayData = useSelector(state => state.entityData.hostsDisplayData);

    const [newHostFirstName, setNewHostFirstName] = useState('');
    const [newHostLastName, setNewHostLastName] = useState('');
    const [newHostEmail, setNewHostEmail] = useState('');
    const [newHostPhone, setNewHostPhone] = useState('');
    const [newHostShowIDs, setNewHostShowIDs] = useState([]);

    const addNewHost = async (e) => {
        e.preventDefault();
        const newHost = { newHostFirstName, newHostLastName, newHostEmail, newHostPhone, newHostShowIDs };
        newHost.newHostPhone = newHost.newHostPhone === '' ? undefined : newHost.newHostPhone;
        console.log('new host: ', newHost)
        const respStatus = await createEntity('hosts', newHost);
        if (respStatus === 201) {
            setRespModalMsg(`Success! A new Host with name: ${newHostFirstName} ${newHostLastName} has been added to the database.`);
            setIsSuccessResp(true);
            setRespModalIsOpen(true);
            for (let fn of [setNewHostFirstName, setNewHostLastName, setNewHostEmail, setNewHostPhone, setNewHostShowIDs]) {
                fn('');
            };
            dispatch(loadHosts());
        } else {
            setRespModalMsg(`Unable to add new host to the database. Error status ${respStatus}Please try again later.`);
            setIsSuccessResp(false);
            setRespModalIsOpen(true);
        };
    };

    const addNewHostsFormTitle = formConstants.REQUIRED_FIELD_INSTR;
    const addNewHostsFormInputs = [
        {
            type: 'text',
            id: 'new-host-first-name',
            value: newHostFirstName,
            placeholder: 'Host First Name',
            onChange: e => setNewHostFirstName(e.target.value),
            labelText: formConstants.REQUIRED_FIELD_INDICATOR + 'First Name: ',
            inputIsRequired: true
        },
        {
            type: 'text',
            id: 'new-host-last-name',
            value: newHostLastName,
            placeholder: 'Host Last Name',
            onChange: e => setNewHostLastName(e.target.value),
            labelText: formConstants.REQUIRED_FIELD_INDICATOR + 'Last Name: ',
            inputIsRequired: true
        },
        {
            type: 'select',
            id: 'new-host-show-id',
            multiple: true,
            value: newHostShowIDs,
            onChange: e => updateSelectedVals(e, setNewHostShowIDs),
            options: showsOptions,
            labelText: 'Hosted Shows ' + formConstants.MULTI_SELECT_INSTR + ':',
            inputIsRequired: false
        },
        {
            type: 'text',
            id: 'new-host-email',
            value: newHostEmail,
            placeholder: 'Host Email',
            onChange: e => setNewHostEmail(e.target.value),
            labelText: formConstants.REQUIRED_FIELD_INDICATOR + 'Email Address: ',
            inputIsRequired: true
        },
        {
            type: 'text',
            id: 'new-host-phone',
            value: newHostPhone,
            placeholder: 'Host Phone #',
            onChange: e => setNewHostPhone(e.target.value),
            labelText: 'Phone #: ',
            inputIsRequired: false
        },
        {
            type: 'submit',
            id: 'add-new-host-submit',
            value: 'Add New Host'
        }
    ]

    const [respModalIsOpen, setRespModalIsOpen] = useState(false);
    const [respModalMsg, setRespModalMsg] = useState('');
    const [isSuccessResp, setIsSuccessResp] = useState();

    return (
        <div>
            <Form title={ addNewHostsFormTitle } inputs={ addNewHostsFormInputs } onSubmit={ addNewHost }/>
            <RespModal 
            modalIsOpen={ respModalIsOpen } 
            setModalIsOpenFn={ setRespModalIsOpen } 
            modalMsg={ respModalMsg }
            isSuccessResp={ isSuccessResp }
            respType={ 'create' }
            entityDisplayData={ hostsDisplayData }
            />
        </div>
    )
}
