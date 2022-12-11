
const initialState = {
    initialDataLoaded: false,
    episodesData: [],
    episodesDisplayData: [],
    episodesOptions: [],
    hostsData: [],
    hostsDisplayData: [],
    producersData: [],
    producersDisplayData: [],
    showsData: [],
    showsDisplayData: [],
    showsOptions: [],
    streamsData: [],
    streamsDisplayData: [],
    subscribersData: [],
    subscribersDisplayData: [],
    subscribersOptions: [],
}


export const entitiesReducer = (state = initialState, action) => {

    const { type, payload } = action;
    switch (type) {

        case "INITIAL_DATA_LOADED":
            return {
                ...state,
                initialDataLoaded: true,
            };

        case "LOAD_EPISODES":

            let episodesArrays = []
            for (let cnt=0; cnt<payload.length; cnt++) {
                let { episode_ID, show_ID, title, episode_summary, date_released, hosts_names } = payload[cnt];
                hosts_names = hosts_names.split(',').join(', ');
                // console.log(episode_ID, show_ID, title, episode_summary, date_released, hosts_names);
                episodesArrays.push([episode_ID, show_ID, title, episode_summary, date_released, hosts_names]);
            };
            
            let episodesOptions = [];
            for (let ep of payload) {
                episodesOptions.push(
                    {
                        value: ep.episode_ID,
                        text: `${ep.episode_ID}, ${ep.title}`
                    }
                )
            };

            return {
                ...state,
                episodesData: payload,
                episodesDisplayData: episodesArrays,
                episodesOptions: episodesOptions,
            };

        case "LOAD_HOSTS":

            let hostsArrays = []
            for (let cnt=0; cnt<payload.length; cnt++) {
                let { host_ID, first_name, last_name, email_address, phone_number, show_ID } = payload[cnt];
                hostsArrays.push([host_ID, first_name, last_name, email_address, phone_number, show_ID === null ? [show_ID] : show_ID.length > 1 ? show_ID : [show_ID]]);
            }

            return {
                ...state,
                hostsData: payload,
                hostsDisplayData: hostsArrays,
            };

        case "LOAD_PRODUCERS":

            let producersArrays = []
            for (let cnt=0; cnt<payload.length; cnt++) {
                let { producer_ID, show_ID, first_name, last_name, email_address, phone_number } = payload[cnt];
                producersArrays.push([producer_ID, first_name, last_name, email_address, phone_number, show_ID]);
            };
            
            return {
                ...state,
                producersData: payload,
                producersDisplayData: producersArrays
            };

        case "LOAD_SHOWS":

            let showsArrays = []
            for (let cnt=0; cnt<payload.length; cnt++) {
                let { show_ID, title } = payload[cnt];
                showsArrays.push([show_ID, title])
            };

            let showsOptions = [];
            for (let show of payload) {
                showsOptions.push(
                    {
                        value: show.show_ID,
                        text: `${show.show_ID}, ${show.title}`
                    }
                )
            }
            
            return {
                ...state,
                showsData: payload,
                showsDisplayData: showsArrays,
                showsOptions: showsOptions,
            };

        case "LOAD_STREAMS":

            let streamsArrays = []
            for (let cnt=0; cnt<payload.length; cnt++) {
                let { stream_ID, subscriber_ID, episode_ID, time_streamed } = payload[cnt];
                // console.log(stream_ID, subscriber_ID, episode_ID, time_streamed)
                streamsArrays.push([stream_ID, subscriber_ID, episode_ID, time_streamed])
            };
            
            return {
                ...state,
                streamsData: payload,
                streamsDisplayData: streamsArrays,
            };

        case "LOAD_SUBSCRIBERS":

            let subscribersArrays = []
            for (let cnt=0; cnt<payload.length; cnt++) {
                let { subscriber_ID, first_name, last_name, email_address, phone_number, age, gender, show_ID } = payload[cnt];
                // console.log(subscriber_ID, first_name, last_name, email_address, phone_number, age, gender, show_ID)
                subscribersArrays.push([subscriber_ID, first_name, last_name, email_address, phone_number, age, gender, show_ID === null ? [show_ID] : show_ID.length > 1 ? show_ID : [show_ID]]);
            };

            let subscribersOptions = [];
            for (let sub of payload) {
                subscribersOptions.push(
                    {
                        value: sub.subscriber_ID,
                        text: `${sub.subscriber_ID}, ${sub.first_name} ${sub.last_name}`
                    }
                )
            };

            return {
                ...state,
                subscribersData: payload,
                subscribersDisplayData: subscribersArrays,
                subscribersOptions: subscribersOptions,
            };

        default:
            return state;
    };
}
