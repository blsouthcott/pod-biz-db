// this code is derived from: https://dev.to/bhuma08/react-using-modal-in-functional-components-3po2

import React from 'react';
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


export default function RespModal ({ 
    modalIsOpen, 
    setModalIsOpenFn, 
    modalMsg, 
    isSuccessResp, 
    respType,
    rowID, 
    entityDisplayData 
}) {

    let closeFn;
    switch(respType) {
        case 'create':
            closeFn = () => {
                scrollToTableBottom();
                if (isSuccessResp) {
                    const numRows = entityDisplayData.length;
                    const newRow = document.getElementById(`table-row-${numRows-1}`);
                    newRow.className = 'highlighted-table-row';
                };
            };
            break;
        case 'update':
            closeFn = () => {
                if (isSuccessResp) {
                    const updatedRow = scrollToUpdatedRow(entityDisplayData, rowID);
                    updatedRow.classList.remove('highlighted-table-row');
                    setTimeout(() => {
                        updatedRow.classList.add('highlighted-table-row');
                    }, 10);
                };
            };
            break;
        default:
            closeFn = () => {
                return;
            }
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
