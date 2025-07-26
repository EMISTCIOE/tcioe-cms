// import { createSlice } from '@reduxjs/toolkit';
// import { ICampusInfo } from './types';

// interface CampusInfoState {
//   currentCampus: ICampusInfo | null;
//   isLoading: boolean;
//   error: string | null;
// }

// const initialState: CampusInfoState = {
//   currentCampus: null,
//   isLoading: false,
//   error: null
// };

// const campusInfoSlice = createSlice({
//   name: 'campusInfo',
//   initialState,
//   reducers: {
//     resetCampusInfo: () => initialState,
//     setCurrentCampus: (state, action) => {
//       state.currentCampus = action.payload;
//     }
//   },
//   extraReducers: (builder) => {

//   }
// });

// export const { resetCampusInfo, setCurrentCampus } = campusInfoSlice.actions;
// export default campusInfoSlice.reducer;
