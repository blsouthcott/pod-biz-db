import React, { useState } from 'react';
import { ConfirmModal } from './Modal';
// import { MdDeleteForever } from 'react-icons/md';
import { RiDeleteBin2Line } from 'react-icons/ri';


function TableRow ({ data, rowNum, onDelete, allowDeletion=true }) {
    const [confirmModalIsOpen, setConfirmModalIsOpen] = useState(false);
    const [rowID, setRowID] = useState('');
    
    return (
            <tr id={`table-row-${rowNum}`}>
                {data.map((d, i) => <td key={i}>{d}</td>)}
                {allowDeletion === true && 
                    <td>
                        <RiDeleteBin2Line
                            className='delete-icon'
                            size='24'
                            onClick={ () => { setRowID(data[0]); setConfirmModalIsOpen(true); }} 
                            />
                        <ConfirmModal 
                        modalIsOpen={ confirmModalIsOpen } 
                        setModalIsOpenFn={ setConfirmModalIsOpen }
                        onYes={ onDelete }
                        id={ rowID }
                        >
                        </ConfirmModal>
                    </td>
                }
            </tr>
    )
}

export default TableRow;
