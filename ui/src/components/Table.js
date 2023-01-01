import React from 'react';
import TableRow from './TableRow';


function Table({ data, tableTitle, tableHeaders, onDelete, allowDeletion=true, setEntityFn }) {
    // console.log('data: ', data)
    // console.log('table headers: ', tableHeaders)
    return (
        <React.Fragment>
            <h2>{ tableTitle }</h2>
            <div className='table-scrollable'>
                <table id={'table'}>
                    {/* <caption><h2>{ tableTitle }</h2></caption> */}
                    <thead>
                        <tr id='table-header-row'>
                            {tableHeaders.map((header, i) => <th key={i}>{header}</th>)}
                            {allowDeletion === true && <th></th>}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((d, i) => <TableRow data={d} key={i} rowNum={i} onDelete={ onDelete } allowDeletion={ allowDeletion } setEntityFn={ setEntityFn }/>)}
                    </tbody>
                </table>
            </div>
        </React.Fragment>
    )   
}

export default Table;
