import React from 'react';
import { Link } from 'react-router-dom';
import TableCell from './TableCell';


function TableRow ({ data, onDelete, allowDeletion=true, setEntityFn }) {
    
    return (
        <tr>
            {data.map((d, i) => <TableCell cellData={d} key={i}/>)}
            {allowDeletion === true ? <td><button onClick={ () => onDelete(data[0])}>Delete</button></td> : null}
        </tr>
    )
}

export default TableRow;
