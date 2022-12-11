

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
