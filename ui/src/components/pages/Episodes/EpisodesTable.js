import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadAllEntityData} from "../../../store/actions/entitiesActions";
import Table from "../../Table";
import { loadEpisodes } from "../../../store/actions/entitiesActions";
import { getDeleteEntityFn } from "../../../utils/entityData";
import RespModal from "../../Modal";


export default function EpisodesTable ({ displaySearched, setDisplaySearched, localEpisodesDisplayData }) {
    console.log('Rendering Episodes Table component...')

    const dispatch = useDispatch();

    const initialDataLoaded = useSelector(state => state.entityData.initialDataLoaded);
    if (!initialDataLoaded) {
        dispatch(loadAllEntityData());
    };

    const allEpisodesDisplayData = useSelector(state => state.entityData.episodesDisplayData);

    const tableTitle = 'Episodes';
    const tableHeaders = [
        'ID',
        'Show',
        'Title',
        'Episode Summary',
        'Date Released',
        'Hosts'
    ]

    const [respModalIsOpen, setRespModalIsOpen] = useState(false);
    const [respModalMsg, setRespModalMsg] = useState('');

    const deleteEpisode = getDeleteEntityFn(
        'Episodes', 
        dispatch, 
        loadEpisodes,
        setRespModalIsOpen, 
        setRespModalMsg
    );

    return (
        <div>
            <Table tableTitle={ tableTitle } tableHeaders={ tableHeaders } data={ displaySearched ? localEpisodesDisplayData : allEpisodesDisplayData } onDelete={ deleteEpisode } setEntityFn={ loadEpisodes }/>
            <button className={ 'reset-table' } onClick={ setDisplaySearched }>Reset Table</button>
            <RespModal modalIsOpen={ respModalIsOpen } setModalIsOpenFn={ setRespModalIsOpen } modalMsg={ respModalMsg }></RespModal>
        </div>
    )

}
