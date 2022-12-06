
export const selectAll = () => {
    return `SELECT Subscribers.*, Inter_subscribers_shows.show_ID 
    FROM Subscribers
    LEFT JOIN Inter_subscribers_shows ON Subscribers.subscriber_ID = Inter_subscribers_shows.subscriber_ID
    ORDER BY Subscribers.subscriber_ID ASC;`
};


export const selectShows = () => {
    return `SELECT * FROM Inter_subscribers_shows WHERE subscriber_ID = ?;`
};


export function selectAllSearch ({firstName = undefined, lastName = undefined} = {}) {
    if (firstName !== undefined && lastName !== undefined) {
        return `SELECT Subscribers.*, Inter_subscribers_shows.show_ID 
            FROM Subscribers
            LEFT JOIN Inter_subscribers_shows ON Subscribers.subscriber_ID = Inter_subscribers_shows.subscriber_ID
            WHERE Subscribers.first_name LIKE ? OR Subscribers.last_name LIKE ?
            ORDER BY Subscribers.subscriber_ID ASC;`
    } else if (firstName !== undefined) {
        return `SELECT Subscribers.*, Inter_subscribers_shows.show_ID 
            FROM Subscribers
            LEFT JOIN Inter_subscribers_shows ON Subscribers.subscriber_ID = Inter_subscribers_shows.subscriber_ID
            WHERE Subscribers.first_name LIKE ?
            ORDER BY Subscribers.subscriber_ID ASC;`
    } else {
        return `SELECT Subscribers.*, Inter_subscribers_shows.show_ID 
            FROM Subscribers
            LEFT JOIN Inter_subscribers_shows ON Subscribers.subscriber_ID = Inter_subscribers_shows.subscriber_ID
            WHERE Subscribers.last_name LIKE ?
            ORDER BY Subscribers.subscriber_ID ASC;`
    };
};



//-----------------------------------------------------------------------------------------------------------------
//add new subscriber to subscribers table
export const addNewSubscriber = () => {
    return `INSERT INTO Subscribers(first_name, last_name, email_address, phone_number, age, gender) 
    VALUES (?, ?, ?, ?, ?, ?);`
};

//add new subscriber to subscriber/show inter table
export const addNewInterSubscribersShows = () => {
    return `INSERT INTO Inter_subscribers_shows(subscriber_ID, show_ID)
    VALUES (?, ?);`
};

export const deleteInterSubscribersShows = () => {
    return `DELETE FROM Inter_subscribers_shows WHERE subscriber_ID = ? and show_ID = ?;`
}


//update subscriber table
export const updateSubscriber = () => {  
    return `
        UPDATE Subscribers 
        SET 
        first_name = ?,
        last_name = ?,
        email_address = ?,
        phone_number = ?,
        age = ?,
        gender = ?
        WHERE subscriber_ID = ?;`
};

export const deleteSubscriber = () => {
    return `DELETE FROM Subscribers WHERE subscriber_ID = ?;`
};
