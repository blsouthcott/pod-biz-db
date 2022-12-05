
export const selectAll = () => {
    return 'SELECT * FROM Producers;';
};


export const addNewProducer = () => {
    return `INSERT INTO Producers(
                            first_name, 
                            last_name, 
                            show_ID,
                            email_address,
                            phone_number
                        ) VALUES (
                            ?,
                            ?,
                            ?,
                            ?,
                            ?
                        )`;
};

export const updateProducer = () => {
    return `UPDATE Producers 
            SET 
            first_name = ?,
            last_name = ?,
            show_ID = ?,
            email_address = ?,
            phone_number = ?
            WHERE producer_ID = ?;`
};

export const deleteProducer = () => {
    return 'DELETE FROM Producers WHERE producer_ID = ?;'
};
