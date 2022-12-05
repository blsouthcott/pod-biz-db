import React from 'react';
import TableRow from './TableRow';
import TableHeader from './TableHeader';


function Table({ data, tableTitle, tableHeaders, onDelete, allowDeletion=true, setEntityFn }) {
    return (
        <div>
            <table>
                <caption><h2>{ tableTitle }</h2></caption>
                <thead>
                    <tr>
                        {tableHeaders.map((header, i) => <TableHeader headerName={header} key={i}/>)}
                        {allowDeletion === true ? <td></td> : null}
                    </tr>
                </thead>
                <tbody>
                    {data.map((d, i) => <TableRow data={d} key={i} onDelete={ onDelete } allowDeletion={ allowDeletion } setEntityFn={ setEntityFn }/>)}
                </tbody>
            </table>
        </div>
    )   
}

export default Table;