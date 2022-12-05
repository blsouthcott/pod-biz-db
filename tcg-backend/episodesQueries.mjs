

export const selectAll = () => {
    return 'SELECT * FROM Episodes;'
};


export function searchEpisode({ episodeTitle = undefined, hostName = undefined } = {}) {
    if (episodeTitle && hostName) {
        return `SELECT * FROM Episodes WHERE title LIKE ? AND hosts_names LIKE ?;`
    } else if (episodeTitle) {
        return `SELECT * FROM Episodes WHERE title LIKE ?`;
    } else {
        return `SELECT * FROM Episodes WHERE hosts_names LIKE ?;`
    };
};


export const getNumHostsForShow = () => {
    return `SELECT COUNT(*) AS num_hosts FROM Inter_shows_hosts WHERE show_ID = ?;`
};


export const addNewEpisode = () => {
    return `INSERT INTO Episodes
            (
                show_ID,
                title,
                episode_summary,
                date_released,
                hosts_names
            ) VALUES (
                ?,
                ?,
                ?,
                ?,
                (SELECT GROUP_CONCAT(all_hosts.hosts_names ,  '') 
                    FROM (SELECT DISTINCT CONCAT(first_name, ' ', last_name) 
                    AS hosts_names  
                    FROM Hosts
                    INNER JOIN Inter_shows_hosts ON Hosts.host_ID = Inter_shows_hosts.host_ID
                    WHERE Inter_shows_hosts.show_ID = ?) 
                    all_hosts
                )
            );`
};


export const updateEpisode = () => {
    return `UPDATE Episodes
            SET 
            title = ?, 
            episode_summary = ?, 
            date_released = ?
            WHERE episode_ID = ?;`
};


export const deleteEpisode = () => {
    return 'DELETE FROM Episodes WHERE episode_ID = ?;'
};
