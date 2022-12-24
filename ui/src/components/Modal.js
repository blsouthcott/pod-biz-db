// this code is derived from: https://dev.to/bhuma08/react-using-modal-in-functional-components-3po2

import React from 'react';
import Modal from 'react-modal';


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


export default function RespModal ({ modalIsOpen, setModalIsOpenFn, modalMsg }) {

    return (
        <div className='resp-modal'>
            <Modal
              isOpen={ modalIsOpen } 
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
