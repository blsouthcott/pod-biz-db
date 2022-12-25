import React, { useState } from 'react';
import TableCell from './TableCell';
import { ConfirmModal } from './Modal';


function TableRow ({ data, rowNum, onDelete, allowDeletion=true, setEntityFn }) {
    const [confirmModalIsOpen, setConfirmModalIsOpen] = useState(false);
    const [rowID, setRowID] = useState('');
    
    return (
            <tr id={`table-row-${rowNum}`}>
                {data.map((d, i) => <TableCell cellData={d} key={i}/>)}
                {allowDeletion === true && 
                    <td>
                        <button 
                            onClick={ () => { setRowID(data[0]); setConfirmModalIsOpen(true); }} 
                            >Delete
                        </button>
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
