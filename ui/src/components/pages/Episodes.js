import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Table from '../Table';
import Form from '../Form';
import { createEntity, updateEntityData, getEntityData, getShowsAsOptions, getDeleteEntityFn } from '../../utils/entityData';
import * as formConstants from '../../constants/form_strings';
import { formatDate } from '../../utils/formatDate'
import { backendURL } from '../../constants/backendURL';
import RespModal from '../Modal';
import Accordion from '../Accordion';
import { episodesToArrays } from '../../utils/setDisplayData';
import { loadEpisodes, loadAllEntityData } from '../../store/actions/entitiesActions';



export default function Episodes () {

    const dispatch = useDispatch();
    const initialDataLoaded = useSelector(state => state.entityData.initialDataLoaded);
    if (!initialDataLoaded) {
        dispatch(loadAllEntityData());
    };
    const allEpisodesDisplayData = useSelector(state => state.entityData.episodesDisplayData);
    const showsOptions = useSelector(state => state.entityData.showsOptions);
    const episodesOptions = useSelector(state => state.entityData.episodesOptions);

    const [localEpisodesDisplayData, setLocalEpisodesDisplayData] = useState(allEpisodesDisplayData);

    // const episodesToArrays = (episodesData) => {
    //     let episodesAsArrays = []
    //     for (let cnt=0; cnt<episodesData.length; cnt++) {
    //         let { episode_ID, show_ID, title, episode_summary, date_released, hosts_names } = episodesData[cnt];
    //         hosts_names = hosts_names.split(',').join(', ');
    //         console.log(episode_ID, show_ID, title, episode_summary, date_released, hosts_names);
    //         episodesAsArrays.push([episode_ID, show_ID, title, episode_summary, date_released, hosts_names]);
    //     }
    //     setEpisodes(episodesAsArrays);
    // };

    // ****************
    // Load data to be displayed in table
    // ****************
    const tableTitle = 'Episodes';
    const tableHeaders = [
        'ID',
        'Show ID',
        'Title',
        'Episode Summary',
        'Date Released',
        'Hosts'
    ]

    // const [episodes, setEpisodes] = useState([]);
    // const loadEpisodes = async () => {
    //     // get episodes data from MySQL database
    //     const episodesData = await getEntityData('episodes');
    //     // transform data into ordered array
    //     episodesToArrays(episodesData, setEpisodes);
    // }

    
    // load shows to be used in select menu for which show an episode is associated with
    // const [showsOptions, setShowsOptions] = useState([]);
    // const loadShowsOptions = async () => {
    //     const showsAsOptions = await getShowsAsOptions(false);
    //     setShowsOptions(showsAsOptions);
    // }

    // ****************
    // Define episode search form
    // ****************
    const [episodeTitleSearchTerm, setEpisodeTitleSearchTerm] = useState('');
    const [episodeHostNameSearchTerm, setEpisodeHostNameSearchTerm] = useState('');

    const clearSearchForm = () => {
        setEpisodeTitleSearchTerm('');
        setEpisodeHostNameSearchTerm('');
    };

    const searchForEpisode = async (e) => {
        // make call to backend here to search by episode name
        e.preventDefault();
        // alert(`Searching for episodes with ${episodeTitleSearchTerm} as the title and/or hosted by: ${episodeHostNameSearchTerm}`);
        setEpisodeTitleSearchTerm(episodeTitleSearchTerm === '' ? undefined : episodeTitleSearchTerm);
        setEpisodeHostNameSearchTerm(episodeHostNameSearchTerm === '' ? undefined : episodeHostNameSearchTerm);
        let url;
        if (episodeTitleSearchTerm !== undefined && episodeHostNameSearchTerm !== undefined) {
            url = `${backendURL}/episodes?episodeTitle=${episodeTitleSearchTerm}&hostName=${episodeHostNameSearchTerm}`;
        } else if (episodeTitleSearchTerm !== undefined) {
            url = `${backendURL}/episodes?episodeTitle=${episodeTitleSearchTerm}`;
        } else {
            url = `${backendURL}/episodes?hostName=${episodeHostNameSearchTerm}`;
        }
        const resp = await fetch(url);
        const episodesData = await resp.json();
        // console.log('episode search returned: ' + JSON.stringify(episodesData));
        setLocalEpisodesDisplayData(episodesToArrays(episodesData));
    };

    const searchEpisodeFormTitle = '';
    const searchEpisodeFormInputs = [
        {
            type: 'text',
            id: 'episode-title-search-term',
            value: episodeTitleSearchTerm,
            placeholder: 'Episode Name',
            onChange: e => setEpisodeTitleSearchTerm(e.target.value),
            labelText: 'Search by Episode Name:',
            inputIsRequired: false
        },
        {
            type: 'text',
            id: 'episode-host-name-search-term',
            value: episodeHostNameSearchTerm,
            placeholder: 'Name of Episode Host',
            onChange: e => setEpisodeHostNameSearchTerm(e.target.value),
            labelText: 'Search by Host Name:',
            inputIsRequired: false
        },
        {
            type: 'submit',
            id: 'search-episode-submit',
            value: 'Search Episodes'
        }
    ]

    // ****************
    // Define add new episode form
    // ****************
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
            setRespModalMsg(`Success! A new episode for show: ${newEpisodeShowID}, with title: ${newEpisodeTitle}, has been added to the database.`);
            setRespModalIsOpen(true);
            for (let fn of [setNewEpisodeShowID, setNewEpisodeTitle, setNewEpisodeSummary, setNewEpisodeDateReleased]) {
                fn('');
            };
            await loadEpisodes();
        } else if (respStatus === 400) {
            setRespModalMsg(`No hosts are assigned to show ${newEpisodeShowID}. Please navigate to the Hosts page and update a currently existing Host or add a new Host.`);
            setRespModalIsOpen(true);
        } else {
            setRespModalMsg(`Unable to add new episode to the database. Error status: ${respStatus} Please try again later.`);
            setRespModalIsOpen(true);
        }
    };

    const addNewEpisodeFormTitle = formConstants.REQUIRED_FIELD_INSTR;
    const addNewEpisodeFormInputs = [
        {
            type: 'select',
            id: 'new-episode-show-id',
            value: newEpisodeShowID,
            onChange: e => setNewEpisodeShowID(e.target.value),
            options: showsOptions,
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
            labelText: 'Episode Summary:',
            inputIsRequired: false
        },
        {
            type: 'date',
            id: 'new-episode-release-date',
            value: newEpisodeDateReleased,
            placeholder: 'Date Released',
            onChange: e => setNewEpisodeDateReleased(e.target.value),
            labelText: formConstants.REQUIRED_FIELD_INDICATOR + 'Episode Release Date: ',
            inputIsRequired: true
        },
        {
            type: 'submit',
            id: 'add-new-episode-submit',
            value: 'Add New Episode'
        }
    ]

    // ****************
    // Define update episode form
    // ****************
    const [episodeToUpdateID, setEpisodeToUpdateID] = useState(''); 
    const [episodeToUpdateTitle, setEpisodeToUpdateTitle] = useState('');
    const [episodeToUpdateSummary, setEpisodeToUpdateSummary] = useState('');
    const [episodeToUpdateDateReleased, setEpisodeToUpdateDateReleased] = useState('');

    const fillEpisodeToUpdateData = async (e) => {
        // this function is set as the onBlur event for the episode_ID input
        // it runs when the element loses focus, for example when the user tabs out
        console.log('onBlur event triggered to fill episode data');
        setEpisodeToUpdateID(e.target.value);
        setEpisodeToUpdateTitle('');
        setEpisodeToUpdateSummary('');
        setEpisodeToUpdateDateReleased('');
        if (e.target.value) {
            const episodesData = await getEntityData('episodes');
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
            setRespModalMsg(`Success! The episode with title: ${episodeToUpdateTitle}, has been updated in the database.`);
            setRespModalIsOpen(true);
            for (let fn of [setEpisodeToUpdateID, setEpisodeToUpdateTitle, setEpisodeToUpdateSummary, setEpisodeToUpdateDateReleased]) {
                fn('');
            }
            loadEpisodes();
        } else {
            setRespModalMsg(`Unable to update episode in the database. Error status ${respStatus} Please try again later.`);
            setRespModalIsOpen(true);
        }
    };

    const updateEpisodeFormTitle = formConstants.REQUIRED_FIELD_INSTR;
    const updateEpisodeFormInputs = [
        {
            type: 'select',
            id: 'episode-to-update-id',
            value: episodeToUpdateID,
            placeholder: 'Episode ID',
            onChange: e => fillEpisodeToUpdateData(e),
            options: episodesOptions,
            labelText: formConstants.REQUIRED_FIELD_INDICATOR + 'Episode ID: ' + formConstants.AUTO_FILL_UPDATE_FORM_INSTR,
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

    const deleteEpisode = getDeleteEntityFn('Episodes', loadEpisodes, setRespModalIsOpen, setRespModalMsg);

    // useEffect(() => {
    //     loadEpisodes()
    // },
    // []);

    // useEffect(() => {
    //     loadShowsOptions()
    // },
    // []);

    return (
        <div>
            <Table tableTitle={ tableTitle } tableHeaders={ tableHeaders } data={ localEpisodesDisplayData } onDelete={ deleteEpisode } setEntityFn={ loadEpisodes }/>
            <button className={ 'reset-table' } onClick={ () => { setLocalEpisodesDisplayData(allEpisodesDisplayData); clearSearchForm(); }}>Reset Table</button>
            <Accordion 
                title={'Search Episode'} 
                content={
                    <Form title={ searchEpisodeFormTitle } inputs={ searchEpisodeFormInputs } onSubmit={ searchForEpisode }/>
                }
            />
            <Accordion
                title={'Add New Episode'}
                content={
                    <Form title={ addNewEpisodeFormTitle } inputs={ addNewEpisodeFormInputs } onSubmit={ addNewEpisode }/>
                }
            />
            <Accordion
                title={'Update Episode'}
                content={
                    <Form title={ updateEpisodeFormTitle } inputs={ updateEpisodeFormInputs } onSubmit={ updateEpisode }/>
                }
            />
            <RespModal modalIsOpen={ respModalIsOpen } setModalIsOpenFn={ setRespModalIsOpen } modalMsg={ respModalMsg }></RespModal>
        </div>
    )
};
