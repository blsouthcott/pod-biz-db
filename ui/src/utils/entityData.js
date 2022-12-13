import { backendURL } from "../constants/backendURL";


export async function getEntityData(entity) {
    const resp = await fetch(`${backendURL}/${entity}`);
    if (resp.status === 200) {
        const entityData = resp.json();
        return entityData;
    }
    alert('Failed to retrieve Shows data from database. Please try again later.');
    return [];
};


export async function createEntity(entity, entityData) {
    console.log('calling createEntity function...');
    const resp = await fetch(`${backendURL}/${entity}`, {
        method: 'POST',
        body: JSON.stringify(entityData),
        headers: {
            'Content-Type': 'application/json',
        },
    })
    console.log('result of fetch to create new entity: ' + resp.status);
    return resp.status;
};


export async function updateEntityData(entity, entityData) {
    console.log('calling updateEntity function...');
    const resp = await fetch(`${backendURL}/${entity}`, {
        method: 'PUT',
        body: JSON.stringify(entityData),
        headers: {
            'Content-Type': 'application/json',
        },
    })
    console.log('result of fetch to update entity: ' + resp.status);
    return resp.status;
}


export async function deleteEntityData(entity, id, setModalOpenFn, setModalMsgFn) {
    const resp = await fetch(`${backendURL}/${entity}/${id}`, {method: 'DELETE'});
    if (resp.status === 200) {
        setModalMsgFn(`Success! ${entity.slice(0, entity.length-1)} with id: ${id}, has been deleted from the database.`);
    } else {
        setModalMsgFn(`Unable to delete ${entity.slice(0, entity.length-1)} with id: ${id} from the database.`);
    };
    setModalOpenFn(true);
}

export function getDeleteEntityFn(entity, dispatch, setEntityFn, setModalOpenFn, setModalMsgFn) {
    switch(entity) {
        case 'Episodes':
            return async function (id) {
                await deleteEntityData('episodes', id, setModalOpenFn, setModalMsgFn);
                await dispatch(setEntityFn());
            };
        case 'Hosts':
            return async function (id) {
                await deleteEntityData('hosts', id, setModalOpenFn, setModalMsgFn);
                await dispatch(setEntityFn());
            };
        case 'Producers':
            return async function (id) {
                await deleteEntityData('producers', id, setModalOpenFn, setModalMsgFn);
                await dispatch(setEntityFn());
            };
        case 'Shows':
            return async function (id) {
                await deleteEntityData('shows', id, setModalOpenFn, setModalMsgFn);
                await dispatch(setEntityFn());
            };
        case 'Streams':
            return async function (id) {
                await deleteEntityData('streams', id, setModalOpenFn, setModalMsgFn);
                await dispatch(setEntityFn());
            };
        case 'Subscribers':
            return async function (id) {
                await deleteEntityData('subscribers', id, setModalOpenFn, setModalMsgFn);
                await dispatch(setEntityFn());
            };
        default: 
            return function (id) {
                setModalMsgFn('Invalid option passed to getDeleteEntityFn');
                setModalOpenFn(true);
            };
    };
};

export const deleteEntityFns = {
    Episodes: async function (id, setEntityFn, setModalOpenFn) {
        await deleteEntityData('episodes', id, setModalOpenFn);
        await setEntityFn();
    },
    Hosts: async function (id, setEntityFn) {
        await deleteEntityData('hosts', id);
        await setEntityFn();
    },
    Producers: async function (id, setEntityFn) {
        await deleteEntityData('producers', id);
        await setEntityFn();
    },
    Shows: async function (id, setEntityFn) {
        await deleteEntityData('shows', id);
        await setEntityFn();
    },
    Streams: async function (id, setEntityFn) {
        await deleteEntityData('streams', id);
        await setEntityFn();
    },
    Subscribers: async function (id, setEntityFn) {
        await deleteEntityData('subscribers', id);
        await setEntityFn();
    }
}


export async function getShowsAsOptions(multi_select) {
    const shows = await getEntityData('shows');
    let showsAsOptions = [];
    if (multi_select === false) {
        showsAsOptions.push([]);
    }
    for (let show of shows) {
        showsAsOptions.push(
            {
                value: show.show_ID,
                text: `${show.show_ID}, ${show.title}`
            }
        )
    }
    console.log(showsAsOptions)
    return showsAsOptions;
};


export async function getSubscribersAsOptions() {
    const subscribers = await getEntityData('subscribers');
    let subscribersAsOptions = [[]];
    for (let sub of subscribers) {
        subscribersAsOptions.push(
            {
                value: sub.subscriber_ID,
                text: `${sub.subscriber_ID}, ${sub.first_name} ${sub.last_name}`
            }
        )
    }
    console.log(subscribersAsOptions)
    return subscribersAsOptions;
};


export async function getEpisodesAsOptions() {
    const episodes = await getEntityData('episodes');
    let episodesAsOptions = [[]];
    for (let ep of episodes) {
        episodesAsOptions.push(
            {
                value: ep.episode_ID,
                text: `${ep.episode_ID}, ${ep.title}`
            }
        )
    }
    console.log(episodesAsOptions)
    return episodesAsOptions;
};
