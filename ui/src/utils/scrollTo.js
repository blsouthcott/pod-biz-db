
export const scrollToNewRow = (data, document) => {
    const numTableRows = data.length;
    const newRow = document.getElementById(`table-row-${numTableRows-1}`);
    newRow.scrollIntoView();
};


export const scrollToTableBottom = () => {
    const table = document.getElementsByClassName('table-scrollable')[0];
    table.scrollTop += table.scrollHeight;
    table.scrollIntoView();
}


export const scrollToTopOfTable = (document) => {
    const tableHeader = document.getElementById('table-header-row');
    tableHeader.scrollIntoView();
}


export const scrollToUpdatedRow = (displayData, updatedRowID) => {
    console.log('updated row ID: ', updatedRowID)
    console.log('length of display data: ', displayData.length)
    let updatedRowNum;
    let cnt = 0;
    while (updatedRowNum === undefined) {
        if (displayData[cnt][0] == updatedRowID) {
            updatedRowNum = cnt;
        };
        cnt++;
    };
    const updatedRow = document.getElementById(`table-row-${updatedRowNum}`);
    updatedRow.scrollIntoView();
    return updatedRow;
}
