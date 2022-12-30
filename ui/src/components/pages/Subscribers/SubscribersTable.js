import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadAllEntityData, loadSubscribers } from "../../../store/actions/entitiesActions";
import { getDeleteEntityFn } from "../../../utils/entityData";
import Table from "../../Table";
import RespModal from "../../Modal";


export default function SubscribersTable ({ displaySearched, setDisplaySearched, localSubscribersDisplayData }) {
    console.log('Rendering Subscribers Table component...')

    const dispatch = useDispatch();

    const initialDataLoaded = useSelector(state => state.entityData.initialDataLoaded);
    if (!initialDataLoaded) {
        dispatch(loadAllEntityData());
    };

    const allSubscribersDisplayData = useSelector(state => state.entityData.subscribersDisplayData);

    const tableTitle = 'Subscribers';
    const tableHeaders = [
        'ID',
        'First Name',
        'Last Name',
        'Email Address',
        'Phone Number',
        'Age',
        'Gender',
        'Subscribed Shows'
    ]

    const [respModalIsOpen, setRespModalIsOpen] = useState(false);
    const [respModalMsg, setRespModalMsg] = useState('');

    const deleteSubscriber = getDeleteEntityFn(
        'Subscribers',
        dispatch,
        loadSubscribers, 
        setRespModalIsOpen, 
        setRespModalMsg
    );

    return (
        <div>
            <Table tableTitle={ tableTitle } tableHeaders={ tableHeaders } data={ displaySearched ? localSubscribersDisplayData : allSubscribersDisplayData } onDelete={ deleteSubscriber } setEntityFn={ loadSubscribers }/>            
            <button className={ 'reset-table' } onClick={ setDisplaySearched }>Reset Table</button>
            <RespModal modalIsOpen={ respModalIsOpen } setModalIsOpenFn={ setRespModalIsOpen } modalMsg={ respModalMsg }></RespModal>      
        </div>
    )
}
