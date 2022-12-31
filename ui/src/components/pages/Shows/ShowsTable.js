import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadAllEntityData, loadShows } from '../../../store/actions/entitiesActions';
import { getDeleteEntityFn } from '../../../utils/entityData';
import Table from '../../Table';
import RespModal from '../../Modal';


export default function ShowsTable () {
    console.log('Rendering Shows Tabe component...')

    const dispatch = useDispatch();
    
    const initialDataLoaded = useSelector(state => state.entityData.initialDataLoaded);
    // if (!initialDataLoaded) {
    //     dispatch(loadAllEntityData());
    // };

    const showsDisplayData = useSelector(state => state.entityData.showsDisplayData);

    const tableTitle = 'Shows'
    const tableHeaders = [
        'ID',
        'Title'
    ]

    const [respModalIsOpen, setRespModalIsOpen] = useState(false);
    const [respModalMsg, setRespModalMsg] = useState('');

    const deleteShow = getDeleteEntityFn('Shows', dispatch, loadShows, setRespModalIsOpen, setRespModalMsg);

    useEffect(() => {
        console.log('Running useEffect on Shows Table...')
        console.log('initialDataLoaded: ', initialDataLoaded)
        if (!initialDataLoaded) {
            dispatch(loadAllEntityData());
        }
    }, [])

    return (
        <div>
            <Table tableTitle={ tableTitle } tableHeaders={ tableHeaders } data={ showsDisplayData } onDelete={ deleteShow } setEntityFn={ loadShows }/>
            <RespModal modalIsOpen={ respModalIsOpen } setModalIsOpenFn={ setRespModalIsOpen } modalMsg={ respModalMsg }></RespModal>
        </div>
    )
}
