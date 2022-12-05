
export const selectAll = () => {
    return 'SELECT * FROM Streams;';
};


//add new stream 
export function addNewStream(subscriber_ID, episode_ID, time_streamed) {
    const addQuery = `INSERT INTO Streams(subscriber_ID, episode_ID, time_streamed) 
    VALUES ('${subscriber_ID}', '${episode_ID}', '${time_streamed}');`
    return addQuery
};


export function deleteStream(stream_ID) {
    const deleteQuery = `DELETE FROM Streams WHERE stream_ID = ${stream_ID};`
    return deleteQuery
};