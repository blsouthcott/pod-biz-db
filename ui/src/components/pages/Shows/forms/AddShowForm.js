import React, { useState } from "react";
import { createEntity } from "../../../../utils/entityData";
import { useDispatch, useSelector } from "react-redux";
import { loadShows } from "../../../../store/actions/entitiesActions";
import * as formConstants from '../../../../constants/form_strings';
import Form from "../../../Form";
import RespModal from "../../../Modal";


export default function AddShowForm () {

    const dispatch = useDispatch();

    const showsDisplayData = useSelector(state => state.entityData.showsDisplayData);
    
    const [newShowTitle, setNewShowTitle] = useState('');

    const addNewShow = async (e) => {
        e.preventDefault();
        const newShow = { newShowTitle };
        const respStatus = await createEntity('shows', newShow);
        if (respStatus === 201) {
            setRespModalMsg(`Success! A new show with title: ${newShowTitle}, has been added to the database.`);
            setIsSuccessResp(true);
            setNewShowTitle('');
            dispatch(loadShows());
        } else {
            setRespModalMsg(`Unable to add new show to the database. Error status: ${respStatus}. Please try again later.`);
            setIsSuccessResp(false);
        };
        setRespModalIsOpen(true);
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
    const [isSuccessResp, setIsSuccessResp] = useState();
    
    return (
        <div>
            <Form title={ addNewShowFormTitle } inputs={ addNewShowFormInputs } onSubmit={ addNewShow }/>
            <RespModal 
            modalIsOpen={ respModalIsOpen } 
            setModalIsOpenFn={ setRespModalIsOpen }
            modalMsg={ respModalMsg }
            isSuccessResp={ isSuccessResp }
            respType={ 'create' }
            entityDisplayData={ showsDisplayData }
            />
        </div>
    )
}
