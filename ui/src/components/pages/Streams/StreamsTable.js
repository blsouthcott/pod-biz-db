import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadAllEntityData, loadStreams } from "../../../store/actions/entitiesActions";
import { getDeleteEntityFn } from "../../../utils/entityData";
import Table from "../../Table";
import RespModal from "../../Modal";


export default function StreamsTable () {
    console.log('Rendering Streams Table component...')

    const dispatch = useDispatch();

    const initialDataLoaded = useSelector(state => state.entityData.initialDataLoaded);
    // if (!initialDataLoaded) {
    //     dispatch(loadAllEntityData());
    // };

    const streamsDisplayData = useSelector(state => state.entityData.streamsDisplayData);

    const tableTitle = 'Streams';
    const tableHeaders = [
        'ID',
        'Subscriber',
        'Episode',
        'Time Streamed'
    ]

    const [respModalIsOpen, setRespModalIsOpen] = useState(false);
    const [respModalMsg, setRespModalMsg] = useState('');

    const deleteStream = getDeleteEntityFn(
        'Streams', 
        dispatch,
        loadStreams, 
        setRespModalIsOpen, 
        setRespModalMsg
    );

    useEffect(() => {
        console.log('Running useEffect on Streams Table...')
        console.log('initialDataLoaded: ', initialDataLoaded)
        if (!initialDataLoaded) {
            dispatch(loadAllEntityData());
        }
    }, [])

    return (
        <div>
            <Table tableTitle={ tableTitle } tableHeaders={ tableHeaders } data={ streamsDisplayData } onDelete={ deleteStream } setEntityFn={ loadStreams }/>
            <RespModal modalIsOpen={ respModalIsOpen } setModalIsOpenFn={ setRespModalIsOpen } modalMsg={ respModalMsg }></RespModal>
        </div>
    )
}
