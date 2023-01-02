

export function formatDate(dateStr) {
    const d = new Date(dateStr);
    let day = d.getDate().toString();
    if (day.length === 1) {
        day = '0' + day;
    };
    let month = (d.getMonth()+1).toString();
    if (month.length === 1) {
        month = '0' + month;
    };
    return `${d.getFullYear()}-${month}-${day}`;
};
