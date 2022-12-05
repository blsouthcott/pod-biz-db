import React, { useEffect, useState } from 'react';
import Form from '../components/Form';
import Table from '../components/Table';
// import { mockStreamsData } from '../sample_data/streams';
import { createEntity, getDeleteEntityFn, getEntityData, getEpisodesAsOptions, getSubscribersAsOptions } from '../utils/entityData';
import * as formConstants from '../constants/form_strings';
import { backendURL } from '../constants/backendURL';
import RespModal from '../components/Modal';
import Accordion from '../components/Accordion';


export default function Streams () {

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

    const [streams, setStreams] = useState([]);
    const loadStreams = async () => {
        // get streams data from mysql db
        let streamsData = await getEntityData('streams');
        // transform data into ordered array
        let streamsAsArrays = []
        for (let cnt=0; cnt<streamsData.length; cnt++) {
            let { stream_ID, subscriber_ID, episode_ID, time_streamed } = streamsData[cnt];
            console.log(stream_ID, subscriber_ID, episode_ID, time_streamed)
            streamsAsArrays.push([stream_ID, subscriber_ID, episode_ID, time_streamed])
        }
        setStreams(streamsAsArrays);
    }

    // load options for subscribers that may have streamed an episdoe
    const [subscribersOptions, setSubscribersOptions] = useState([]);
    const loadSubscribersOptions = async () => {
        const subscribersAsOptions = await getSubscribersAsOptions();
        setSubscribersOptions(subscribersAsOptions);
    }

    // load options of episodes that may have been streamed
    const [episodesOptions, setEpisodesOptions] = useState([]);
    const loadEpisodesOptions = async () => {
        const episodesAsOptions = await getEpisodesAsOptions();
        setEpisodesOptions(episodesAsOptions);
    }

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
            await loadStreams();
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
            options: subscribersOptions,
            labelText: formConstants.REQUIRED_FIELD_INDICATOR + 'Subscriber ID: ',
            inputIsRequired: true
        },
        {
            type: 'select',
            id: 'new-stream-episode-id',
            value: newStreamEpisodeID,
            onChange: e => setNewStreamEpisodeID(e.target.value),
            options: episodesOptions,
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

    const deleteStream = getDeleteEntityFn('Streams', loadStreams, setRespModalIsOpen, setRespModalMsg);

    useEffect(() => {
        loadStreams()
    },
    []);

    useEffect(() => {
        loadSubscribersOptions()
    },
    []);    

    useEffect(() => {
        loadEpisodesOptions()
    },
    []); 

    return (
        <div>
            <Table tableTitle={ tableTitle } tableHeaders={ tableHeaders } data={ streams } onDelete={ deleteStream } setEntityFn={ loadStreams }/>
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
