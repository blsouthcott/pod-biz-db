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
