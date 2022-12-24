
import { episodesToArrays, subscribersToArrays, formatShowID } from "../../utils/setDisplayData";


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

            const episodesArrays = episodesToArrays(payload);
            
            const episodesOptions = [];
            for (let cnt=0; cnt<payload.length; cnt++) {
                let { episode_ID, title } = payload[cnt];
                episodesOptions.push(
                    {
                        value: episode_ID,
                        text: `${episode_ID}, ${title}`
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

            const hostsArrays = []
            const hostsOptions = [];
            for (let cnt=0; cnt<payload.length; cnt++) {
                let { host_ID, first_name, last_name, email_address, phone_number, show_ID } = payload[cnt];
                hostsArrays.push([host_ID, first_name, last_name, email_address, phone_number, formatShowID(show_ID)]);
                hostsOptions.push({
                    text: `${host_ID}, ${first_name} ${last_name}`,
                    value: host_ID
                })
            }

            return {
                ...state,
                hostsData: payload,
                hostsDisplayData: hostsArrays,
                hostsOptions: hostsOptions
            };

        case "LOAD_PRODUCERS":

            let producersArrays = []
            let producersOptions = []
            for (let cnt=0; cnt<payload.length; cnt++) {
                let { producer_ID, show_ID, first_name, last_name, email_address, phone_number } = payload[cnt];
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
                producersData: payload,
                producersDisplayData: producersArrays,
                producersOptions: producersOptions
            };

        case "LOAD_SHOWS":

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
            
            const streams = payload.streamsData;
            const episodesObj = {}
            for (let episode of payload.episodesData) {
                episodesObj[episode.episode_ID] = episode;
            }
            console.log('episodesObj: ', episodesObj)

            const subscribersObj = {}
            for (let subscriber of payload.subscribersData) {
                subscribersObj[subscriber.subscriber_ID] = subscriber;
            }
            console.log('subscribersObj: ', subscribersObj)

            const streamsArrays = []
            for (let cnt=0; cnt<streams.length; cnt++) {
                let { stream_ID, subscriber_ID, episode_ID, time_streamed } = streams[cnt];
                // console.log(stream_ID, subscriber_ID, episode_ID, time_streamed)
                let subscriberInfo = `(${subscriber_ID}) ${subscribersObj[subscriber_ID].first_name} ${subscribersObj[subscriber_ID].last_name}`
                let episodeInfo = `(${episode_ID}) ${episodesObj[episode_ID].title}`
                streamsArrays.push([stream_ID, subscriberInfo, episodeInfo, time_streamed])
            };
            
            return {
                ...state,
                streamsData: payload,
                streamsDisplayData: streamsArrays,
            };

        case "LOAD_SUBSCRIBERS":

            const subscribersArrays = subscribersToArrays(payload);
            const subscribersOptions = []
            for (let cnt=0; cnt<payload.length; cnt++) {
                let { subscriber_ID, first_name, last_name } = payload[cnt];
                // console.log(subscriber_ID, first_name, last_name, email_address, phone_number, age, gender, show_ID)
                subscribersOptions.push(
                    {
                        value: subscriber_ID,
                        text: `${subscriber_ID}, ${first_name} ${last_name}`
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
