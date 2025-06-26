import { createSlice } from '@reduxjs/toolkit'
const initialState ={
    video: null,
}
export const plaVideoSlice = createSlice({
    name:"playVideo",
    initialState,
    reducers:{
        play :(state,action)=>{
            state.video = action.payload
        }
    }
});
export const {play} = plaVideoSlice.actions;
export default plaVideoSlice.reducer;