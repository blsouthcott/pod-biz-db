
import { episodesToArrays, subscribersToArrays, formatShowIDs, formatShowIDsDisplayData, dataToObj } from "../../utils/displayDataUtils";


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
    let showsObj;
    switch (type) {

        case "INITIAL_DATA_LOADED":
            console.log('calling INITIAL_DATA_LOADED action...')
            return {
                ...state,
                initialDataLoaded: true,
            };

        case "LOAD_EPISODES":
            console.log('calling LOAD_EPISODES action...')
            const episodes = payload.episodesData;
            showsObj = dataToObj(payload.showsData, 'show_ID');
            const episodesArrays = episodesToArrays(episodes, showsObj);
            
            const episodesOptions = [];
            for (let cnt=0; cnt<episodes.length; cnt++) {
                let { episode_ID, title } = episodes[cnt];
                episodesOptions.push(
                    {
                        value: episode_ID,
                        text: `${episode_ID}, ${title}`
                    }
                )
            };

            return {
                ...state,
                episodesData: payload.episodesData,
                episodesDisplayData: episodesArrays,
                episodesOptions: episodesOptions,
            };

        case "LOAD_HOSTS":
            console.log('calling LOAD_HOSTS action...')
            const hosts = payload.hostsData;
            showsObj = dataToObj(payload.showsData, 'show_ID');
            console.log('showsObj: ', showsObj)
            // for (let show of payload.showsData) {
            //     showsObj[show.show_ID] = show;
            // }

            const hostsArrays = []
            const hostsOptions = [];
            for (let cnt=0; cnt<hosts.length; cnt++) {
                let { host_ID, first_name, last_name, email_address, phone_number, show_ID } = hosts[cnt];
                let show_IDs = formatShowIDs(show_ID, {toStr: false});
                show_IDs = formatShowIDsDisplayData(show_IDs, showsObj);
                hostsArrays.push([
                    host_ID, 
                    first_name, 
                    last_name, 
                    email_address, 
                    phone_number, 
                    show_IDs
                ]);
                hostsOptions.push({
                    text: `${host_ID}, ${first_name} ${last_name}`,
                    value: host_ID
                })
            }

            return {
                ...state,
                hostsData: payload.hostsData,
                hostsDisplayData: hostsArrays,
                hostsOptions: hostsOptions
            };

        case "LOAD_PRODUCERS":
            console.log('calling LOAD_PRODUCERS action...')
            const producers = payload.producersData;
            showsObj = dataToObj(payload.showsData, 'show_ID');
            let producersArrays = []
            let producersOptions = []
            for (let cnt=0; cnt<producers.length; cnt++) {
                let { producer_ID, show_ID, first_name, last_name, email_address, phone_number } = producers[cnt];
                show_ID = `(${show_ID}) ${showsObj[show_ID].title}`
                producersArrays.push([producer_ID, first_name, last_name, email_address, phone_number, show_ID]);
                producersOptions.push(
                    {
                        value: producer_ID,
                        text: `${producer_ID}, ${first_name} ${last_name}`
                    }
                )
            };
            
            return {
                ...state,
                producersData: payload.producersData,
                producersDisplayData: producersArrays,
                producersOptions: producersOptions
            };

        case "LOAD_SHOWS":
            console.log('calling LOAD_SHOWS action...')
            const showsArrays = []
            const showsOptions = []
            for (let cnt=0; cnt<payload.length; cnt++) {
                let { show_ID, title } = payload[cnt];
                showsArrays.push([show_ID, title])
                showsOptions.push(
                    {
                        value: show_ID,
                        text: `${show_ID}, ${title}` 
                    }
                )
            };
            
            return {
                ...state,
                showsData: payload,
                showsDisplayData: showsArrays,
                showsOptions: showsOptions,
            };

        case "LOAD_STREAMS":
            console.log('calling LOAD_STREAMS action...')
            const streams = payload.streamsData;
            const episodesObj = dataToObj(payload.episodesData, 'episode_ID');
            const subscribersObj = dataToObj(payload.subscribersData, 'subscriber_ID');

            const streamsArrays = []
            for (let cnt=0; cnt<streams.length; cnt++) {
                let { stream_ID, subscriber_ID, episode_ID, time_streamed } = streams[cnt];
                let subscriberInfo = `(${subscriber_ID}) ${subscribersObj[subscriber_ID].first_name} ${subscribersObj[subscriber_ID].last_name}`
                let episodeInfo = `(${episode_ID}) ${episodesObj[episode_ID].title}`
                streamsArrays.push([stream_ID, subscriberInfo, episodeInfo, time_streamed])
            };
            
            return {
                ...state,
                streamsData: payload.streamsData,
                streamsDisplayData: streamsArrays,
            };

        case "LOAD_SUBSCRIBERS":
            console.log('calling LOAD_SUBSCRIBERS action...')
            const subscribers = payload.subscribersData;
            showsObj = dataToObj(payload.showsData, 'show_ID');
            const subscribersArrays = subscribersToArrays(subscribers, showsObj);
            const subscribersOptions = []
            for (let cnt=0; cnt<subscribers.length; cnt++) {
                let { subscriber_ID, first_name, last_name } = subscribers[cnt];
                subscribersOptions.push(
                    {
                        value: subscriber_ID,
                        text: `${subscriber_ID}, ${first_name} ${last_name}`
                    }
                )
            };

            return {
                ...state,
                subscribersData: payload.subscribersData,
                subscribersDisplayData: subscribersArrays,
                subscribersOptions: subscribersOptions,
            };

        default:
            return state;
    };
}
