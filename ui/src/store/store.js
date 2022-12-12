import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { entitiesReducer } from './reducers/reducers';


const persistConfig = {
    key: 'root',
    storage,
};

const persistedReducer = persistReducer(persistConfig, entitiesReducer);

export default () => {
    let store = configureStore({reducer: {entityData: persistedReducer}});
    let persistor = persistStore(store);
    return { store, persistor }
}

// export default configureStore({
//     reducer: {
//         entityData: entitiesReducer,
//     },
// })
