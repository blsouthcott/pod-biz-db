import React, { useState } from 'react';
import TableCell from './TableCell';
import { ConfirmModal } from './Modal';


function TableRow ({ data, onDelete, allowDeletion=true, setEntityFn }) {

    const [confirmModalIsOpen, setConfirmModalIsOpen] = useState(false);
    const [rowID, setRowID] = useState('');
    
    return (
            <tr>
            <ConfirmModal 
                modalIsOpen={ confirmModalIsOpen } 
                setModalIsOpenFn={ setConfirmModalIsOpen }
                onYes={ onDelete }
                id={ rowID }
                >
                </ConfirmModal>
                {data.map((d, i) => <TableCell cellData={d} key={i}/>)}
                {allowDeletion === true && <td><button onClick={ () => { setRowID(data[0]); setConfirmModalIsOpen(true); }} >Delete</button></td>}
            </tr>
    )
}

export default TableRow;
