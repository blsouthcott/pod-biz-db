import React, { useState } from 'react';
import Form from '../../../Form';
import { backendURL } from '../../../../constants/backendURL';
import { getEntityData } from '../../../../utils/entityData';
import { dataToObj } from '../../../../utils/displayDataUtils';
import { episodesToArrays } from '../../../../utils/displayDataUtils';
import RespModal from '../../../Modal';


export default function SearchEpisodesForm ({ setDisplaySearched, setLocalEpisodesDisplayData }) {

    const [episodeTitleSearchTerm, setEpisodeTitleSearchTerm] = useState('');
    const [episodeHostNameSearchTerm, setEpisodeHostNameSearchTerm] = useState('');

    const clearSearchForm = () => {
        setEpisodeTitleSearchTerm('');
        setEpisodeHostNameSearchTerm('');
    };

    const searchForEpisode = async (e) => {
        // call to backend to search for episodes by episode title or name of host
        e.preventDefault();
        let url;
        if (episodeTitleSearchTerm !== '' && episodeHostNameSearchTerm !== '') {
            url = `${backendURL}/episodes?episodeTitle=${episodeTitleSearchTerm}&hostName=${episodeHostNameSearchTerm}`;
        } else if (episodeTitleSearchTerm !== '') {
            url = `${backendURL}/episodes?episodeTitle=${episodeTitleSearchTerm}`;
        } else {
            url = `${backendURL}/episodes?hostName=${episodeHostNameSearchTerm}`;
        }
        const [
            searchResp,
            showsData
        ] = await Promise.all([
            fetch(url),
            getEntityData('shows')
        ]);
        const episodesData = await searchResp.json();
        if (!episodesData[0]) {
            setRespModalMsg('Search returned 0 results');
        } else {
            const showsObj = dataToObj(showsData, 'show_ID');
            setLocalEpisodesDisplayData(episodesToArrays(episodesData, showsObj));
            setDisplaySearched();
            setRespModalMsg('Search results are displayed in the table')
        };
        setRespModalIsOpen(true);
        clearSearchForm();
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

    const [respModalIsOpen, setRespModalIsOpen] = useState(false);
    const [respModalMsg, setRespModalMsg] = useState('');

    return (
        <div>
            <Form title={ searchEpisodeFormTitle } inputs={ searchEpisodeFormInputs } onSubmit={ searchForEpisode }/>
            <RespModal 
            modalIsOpen={ respModalIsOpen } 
            setModalIsOpenFn={ setRespModalIsOpen } 
            modalMsg={ respModalMsg }
            />      
        </div>
    )
}
