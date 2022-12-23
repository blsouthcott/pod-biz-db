import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Form from '../Form';
import Table from '../Table';
import { createEntity, getDeleteEntityFn } from '../../utils/entityData';
import * as formConstants from '../../constants/form_strings';
import RespModal from '../Modal';
import Accordion from '../Accordion';
import { loadStreams, loadAllEntityData } from '../../store/actions/entitiesActions';


export default function Streams () {

    const dispatch = useDispatch();

    const initialDataLoaded = useSelector(state => state.entityData.initialDataLoaded);
    if (!initialDataLoaded) {
        dispatch(loadAllEntityData());
    };

    const streamsData = useSelector(state => state.entityData.streamsData);
    const streamsDisplayData = useSelector(state => state.entityData.streamsDisplayData);
    const episodesOptions = useSelector(state => state.entityData.episodesOptions);
    const subscribersOptions = useSelector(state => state.entityData.subscribersOptions);

    // ****************
    // Load data to be displayed in shows table
    // ****************
    const tableTitle = 'Streams';
    const tableHeaders = [
        'ID',
        'Subscriber ID',
        'Episode ID',
        'Time Streamed'
    ]

    // ****************
    // Define add new stream form
    // ****************
    const [newStreamSubscriberID, setNewStreamSubscriberID] = useState('');
    const [newStreamEpisodeID, setNewStreamEpisodeID] = useState('');
    const [newStreamTimeStreamed, setNewStreamTimeStreamed] = useState('');

    const addNewStream = async (e) => {
        e.preventDefault();
        const newStream = { newStreamSubscriberID, newStreamEpisodeID, newStreamTimeStreamed };
        const respStatus = await createEntity('streams', newStream);
        setRespModalIsOpen(true);
        if (respStatus === 201) {
            setRespModalMsg(`Success! A new stream with for episode: ${newStreamEpisodeID}, has been added to the database.`);
            for (let fn of [setNewStreamSubscriberID, setNewStreamTimeStreamed, setNewStreamEpisodeID]) {
                fn('');
            }
            dispatch(loadStreams());
        } else {
            setRespModalMsg(`Unable to add new stream to the database. Error status: ${respStatus}. Please try again later.`);
        };  
    };

    const addNewStreamFormTitle = formConstants.REQUIRED_FIELD_INSTR;
    const addNewStreamFormInputs = [
        {
            type: 'select',
            id: 'new-stream-subscriber-id',
            value: newStreamSubscriberID,
            onChange: e => setNewStreamSubscriberID(e.target.value),
            options: [...[{}], ...subscribersOptions],
            labelText: formConstants.REQUIRED_FIELD_INDICATOR + 'Subscriber ID: ',
            inputIsRequired: true
        },
        {
            type: 'select',
            id: 'new-stream-episode-id',
            value: newStreamEpisodeID,
            onChange: e => setNewStreamEpisodeID(e.target.value),
            options: [...[{}], ...episodesOptions],
            labelText: formConstants.REQUIRED_FIELD_INDICATOR + 'Episode ID: ',
            inputIsRequired: true
        },
        {
            type: 'datetime-local',
            id: 'new-stream-time-streamed',
            value: newStreamTimeStreamed,
            placeholder: 'Time Streamed',
            onChange: e => setNewStreamTimeStreamed(e.target.value),
            labelText: formConstants.REQUIRED_FIELD_INDICATOR + 'Time Streamed',
            inputIsRequired: true
        },
        {
            type: 'submit',
            id: 'add-new-stream-submit',
            value: 'Add New Stream'
        }
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

    // useEffect(() => {
    //     loadStreams()
    // },
    // []);

    // useEffect(() => {
    //     loadSubscribersOptions()
    // },
    // []);    

    // useEffect(() => {
    //     loadEpisodesOptions()
    // },
    // []); 

    return (
        <div>
            <Table tableTitle={ tableTitle } tableHeaders={ tableHeaders } data={ streamsDisplayData } onDelete={ deleteStream } setEntityFn={ loadStreams }/>
            <Accordion
                title={'Add New Stream'}
                content={
                    <Form title={ addNewStreamFormTitle } inputs={ addNewStreamFormInputs } onSubmit={ addNewStream }/>
                }
            />
            <RespModal modalIsOpen={ respModalIsOpen } setModalIsOpenFn={ setRespModalIsOpen } modalMsg={ respModalMsg }></RespModal>
        </div>
    )
}
