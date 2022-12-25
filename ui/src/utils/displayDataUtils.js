
export const dataToObj = (data, key) => {
    const obj = {}
    for (let d of data) {
        obj[d[key]] = d;
    }
    return obj;
}

export const formatShowIDs = (showID, {toStr = true} = {}) => {
    if (toStr) {
        return JSON.stringify(showID === null || typeof(showID) !== 'object' ? [showID] : showID);
    } else {
        return showID === null || typeof(showID) !== 'object' ? [showID] : showID;
    }
}

export const formatShowIDsDisplayData = (showIDs, showsObj) => {
    return showIDs.map(id => showsObj[id] !== undefined ? `(${id}) ${showsObj[id].title}` : '').join(', ');
}


export const episodesToArrays = (episodesData, showsObj) => {
    let episodesArrays = []
    for (let cnt=0; cnt<episodesData.length; cnt++) {
        let { episode_ID, show_ID, title, episode_summary, date_released, hosts_names } = episodesData[cnt];
        show_ID = `(${show_ID}) ${showsObj[show_ID].title}`
        hosts_names = hosts_names.split(',').join(', ');
        // console.log(episode_ID, show_ID, title, episode_summary, date_released, hosts_names);
        episodesArrays.push([episode_ID, show_ID, title, episode_summary, date_released, hosts_names]);
    };
    return episodesArrays;
}


export const subscribersToArrays = (subscribersData, showsObj) => {
    let subscribersArrays = []
    for (let cnt=0; cnt<subscribersData.length; cnt++) {
        let { subscriber_ID, first_name, last_name, email_address, phone_number, age, gender, show_ID } = subscribersData[cnt];
        let show_IDs = formatShowIDs(show_ID, {toStr: false});
        show_IDs = formatShowIDsDisplayData(show_IDs, showsObj);
        subscribersArrays.push([subscriber_ID, first_name, last_name, email_address, phone_number, age, gender, show_IDs]);
    };
    return subscribersArrays;
}
