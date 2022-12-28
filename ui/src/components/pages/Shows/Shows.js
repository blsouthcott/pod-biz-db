import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Table from '../../Table';
import Form from '../../Form';
import { createEntity, getDeleteEntityFn } from '../../../utils/entityData';
import * as formConstants from '../../../constants/form_strings';
import RespModal from '../../Modal';
import Accordion from '../../Accordion';
import { loadAllEntityData, loadShows } from '../../../store/actions/entitiesActions';


export default function Shows () {
    console.log('Rendering Shows component...')

    const dispatch = useDispatch();
    const initialDataLoaded = useSelector(state => state.entityData.initialDataLoaded);
    if (!initialDataLoaded) {
        dispatch(loadAllEntityData());
    };
    const showsDisplayData = useSelector(state => state.entityData.showsDisplayData);
    console.log('shows display data: ', showsDisplayData)
    
    // ****************
    // Load data to be displayed in shows table
    // ****************
    const tableTitle = 'Shows'
    const tableHeaders = [
        'ID',
        'Title'
    ]

    // const [shows, setShows] = useState([]);
    // const loadShows = async () => {
    //     // get shows data from mysql database
    //     let showsData = await getEntityData('shows');
    //     // transform data into ordered array
    //     let showsAsArrays = []
    //     for (let cnt=0; cnt<showsData.length; cnt++) {
    //         let { show_ID, title } = showsData[cnt];
    //         showsAsArrays.push([show_ID, title])
    //     }
    //     console.log(JSON.stringify(showsAsArrays));
    //     setShows(showsAsArrays);
    // };

    // ****************
    // Define new show form
    // ****************
    const [newShowTitle, setNewShowTitle] = useState('');

    const addNewShow = async (e) => {
        e.preventDefault();
        const newShow = { newShowTitle };
        const respStatus = await createEntity('shows', newShow);
        // reload data to be displayed in table to reflect newly added data
        if (respStatus === 201) {
            setRespModalMsg(`Success! A new show with title: ${newShowTitle}, has been added to the database.`);
            setRespModalIsOpen(true);
            setNewShowTitle('');
            dispatch(loadShows());
        } else {
            setRespModalMsg(`Unable to add new show to the database. Error status: ${respStatus}. Please try again later.`);
            setRespModalIsOpen(true);
        };
    };

    const addNewShowFormTitle = formConstants.REQUIRED_FIELD_INSTR;
    const addNewShowFormInputs = [
        {
            type: 'text',
            id: 'new-show-title',
            value: newShowTitle,
            placeholder: 'Show Title',
            onChange: e => setNewShowTitle(e.target.value),
            labelText: formConstants.REQUIRED_FIELD_INDICATOR + 'Show Title: ',
            inputIsRequired: true
        },
        {
            type: 'submit',
            id: 'add-new-show-submit',
            value: 'Add New Show'
        }
    ]

    const [respModalIsOpen, setRespModalIsOpen] = useState(false);
    const [respModalMsg, setRespModalMsg] = useState('');

    const deleteShow = getDeleteEntityFn('Shows', dispatch, loadShows, setRespModalIsOpen, setRespModalMsg);

    // useEffect(() => {
    //     showsLoaded()
    // },
    // []);

    return (
        <div>
            <Table tableTitle={ tableTitle } tableHeaders={ tableHeaders } data={ showsDisplayData } onDelete={ deleteShow } setEntityFn={ loadShows }/>
            <Accordion
                title={'Add New Show'}
                content={
                    <Form title={ addNewShowFormTitle } inputs={ addNewShowFormInputs } onSubmit={ addNewShow }/>
                }
            />
            <RespModal modalIsOpen={ respModalIsOpen } setModalIsOpenFn={ setRespModalIsOpen } modalMsg={ respModalMsg }></RespModal>
        </div>
    )
}
