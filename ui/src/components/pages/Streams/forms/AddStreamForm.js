import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createEntity } from "../../../../utils/entityData";
import { loadStreams } from "../../../../store/actions/entitiesActions";
import * as formConstants from '../../../../constants/form_strings';
import Form from "../../../Form";
import RespModal from "../../../Modal";


export default function AddStreamForm () {

    const dispatch = useDispatch();

    const subscribersOptions = useSelector(state => state.entityData.subscribersOptions);
    const episodesOptions = useSelector(state => state.entityData.episodesOptions);

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

    return (
        <div>
            <Form title={ addNewStreamFormTitle } inputs={ addNewStreamFormInputs } onSubmit={ addNewStream }/>
            <RespModal modalIsOpen={ respModalIsOpen } setModalIsOpenFn={ setRespModalIsOpen } modalMsg={ respModalMsg }></RespModal>
        </div>
    )
}
