import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createEntity } from '../../../../utils/entityData';
import * as formConstants from '../../../../constants/form_strings';
import { loadEpisodes } from '../../../../store/actions/entitiesActions';
import RespModal from '../../../Modal';
import Form from '../../../Form';
import { scrollToTableBottom } from '../../../../utils/scrollTo';


export default function AddEpisodeForm () {

    const dispatch = useDispatch();
    const showsOptions = useSelector(state => state.entityData.showsOptions);
    const episodesDisplayData = useSelector(state => state.entityData.episodesDisplayData);

    const [newEpisodeShowID, setNewEpisodeShowID] = useState('');
    const [newEpisodeTitle, setNewEpisodeTitle] = useState('');
    const [newEpisodeSummary, setNewEpisodeSummary] = useState('');
    const [newEpisodeDateReleased, setNewEpisodeDateReleased] = useState('');

    const addNewEpisode = async (e) => {
        e.preventDefault();
        const newEpisode = { newEpisodeShowID, newEpisodeTitle, newEpisodeSummary, newEpisodeDateReleased };
        newEpisode.newEpisodeSummary = newEpisode.newEpisodeSummary === '' ? undefined : newEpisode.newEpisodeSummary;
        const respStatus = await createEntity('episodes', newEpisode);
        if (respStatus === 201) {
            dispatch(loadEpisodes());
            setRespModalMsg(`Success! A new episode for show: ${newEpisodeShowID}, with title: ${newEpisodeTitle}, has been added to the database.`);
            setRespModalIsOpen(true);
            for (let fn of [setNewEpisodeShowID, setNewEpisodeTitle, setNewEpisodeSummary, setNewEpisodeDateReleased]) {
                fn('');
            };
            // scrollToTableBottom();
        } else if (respStatus === 400) {
            setRespModalMsg(`No hosts are assigned to show ${newEpisodeShowID}. Please navigate to the Hosts page and update a currently existing Host or add a new Host.`);
            setRespModalIsOpen(true);
        } else {
            setRespModalMsg(`Unable to add new episode to the database. Error status: ${respStatus} Please try again later.`);
            setRespModalIsOpen(true);
        }
    };

    const formTitle = formConstants.REQUIRED_FIELD_INSTR;
    const addNewEpisodeFormInputs = [
        {
            type: 'select',
            id: 'new-episode-show-id',
            value: newEpisodeShowID,
            onChange: e => setNewEpisodeShowID(e.target.value),
            options: [...[{}], ...showsOptions],
            labelText: formConstants.REQUIRED_FIELD_INDICATOR + 'Show ID: ',
            inputIsRequired: true
        },
        {
            type: 'text',
            id: 'new-episode-title',
            value: newEpisodeTitle,
            placeholder: 'Episode Title',
            onChange: e => setNewEpisodeTitle(e.target.value),
            labelText: formConstants.REQUIRED_FIELD_INDICATOR + 'Episode Title: ',
            inputIsRequired: true
        },
        {
            type: 'textarea',
            id: 'new-episode-summary',
            value: newEpisodeSummary,
            placeholder: 'Episode Summary',
            onChange: e => setNewEpisodeSummary(e.target.value),
            label: 'Episode Summary:',
            inputIsRequired: false
        },
        {
            type: 'date',
            id: 'new-episode-release-date',
            value: newEpisodeDateReleased,
            placeholder: 'Date Released',
            onChange: e => setNewEpisodeDateReleased(e.target.value),
            label: formConstants.REQUIRED_FIELD_INDICATOR + 'Episode Release Date: ',
            inputIsRequired: true
        },
        {
            type: 'submit',
            id: 'add-new-episode-submit',
            value: 'Add New Episode'
        }
    ]

    const [respModalIsOpen, setRespModalIsOpen] = useState(false);
    const [respModalMsg, setRespModalMsg] = useState('');

    return (
        <div>
            <Form title={ formTitle } inputs={ addNewEpisodeFormInputs } onSubmit={ addNewEpisode }></Form>
            <RespModal 
            modalIsOpen={ respModalIsOpen } 
            setModalIsOpenFn={ setRespModalIsOpen } 
            modalMsg={ respModalMsg } 
            respType={ 'create' }
            entityDisplayData={ episodesDisplayData }
            />
        </div>
    )
}
