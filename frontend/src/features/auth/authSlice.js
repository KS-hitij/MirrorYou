import { createSlice } from '@reduxjs/toolkit'
const initialState = {
  user:null,
}
export const authSlice = createSlice({
    name:"auth",
    initialState,
    reducers:{
        logInFeature: (state,action)=>{
            state.user = action.payload;
        },
        logOutFeature: (state,action)=>{
            state.user = null;
        }
    }
})

export const {logInFeature,logOutFeature} = authSlice.actions;

export default authSlice.reducer;