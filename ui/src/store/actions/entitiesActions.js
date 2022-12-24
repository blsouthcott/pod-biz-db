
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
        dispatch(episodesLoaded({
            episodesData: episodes,
            showsData: shows}
        ));
        dispatch(hostsLoaded({
            hostsData: hosts,
            showsData: shows
        }));
        dispatch(producersLoaded({
            producersData: producers,
            showsData: shows
        }));
        dispatch(showsLoaded(shows));
        dispatch(streamsLoaded({
            streamsData: streams,
            episodesData: episodes,
            subscribersData: subscribers
        }));
        dispatch(subscribersLoaded({
            subscribersData: subscribers,
            showsData: shows
        }));
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
        const [
            episodes,
            shows
         ] = await Promise.all([
            getEntityData('episodes'),
            getEntityData('shows')
         ]);
        dispatch(episodesLoaded({
            episodesData: episodes,
            showsData: shows
        }));
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
        const [
            hosts,
            shows
        ] = await Promise.all([
            getEntityData('hosts'),
            getEntityData('shows')
         ])
        dispatch(hostsLoaded({
            hostsData: hosts,
            showsData: shows
        }));
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
        const [
            producers,
            shows
        ] = await Promise.all([
            getEntityData('producers'),
            getEntityData('shows')
        ]);
        dispatch(producersLoaded({
            producersData: producers,
            showsData: shows
        }));
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
        const [
            streams, 
            episodes, 
            subscribers
        ] = await Promise.all([
            getEntityData('streams'),
            getEntityData('episodes'),
            getEntityData('subscribers')
        ])
        dispatch(streamsLoaded({
            streamsData: streams,
            episodesData: episodes,
            subscribersData: subscribers
        }));
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
        const [
            subscribers,
            shows
         ] = await Promise.all([
            getEntityData('subscribers'),
            getEntityData('shows')
         ])
        dispatch(subscribersLoaded({
            subscribersData: subscribers,
            showsData: shows}
        ));
    };
}
