
export const selectAll = () => {
    return 'SELECT * FROM Shows ORDER BY show_ID ASC;';
};

export const addNewShow = (title) => {
    return `INSERT INTO Shows
            (
            title
            )
            VALUES
            (
            ?
            );`;
};

export const deleteShow = (id) => {
    return `DELETE FROM Shows 
            WHERE show_ID = ?;`;
};
