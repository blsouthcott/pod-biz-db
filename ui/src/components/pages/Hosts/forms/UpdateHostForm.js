import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateEntityData } from "../../../../utils/entityData";
import { loadHosts } from "../../../../store/actions/entitiesActions";
import * as formConstants from '../../../../constants/form_strings';
import { updateSelectedVals } from "../../../../utils/selectMultiple";
import Form from "../../../Form";
import RespModal from "../../../Modal";
import { formatShowIDs } from "../../../../utils/displayDataUtils";


export default function UpdateHostForm () {

    const dispatch = useDispatch();

    const hostsData = useSelector(state => state.entityData.hostsData);
    const hostsOptions = useSelector(state => state.entityData.hostsOptions);
    const showsOptions = useSelector(state => state.entityData.showsOptions);

    const [hostToUpdateID, setHostToUpdateID] = useState('');
    const [hostToUpdateFirstName, setHostToUpdateFirstName] = useState('');
    const [hostToUpdateLastName, setHostToUpdateLastName] = useState('');
    const [hostToUpdateEmail, setHostToUpdateEmail] = useState('');
    const [hostToUpdatePhone, setHostToUpdatePhone] = useState('');
    const [hostToUpdateShowIDs, setHostToUpdateShowIDs] = useState([]);

    const fillHostToUpdateData = (e) => {
        setHostToUpdateID(e.target.value);
        console.log('onBlur event triggered to fill episode data');
        setHostToUpdateFirstName('');
        setHostToUpdateLastName('');
        setHostToUpdateEmail('');
        setHostToUpdatePhone('');
        setHostToUpdateShowIDs([]);
        if (e.target.value) {
            let host;
            for (let h of hostsData) {
                if (h.host_ID == e.target.value) {
                    host = h
                };
            };
            if (host === undefined) {
                setRespModalMsg(`no Host associated with ID: ${e.target.value} was found in the database!`);
                setRespModalIsOpen(true);
            } else {
                // set input field values based on episode data return by search
                setHostToUpdateFirstName(host.first_name);
                setHostToUpdateLastName(host.last_name);
                setHostToUpdateEmail(host.email_address);
                setHostToUpdatePhone(host.phone_number);
                setHostToUpdateShowIDs(formatShowIDs(host.show_ID, {toStr: false}));
            };
        }
    }
    
    const updateHost = async (e) => {
        e.preventDefault();
        const hostToUpdate = { hostToUpdateID, hostToUpdateFirstName, hostToUpdateLastName, hostToUpdateEmail, hostToUpdatePhone, hostToUpdateShowIDs };
        hostToUpdate.hostToUpdatePhone = hostToUpdate.hostToUpdatePhone === '' ? undefined : hostToUpdate.hostToUpdatePhone;
        const respStatus = await updateEntityData('hosts', hostToUpdate);
        if (respStatus === 200) {
            setRespModalMsg(`Success! Host with id: ${hostToUpdateID}, and name: ${hostToUpdateFirstName} ${hostToUpdateLastName} has been update in the database.`);
            setRespModalIsOpen(true);
            for (let fn of [setHostToUpdateID, setHostToUpdateFirstName, setHostToUpdateLastName, setHostToUpdateEmail, setHostToUpdatePhone]) {
                fn('');
            }
            setHostToUpdateShowIDs([]);
            dispatch(loadHosts());
        } else {
            setRespModalMsg(`Unable to update host in the database. Error status: ${respStatus}. Please try again later.`);
            setRespModalIsOpen(true);
        };
    };

    const updateHostFormTitle = formConstants.REQUIRED_FIELD_INSTR;
    const updateHostFormInputs = [
        {
            type: 'select',
            id: 'host-to-update-id',
            value: hostToUpdateID,
            placeholder: 'Host to update ID',
            onChange: e => fillHostToUpdateData(e),
            options: [...[{}], ...hostsOptions],
            labelText: formConstants.REQUIRED_FIELD_INDICATOR + 'Host ID: ' + formConstants.AUTO_FILL_UPDATE_FORM_INSTR,
            inputIsRequired: true
        },
        {
            type: 'text',
            id: 'host-to-update-first-name',
            value: hostToUpdateFirstName,
            placeholder: 'Host First Name',
            onChange: e => setHostToUpdateFirstName(e.target.value),
            labelText: formConstants.REQUIRED_FIELD_INDICATOR + 'First Name: ',
            inputIsRequired: true
        },
        {
            type: 'text',
            id: 'host-to-update-last-name',
            value: hostToUpdateLastName,
            placeholder: 'Host Last Name',
            onChange: e => setHostToUpdateLastName(e.target.value),
            labelText: formConstants.REQUIRED_FIELD_INDICATOR + 'Last Name: ',
            inputIsRequired: true
        },
        {
            type: 'select',
            id: 'host-to-update-show-ids',
            multiple: true,
            value: hostToUpdateShowIDs,
            onChange: e => updateSelectedVals(e, setHostToUpdateShowIDs),
            options: showsOptions,
            labelText: 'Hosted Shows ' + formConstants.MULTI_SELECT_INSTR + ':',
            inputIsRequired: false
        },
        {
            type: 'text',
            id: 'host-to-update-email',
            value: hostToUpdateEmail,
            placeholder: 'Host Email',
            onChange: e => setHostToUpdateEmail(e.target.value),
            labelText: formConstants.REQUIRED_FIELD_INDICATOR + 'Email Address: ',
            inputIsRequired: true
        },
        {
            type: 'text',
            id: 'host-to-update-phone',
            value: hostToUpdatePhone,
            placeholder: 'Host Phone #',
            onChange: e => setHostToUpdatePhone(e.target.value),
            labelText: 'Phone #: ',
            inputIsRequired: false
        },
        {
            type: 'submit',
            id: 'update-host-submit',
            value: 'Update Host'
        }
    ]

    const [respModalIsOpen, setRespModalIsOpen] = useState(false);
    const [respModalMsg, setRespModalMsg] = useState('');

    return (
        <div>
            <Form title={ updateHostFormTitle } inputs={ updateHostFormInputs } onSubmit={ updateHost} />
            <RespModal modalIsOpen={ respModalIsOpen } setModalIsOpenFn={ setRespModalIsOpen } modalMsg={ respModalMsg }></RespModal>
        </div>
    )
}
