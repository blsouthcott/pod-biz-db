import { configureStore } from '@reduxjs/toolkit';
import { entitiesReducer } from './reducers/reducers';

export default configureStore({
    reducer: {
        entityData: entitiesReducer,
    },
})
