import React, { useState, useEffect } from 'react';
import TableRow from './TableRow';


function Table({ data, tableTitle, tableHeaders, onDelete, allowDeletion=true, setEntityFn }) {

    const [displayData, setDisplayData] = useState([...data]);
    const [sortedBy, setSortedBy] = useState(0);
    const [orderedBy, setOrderedBy] = useState('asc');

    function sortDisplayData(index) {
        console.log('sorting data...');
        const displayDataCopy = [...displayData];
        if ((sortedBy !== index) || (sortedBy === index && orderedBy === "desc")) {
            displayDataCopy.sort((a, b) => {
                if (a[index] < b[index]) {
                    return -1;
                }
                if (a[index] > b[index]) {
                    return 1;
                }
                return 0;
            });
            setOrderedBy("asc");
        } else if (sortedBy === index && orderedBy === "asc") {
            displayDataCopy.sort((a, b) => {
                if (a[index] < b[index]) {
                    return 1;
                }
                if (a[index] > b[index]) {
                    return -1;
                }
                return 0;
            });
            setOrderedBy("desc");
        };
        setSortedBy(index);
        setDisplayData(displayDataCopy);
    };

    useEffect(() => {
        setDisplayData(data);
    }, [data])

    return (
        <>
            <h2 id='table-title'>{ tableTitle }</h2>
            <div className='table-scrollable'>
                <table id={'table'}>
                    {/* <caption><h2>{ tableTitle }</h2></caption> */}
                    <thead>
                        <tr id='table-header-row'>
                            {tableHeaders.map((header, i) => {
                                return (
                                    <th 
                                        className='header-sortable-table' 
                                        onClick={() => sortDisplayData(i)} 
                                        key={i}>
                                            {header}
                                            &nbsp;
                                            {i === sortedBy ? orderedBy === "asc" ? <span>&darr;</span> : <span>&uarr;</span> : ""}
                                    </th>
                                )
                            })}
                            {allowDeletion && <th></th>}
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
