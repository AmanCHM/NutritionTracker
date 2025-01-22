import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface LoggedState {
  logged: boolean;
  signedup: boolean;
}

const initialState: LoggedState = {
  logged: false,
  signedup: true,
};

const authSlice = createSlice({
  name: "logged",
  initialState,
  reducers: {
    loggedin: (state) => {
      state.logged = true;
    },
    loggedout: (state) => {
      state.logged = false;
    },
    setSignup: (state) => {
      state.signedup = true;
    },
    setSignout: (state) => {
      state.signedup = false;
    },
  },
});

export const { loggedin, loggedout, setSignup, setSignout } = authSlice.actions;
export default authSlice.reducer;