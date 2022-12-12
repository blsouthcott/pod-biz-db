
import { getEntityData } from "../../utils/entityData"


export const loadAllEntityData = () => {
    console.log("loading all entity data...")
    return async function (dispatch) {
        const [
            episodes,
            hosts,
            producers,
            shows,
            streams,
            subscribers
        ] = await Promise.all([
            getEntityData('episodes'),
            getEntityData('hosts'),
            getEntityData('producers'),
            getEntityData('shows'),
            getEntityData('streams'),
            getEntityData('subscribers'),
        ])
        dispatch(episodesLoaded(episodes));
        dispatch(hostsLoaded(hosts));
        dispatch(producersLoaded(producers));
        dispatch(showsLoaded(shows));
        dispatch(streamsLoaded(streams));
        dispatch(subscribersLoaded(subscribers));
        dispatch(initialDataLoaded());
    };
}


export const initialDataLoaded = () => {
    return {
        type: "INITIAL_DATA_LOADED",
        payload: null,
    };
}


export const episodesLoaded = (data) => {
    return {
        type: "LOAD_EPISODES",
        payload: data,
    };
}


export const loadEpisodes = () => {
    return async function (dispatch) {
        const episodesData = await getEntityData('episodes');
        dispatch(episodesLoaded(episodesData));
    };
}


export const hostsLoaded = (data) => {
    return {
        type: "LOAD_HOSTS",
        payload: data,
    };
}


export const loadHosts = () => {
    return async function (dispatch) {
        const hostsData = await getEntityData('hosts');
        dispatch(hostsLoaded(hostsData));
    };
}


export const producersLoaded = (data) => {
    return {
        type: "LOAD_PRODUCERS",
        payload: data,
    };
}


export const loadProducers = () => {
    return async function (dispatch) {
        const producersData = await getEntityData('producers');
        dispatch(producersLoaded(producersData));
    }
}


export const showsLoaded = (data) => {
    return {
        type: "LOAD_SHOWS",
        payload: data,
    };
}


export const loadShows = () => {
    return async function (dispatch) {
        const showsData = await getEntityData('shows');
        dispatch(showsLoaded(showsData));
    };
}


export const streamsLoaded = (data) => {
    return {
        type: "LOAD_STREAMS",
        payload: data,
    };
}


export const loadStreams = () => {
    return async function (dispatch) {
        const streamsData = await getEntityData('streams');
        dispatch(streamsLoaded(streamsData));
    };
}


export const subscribersLoaded = (data) => {
    return {
        type: "LOAD_SUBSCRIBERS",
        payload: data,
    };
}


export const loadSubscribers = () => {
    return async function (dispatch) {
        const subscribersData = await getEntityData('subscribers');
        dispatch(subscribersLoaded(subscribersData));
    };
}
