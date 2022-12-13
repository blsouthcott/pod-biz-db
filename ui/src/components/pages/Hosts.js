
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Table from '../Table';
import Form from '../Form';
import { createEntity, getDeleteEntityFn, getEntityData, getShowsAsOptions, updateEntityData } from '../../utils/entityData';
import { updateSelectedVals } from '../../utils/selectMultiple';
import * as formConstants from '../../constants/form_strings';
import formatShowIDs from '../../utils/displayShowIDs';
import RespModal from '../Modal';
import Accordion from '../Accordion';


export default function Hosts () {

    const dispatch = useDispatch();

    // ****************
    // Load data to be displayed in table
    // ****************
    const tableTitle = 'Hosts';
    const tableHeaders = [
        'ID',
        'First Name',
        'Last Name',
        'Email Address',
        'Phone Number',
        'Hosted Shows'
    ]

    const [hosts, setHosts] = useState([]);
    const loadHosts = async () => {
        // get hosts data from mysql db
        let hostsData = await getEntityData('hosts');
        // transform data into ordered array
        let hostsAsArrays = []
        for (let cnt=0; cnt<hostsData.length; cnt++) {
            let { host_ID, first_name, last_name, email_address, phone_number, show_ID } = hostsData[cnt];
            hostsAsArrays.push([host_ID, first_name, last_name, email_address, phone_number, show_ID === null ? [show_ID] : show_ID.length > 1 ? show_ID : [show_ID]]);
        }
        setHosts(hostsAsArrays);
    }

    // load options for shows host might host
    const [showsOptions, setShowsOptions] = useState([]);
    const loadShowsOptions = async () => {
        const showsAsOptions = await getShowsAsOptions(true);
        setShowsOptions(showsAsOptions);
    }

    // ****************
    // Define add new host form
    // ****************
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
            setRespModalIsOpen(true);
            for (let fn of [setNewHostFirstName, setNewHostLastName, setNewHostEmail, setNewHostPhone, setNewHostShowIDs]) {
                fn('');
            };
            await loadHosts();
        } else {
            setRespModalMsg(`Unable to add new host to the database. Error status ${respStatus}Please try again later.`);
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

    // ****************
    // Define update host form
    // ****************
    const [hostToUpdateID, setHostToUpdateID] = useState('');
    const [hostToUpdateFirstName, setHostToUpdateFirstName] = useState('');
    const [hostToUpdateLastName, setHostToUpdateLastName] = useState('');
    const [hostToUpdateEmail, setHostToUpdateEmail] = useState('');
    const [hostToUpdatePhone, setHostToUpdatePhone] = useState('');
    const [hostToUpdateShowIDs, setHostToUpdateShowIDs] = useState([]);

    const fillHostToUpdateData = (e) => {
        // once we get the backend up and running, search for episodes data
        // based on value in episodeToUpdateID input
        setHostToUpdateID(e.target.value);
        console.log('onBlur event triggered to fill episode data');
        setHostToUpdateFirstName('');
        setHostToUpdateLastName('');
        setHostToUpdateEmail('');
        setHostToUpdatePhone('');
        setHostToUpdateShowIDs([]);
        if (e.target.value) {
            let host;
            for (let h of hosts) {
                if (h[0] == e.target.value) {
                    host = h
                };
            };
            if (host === undefined) {
                alert(`no Host associated with ID: ${e.target.value} was found in the database!`)
            } else {
                // set input field values based on episode data return by search
                setHostToUpdateFirstName(host[1]);
                setHostToUpdateLastName(host[2]);
                setHostToUpdateEmail(host[3]);
                setHostToUpdatePhone(host[4]);
                console.log('show IDs: ', host[5]);
                setHostToUpdateShowIDs(host[5]);
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
            await loadHosts();
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
            options: [...[{}], ...hosts.map((host) => {
                return {
                    text: `${host[0]}, ${host[1]} ${host[2]}`,
                    value: host[0]
                };
            })],
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

    const deleteHost = getDeleteEntityFn('Hosts', loadHosts, setRespModalIsOpen, setRespModalMsg);

    useEffect(() => {
        loadHosts()
    },
    []);
    
    useEffect(() => {
        loadShowsOptions()
    },
    []);


    return (
        <div>
            <Table tableTitle={ tableTitle } tableHeaders={ tableHeaders } data={ hosts.map(host => host.map((val, i) => i === 5 ? JSON.stringify(val) : val)) } onDelete={ deleteHost } allowDeletion={false}/>
            <Accordion
                title={'Add New Host'}
                content={
                    <Form title={ addNewHostsFormTitle } inputs={ addNewHostsFormInputs } onSubmit={ addNewHost }/>
                }
            />
            <Accordion
                title={'Update Host'}
                content={
                    <Form title={ updateHostFormTitle } inputs={ updateHostFormInputs } onSubmit={ updateHost} />
                }
            />
            <RespModal modalIsOpen={ respModalIsOpen } setModalIsOpenFn={ setRespModalIsOpen } modalMsg={ respModalMsg }></RespModal>
        </div>
    )
}
