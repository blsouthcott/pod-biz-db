import React, { useState } from 'react';
import TableRow from './TableRow';


function Table({ data, tableTitle, tableHeaders, onDelete, allowDeletion=true, setEntityFn }) {
    // console.log('data: ', data)
    // console.log('table headers: ', tableHeaders)

    const [displayData, setDisplayData] = useState(data)

    function sortDisplayData(index) {
        console.log('sorting data...');
        const displayDataCopy = [...displayData];
        displayDataCopy.sort((a, b) => {
          if (a[index] < b[index]) {
            return -1;
          }
          if (a[index] > b[index]) {
            return 1;
          }
          return 0;
        });
        setDisplayData(displayDataCopy);
    };


    return (
        <>
            <h2>{ tableTitle }</h2>
            <div className='table-scrollable'>
                <table id={'table'}>
                    {/* <caption><h2>{ tableTitle }</h2></caption> */}
                    <thead>
                        <tr id='table-header-row'>
                            {tableHeaders.map((header, i) => <th onClick={() => sortDisplayData(i)} key={i}>{header}</th>)}
                            {allowDeletion === true && <th></th>}
                        </tr>
                    </thead>
                    <tbody>
                        {displayData.map((d, i) => <TableRow data={d} key={i} rowNum={i} onDelete={ onDelete } allowDeletion={ allowDeletion } setEntityFn={ setEntityFn }/>)}
                    </tbody>
                </table>
            </div>
        </>
    )   
}

export default Table;
