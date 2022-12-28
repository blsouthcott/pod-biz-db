import React, { useState } from 'react';
import Form from '../../../Form';
import { backendURL } from '../../../../constants/backendURL';
import { getEntityData } from '../../../../utils/entityData';
import { dataToObj } from '../../../../utils/displayDataUtils';
import { episodesToArrays } from '../../../../utils/displayDataUtils';


export default function SearchEpisodesForm ({ setDisplaySearched, setLocalEpisodesDisplayData }) {

    const [episodeTitleSearchTerm, setEpisodeTitleSearchTerm] = useState('');
    const [episodeHostNameSearchTerm, setEpisodeHostNameSearchTerm] = useState('');

    const clearSearchForm = () => {
        setEpisodeTitleSearchTerm('');
        setEpisodeHostNameSearchTerm('');
        // scrollToTopOfTable(document);
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
        ])
        const episodesData = await searchResp.json();
        const showsObj = dataToObj(showsData, 'show_ID');
        setLocalEpisodesDisplayData(episodesToArrays(episodesData, showsObj));
        setDisplaySearched();
        clearSearchForm();
        // const tableHeader = document.getElementById('table-header-row');
        // tableHeader.scrollIntoView();
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

    return (
        <div>
            <Form title={ searchEpisodeFormTitle } inputs={ searchEpisodeFormInputs } onSubmit={ searchForEpisode }/>
        </div>
    )
}
