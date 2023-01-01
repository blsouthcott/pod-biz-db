// this code is derived from: https://dev.to/bhuma08/react-using-modal-in-functional-components-3po2

import React, { useState } from 'react';
import Modal from 'react-modal';
import { useSelector } from 'react-redux';
import { scrollToTableBottom, scrollToUpdatedRow } from '../utils/scrollTo';


const customStyles = {
    content : {
      textAlign: 'center',
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      boxShadow: "1px 1px 1px #9E9E9E",

    }
};


export default function RespModal ({ modalIsOpen, setModalIsOpenFn, modalMsg, respType, rowID, entityDisplayData }) {

    const [lengthEntityData, setLengthEntityData] = useState(entityDisplayData?.length)

    let closeFn;
    switch(respType) {
        case 'create':
            closeFn = () => {
                scrollToTableBottom();
                const numRows = entityDisplayData.length;
                if (numRows > lengthEntityData) {
                    const newRow = document.getElementById(`table-row-${numRows-1}`);
                    newRow.id = 'new-table-row';
                    setLengthEntityData(numRows);
                };
            };
            break;
        case 'update':
            closeFn = () => {
                if (rowID) {
                    const updatedRow = scrollToUpdatedRow(entityDisplayData, rowID);
                    updatedRow.id = 'new-table-row';
                };
            };
            break;
    };


    return (
        <div className='resp-modal'>
            <Modal
              isOpen={ modalIsOpen } 
              preventScroll={ true }
              onAfterClose={ closeFn }
              appElement={ document.getElementById('root') }
              style={ customStyles } >
                <p>{ modalMsg }</p>
                <button onClick={ () => setModalIsOpenFn(false) }>OK</button>
            </Modal>
        </div>
    )
}


export function ConfirmModal ({ modalIsOpen, setModalIsOpenFn, onYes, id }) {

    return (
        <div className='resp-modal'>
            <Modal
              isOpen={ modalIsOpen }
              appElement={ document.getElementById('root') }
              style={ customStyles } >
                <p>{ `Are you sure you want to delete row with ID: ${id}, from the database?` }</p>
                <button onClick={ () => { onYes(id); setModalIsOpenFn(false); }}>Yes</button>
                &nbsp;&nbsp;
                <button onClick={ () => setModalIsOpenFn(false) }>Cancel</button>
            </Modal>
        </div>
    )

} 
