import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { loadAllEntityData } from '../../../store/actions/entitiesActions';
import { loadHosts } from '../../../store/actions/entitiesActions';
import { getDeleteEntityFn } from '../../../utils/entityData';
import Table from '../../Table';
import RespModal from '../../Modal';


export default function HostsTable () {
    console.log('Rendering Hosts Table component...')

    const dispatch = useDispatch();

    const initialDataLoaded = useSelector(state => state.entityData.initialDataLoaded);
    if (!initialDataLoaded) {
        dispatch(loadAllEntityData());
    };

    const hostsDisplayData = useSelector(state => state.entityData.hostsDisplayData);

    const allHostsDisplayData = useSelector(state => state.entityData.hostsDisplayData);

    const tableTitle = 'Hosts';
    const tableHeaders = [
        'ID',
        'First Name',
        'Last Name',
        'Email Address',
        'Phone Number',
        'Hosted Shows'
    ]

    const [respModalIsOpen, setRespModalIsOpen] = useState(false);
    const [respModalMsg, setRespModalMsg] = useState('');

    const deleteHost = getDeleteEntityFn(
        'Hosts',
        dispatch,
        loadHosts, 
        setRespModalIsOpen, 
        setRespModalMsg
    );

    return (
        <div>
            <Table tableTitle={ tableTitle } tableHeaders={ tableHeaders } data={ hostsDisplayData } onDelete={ deleteHost } allowDeletion={ true }/>
            <RespModal modalIsOpen={ respModalIsOpen } setModalIsOpenFn={ setRespModalIsOpen } modalMsg={ respModalMsg }></RespModal>
        </div>

    )
}
