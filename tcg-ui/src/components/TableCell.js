import React from 'react';

function TableCell ({ cellData, displayFn }) {
    return (
        <td>{ displayFn !== undefined ? displayFn(cellData) : cellData }</td>
    )
}

export default TableCell;
