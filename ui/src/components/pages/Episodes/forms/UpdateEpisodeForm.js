import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateEntityData } from '../../../../utils/entityData';
import * as formConstants from '../../../../constants/form_strings';
import { loadEpisodes } from '../../../../store/actions/entitiesActions';
import RespModal from '../../../Modal';
import Form from '../../../Form';
import { formatDate } from '../../../../utils/formatDate';
import { scrollToUpdatedRow } from '../../../../utils/scrollTo';


export default function UpdateEpisodeForm () {

    const dispatch = useDispatch();
    const episodesData = useSelector(state => state.entityData.episodesData);
    const episodesDisplayData = useSelector(state => state.entityData.episodesDisplayData);
    const episodesOptions = useSelector(state => state.entityData.episodesOptions);

    const [episodeToUpdateID, setEpisodeToUpdateID] = useState(''); 
    const [episodeToUpdateTitle, setEpisodeToUpdateTitle] = useState('');
    const [episodeToUpdateSummary, setEpisodeToUpdateSummary] = useState('');
    const [episodeToUpdateDateReleased, setEpisodeToUpdateDateReleased] = useState('');

    const [updatedEpisodeID, setUpdatedEpisodeID] = useState('');

    const fillEpisodeToUpdateData = async (e) => {
        // this function is set as the onBlur event for the episode_ID input
        // it runs when the element loses focus, for example when the user tabs out
        console.log('onBlur event triggered to fill episode data');
        setEpisodeToUpdateID(e.target.value);
        setEpisodeToUpdateTitle('');
        setEpisodeToUpdateSummary('');
        setEpisodeToUpdateDateReleased('');
        if (e.target.value) {
            let episode;
            for (let ep of episodesData) {
                if (ep.episode_ID == e.target.value) {
                    episode = ep;
                }
            };
            if (episode === undefined) {
                alert(`no episode associated with ID: ${e.target.value} was found in the database!`)
            } else {
                console.log(episode);
                // set input field values based on episode data return by search
                setEpisodeToUpdateTitle(episode.title);
                setEpisodeToUpdateSummary(episode.episode_summary);
                setEpisodeToUpdateDateReleased(formatDate(episode.date_released));
            };
        }
    }

    const updateEpisode = async (e) => {
        e.preventDefault();
        const episodeToUpdate = { episodeToUpdateID, episodeToUpdateTitle, episodeToUpdateSummary, episodeToUpdateDateReleased };
        episodeToUpdate.episodeToUpdateSummary = episodeToUpdate.episodeToUpdateSummary === '' ? undefined : episodeToUpdate.episodeToUpdateSummary;
        const respStatus = await updateEntityData('episodes', episodeToUpdate);
        if (respStatus === 200) {
            setUpdatedEpisodeID(episodeToUpdateID);
            setRespModalMsg(`Success! The episode with title: ${episodeToUpdateTitle}, has been updated in the database.`);
            setRespModalIsOpen(true);
            for (let fn of [setEpisodeToUpdateID, setEpisodeToUpdateTitle, setEpisodeToUpdateSummary, setEpisodeToUpdateDateReleased]) {
                fn('');
            }
            dispatch(loadEpisodes());
            // scrollToUpdatedRow(episodesDisplayData, episodeToUpdateID, document);
        } else {
            setUpdatedEpisodeID('');
            setRespModalMsg(`Unable to update episode in the database. Error status ${respStatus} Please try again later.`);
            setRespModalIsOpen(true);
        };
    };

    const updateEpisodeFormTitle = formConstants.REQUIRED_FIELD_INSTR;
    const updateEpisodeFormInputs = [
        {
            type: 'select',
            id: 'episode-to-update-id',
            value: episodeToUpdateID,
            placeholder: 'Episode ID',
            onChange: e => fillEpisodeToUpdateData(e),
            options: [...[{}], ...episodesOptions],
            labelText: formConstants.REQUIRED_FIELD_INDICATOR + 'Episode ID: ',
            inputIsRequired: true
        },
        {
            type: 'text',
            id: 'episode-to-update-title',
            value: episodeToUpdateTitle,
            placeholder: 'Episode Title',
            onChange: e => setEpisodeToUpdateTitle(e.target.value),
            labelText: formConstants.REQUIRED_FIELD_INDICATOR + 'Episode Title: ',
            inputIsRequired: true
        },
        {
            type: 'textarea',
            id: 'episode-to-update-summary',
            value: episodeToUpdateSummary,
            placeholder: 'Episode Summary',
            onChange: e => setEpisodeToUpdateSummary(e.target.value),
            labelText: 'Episode Summary: ',
            inputIsRequired: false
        },
        {
            type: 'date',
            id: 'episode-to-update-release-date',
            value: episodeToUpdateDateReleased,
            placeholder: 'Date Released',
            onChange: e => setEpisodeToUpdateDateReleased(e.target.value),
            labelText: formConstants.REQUIRED_FIELD_INDICATOR + 'Episode Release Date: ',
            inputIsRequired: true
        },
        {
            type: 'submit',
            id: 'update-episode-submit',
            value: 'Update Episode'
        }
    ]

    const [respModalIsOpen, setRespModalIsOpen] = useState(false);
    const [respModalMsg, setRespModalMsg] = useState('');

    return (
        <div>
            <Form title={ updateEpisodeFormTitle } inputs={ updateEpisodeFormInputs } onSubmit={ updateEpisode }/>
            <RespModal 
            modalIsOpen={ respModalIsOpen } 
            setModalIsOpenFn={ setRespModalIsOpen } 
            modalMsg={ respModalMsg }
            respType={ 'update' }
            rowID={ updatedEpisodeID }
            entityDisplayData={ episodesDisplayData }
            />
        </div>
    )
}