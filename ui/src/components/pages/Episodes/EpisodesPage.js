import React, { useEffect, useState, useReducer } from 'react';
import Accordion from '../../Accordion';
import AddEpisodeForm from './forms/AddEpisodeForm';
import UpdateEpisodeForm from './forms/UpdateEpisodeForm';
import SearchEpisodesForm from './forms/SearchEpisodesForm';
import EpisodesTable from './EpisodesTable';


export default function Episodes () {
    console.log('Rendering Episodes page component...')

    const [displaySearched, setDisplaySearched] = useReducer(displaySearched => !displaySearched, false);
    const [localEpisodesDisplayData, setLocalEpisodesDisplayData] = useState([]);

    return (
        <div>
            <EpisodesTable displaySearched={displaySearched} setDisplaySearched={setDisplaySearched} localEpisodesDisplayData={localEpisodesDisplayData}/>
            <Accordion
                title={'Search Episode'}
                content={<SearchEpisodesForm setDisplaySearched={ setDisplaySearched } setLocalEpisodesDisplayData={ setLocalEpisodesDisplayData }/>}
            />
            <Accordion
                title={'Add New Episode'}
                content={<AddEpisodeForm/>}
            />
            <Accordion
                title={'Update Episode'}
                content={<UpdateEpisodeForm/>}
            />
        </div>
    )
};
