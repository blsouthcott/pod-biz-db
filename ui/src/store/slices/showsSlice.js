import { createSlice } from "@reduxjs/toolkit";
import { getEntityData } from "../../utils/entityData";


export const showsSlice = createSlice({
    name: 'shows',
    initialState: {
        value: [],
    },
    reducers: {
        load: (state, action) => {
            state.shows.value = action.payload
        }
    }
});

export const { load } = showsSlice.actions;

const loadShows = () => {
    return async (dispatch, getState) => {
        const shows = await getEntityData('shows');
        dispatch(load(shows));
    };
}

export const selectShows = (state) => state.shows.value;

export default showsSlice.reducer;
