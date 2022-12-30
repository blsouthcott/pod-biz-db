
export const selectAll = () => {
    return 'SELECT * FROM Streams;';
};


export const addNewStream = () => {
    return `INSERT INTO Streams(
        subscriber_ID, episode_ID, time_streamed
    ) VALUES (?, ?, ?);`;
};


export const deleteStream = () => {
    return `DELETE FROM Streams WHERE stream_ID = ?;`;
};
