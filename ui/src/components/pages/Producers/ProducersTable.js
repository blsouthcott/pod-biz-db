import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import RespModal from '../../Modal';
import { getDeleteEntityFn } from '../../../utils/entityData';
import { loadProducers, loadAllEntityData } from '../../../store/actions/entitiesActions';
import Table from '../../Table';


export default function ProducersTable () {
    console.log('Rendering Producers Table component...')

    const dispatch = useDispatch();

    const initialDataLoaded = useSelector(state => state.entityData.initialDataLoaded);
    // if (!initialDataLoaded) {
    //     dispatch(loadAllEntityData());
    // };

    const producersDisplayData = useSelector(state => state.entityData.producersDisplayData);

    const tableTitle = 'Producers';
    const tableHeaders = [
        'ID',
        'First Name',
        'Last Name',
        'Email Address',
        'Phone Number',
        'Show ID'
    ]

    const [respModalIsOpen, setRespModalIsOpen] = useState(false);
    const [respModalMsg, setRespModalMsg] = useState('');

    const deleteProducer = getDeleteEntityFn(
        'Producers',
        dispatch,
        loadProducers, 
        setRespModalIsOpen, 
        setRespModalMsg
    );

    useEffect(() => {
        console.log('Running useEffect on Producers Table...')
        console.log('initialDataLoaded: ', initialDataLoaded)
        if (!initialDataLoaded) {
            dispatch(loadAllEntityData());
        }
    }, [])

    return (
        <div>
            <Table tableTitle={ tableTitle } tableHeaders={ tableHeaders } data={ producersDisplayData } onDelete={ deleteProducer } setEntityFn={ loadProducers }/>
            <RespModal modalIsOpen={ respModalIsOpen } setModalIsOpenFn={ setRespModalIsOpen } modalMsg={ respModalMsg }></RespModal>
        </div>
        )
}
