

export const selectAll = () => {
    return `SELECT Hosts.*, Inter_shows_hosts.show_ID
            FROM Hosts
            LEFT JOIN Inter_shows_hosts ON Hosts.host_ID = Inter_shows_hosts.host_ID
            ORDER BY Hosts.host_ID ASC;`;
};

export const addNewHost = () => {
    return `INSERT INTO Hosts
                        (
                            first_name,
                            last_name,
                            email_address,
                            phone_number
                        ) VALUES (
                            ?,
                            ?,
                            ?,
                            ?
                        )`;
};

export const insertNewInterShowsHosts = () => {
    return `INSERT INTO Inter_shows_hosts
                        (
                            show_ID,
                            host_ID
                        )
                        VALUES (
                            ?,
                            (SELECT host_ID FROM Hosts
                            WHERE first_name = ?
                            AND last_name = ?
                            AND email_address = ?
                            AND phone_number = ?)
                        );`;
};

export const selectShows = () => {
    return 'SELECT show_ID FROM Inter_shows_hosts WHERE host_ID = ?';
};

export const updateHost = () => {
    return `UPDATE Hosts 
            SET 
            first_name = ?,
            last_name = ?,
            email_address = ?,
            phone_number = ?
            WHERE host_ID = ?;`;
};

export const addNewInterShowsHosts = () => {
    return `INSERT INTO Inter_shows_hosts
            (
                host_ID,
                show_ID
            ) VALUES (
                ?,
                ?
            );`;
};

export const deleteInterShowsHosts = () => {
    return 'DELETE FROM Inter_shows_hosts WHERE host_ID = ? AND show_ID = ?;';
};
