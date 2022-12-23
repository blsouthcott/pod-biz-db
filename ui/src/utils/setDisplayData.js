

export const formatShowID = (showID, {toStr = true} = {}) => {
    if (toStr) {
        return JSON.stringify(showID === null || typeof(showID) !== 'object' ? [showID] : showID);
    } else {
        return showID === null || typeof(showID) !== 'object' ? [showID] : showID;
    }
}


export const episodesToArrays = (episodesData) => {
    let episodesArrays = []
    for (let cnt=0; cnt<episodesData.length; cnt++) {
        let { episode_ID, show_ID, title, episode_summary, date_released, hosts_names } = episodesData[cnt];
        hosts_names = hosts_names.split(',').join(', ');
        // console.log(episode_ID, show_ID, title, episode_summary, date_released, hosts_names);
        episodesArrays.push([episode_ID, show_ID, title, episode_summary, date_released, hosts_names]);
    };
    return episodesArrays;
}


export const subscribersToArrays = (subscribersData) => {
    let subscribersArrays = []
    for (let cnt=0; cnt<subscribersData.length; cnt++) {
        let { subscriber_ID, first_name, last_name, email_address, phone_number, age, gender, show_ID } = subscribersData[cnt];
        subscribersArrays.push([subscriber_ID, first_name, last_name, email_address, phone_number, age, gender, formatShowID(show_ID)]);
    };
    return subscribersArrays;
}
