import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const userSlice = createSlice({
  name: "user",

  initialState: {
    loading: false,
    isAuthenticated: false,
    user: {},
    leaderboard: [],
  },

  reducers: {
    registerRequest(state) {
      state.loading = true;
      state.isAuthenticated = false;
      state.user = {};
    },

    registerSuccess(state, action) {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
    },

    registerFailed(state) {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = {};
    },

    loginRequest(state) {
      state.loading = true;
      state.isAuthenticated = false;
      state.user = {};
    },

    loginSuccess(state, action) {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
    },

    loginFailed(state) {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = {};
    },

    fetchUserRequest(state) {
      state.loading = true;
    },

    fetchUserSuccess(state, action) {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
    },

    fetchUserFailed(state) {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = {};
    },

    logoutSuccess(state) {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = {};
    },

    logoutFailed(state) {
      state.loading = false;
    },

    fetchLeaderboardRequest(state) {
      state.loading = true;
      state.leaderboard = [];
    },

    fetchLeaderboardSuccess(state, action) {
      state.loading = false;
      state.leaderboard = action.payload;
    },

    fetchLeaderboardFailed(state) {
      state.loading = false;
      state.leaderboard = [];
    },

    clearAllErrors(state) {
      state.loading = false;
    },
  },
});

// REGISTER
export const register = (data) => async (dispatch) => {
  dispatch(userSlice.actions.registerRequest());

  try {
    const response = await axios.post(
      "http://localhost:5000/api/v1/user/register",
      data,
      {
        withCredentials: true,
      },
    );

    dispatch(userSlice.actions.registerSuccess(response.data));
    toast.success(response.data.message);
    dispatch(userSlice.actions.clearAllErrors());
  } catch (error) {
    dispatch(userSlice.actions.registerFailed());
    toast.error(error.response?.data?.message || "Registration failed");
    dispatch(userSlice.actions.clearAllErrors());
  }
};

// LOGIN
export const login = (data) => async (dispatch) => {
  dispatch(userSlice.actions.loginRequest());

  try {
    const response = await axios.post(
      "http://localhost:5000/api/v1/user/login",
      data,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    dispatch(userSlice.actions.loginSuccess(response.data));

    toast.success(response.data.message || "Login successful");

    dispatch(userSlice.actions.clearAllErrors());
  } catch (error) {
    dispatch(userSlice.actions.loginFailed());

    toast.error(error.response?.data?.message || "Login failed");

    console.error("Login error:", error.response?.data || error.message);

    dispatch(userSlice.actions.clearAllErrors());
  }
};

// LOGOUT
export const logout = () => async (dispatch) => {
  try {
    const response = await axios.get(
      "http://localhost:5000/api/v1/user/logout",
      {
        withCredentials: true,
      },
    );

    dispatch(userSlice.actions.logoutSuccess());

    toast.success(response.data.message || "Logged out successfully");

    dispatch(userSlice.actions.clearAllErrors());
  } catch (error) {
    dispatch(userSlice.actions.logoutFailed());

    toast.error(error.response?.data?.message || "Logout failed");

    console.error("Logout error:", error.response?.data || error.message);

    dispatch(userSlice.actions.clearAllErrors());
  }
};

// FETCH USER
export const fetchUser = () => async (dispatch) => {
  dispatch(userSlice.actions.fetchUserRequest());

  try {
    const response = await axios.get("http://localhost:5000/api/v1/user/me", {
      withCredentials: true,
    });

    dispatch(userSlice.actions.fetchUserSuccess(response.data.user));
  } catch (error) {
    dispatch(userSlice.actions.fetchUserFailed());

    console.error("Fetch user error:", error.response?.data || error.message);
  }
};

// FETCH LEADERBOARD
export const fetchLeaderboard = () => async (dispatch) => {
  dispatch(userSlice.actions.fetchLeaderboardRequest());

  try {
    const response = await axios.get(
      "http://localhost:5000/api/v1/user/leaderboard",
      {
        withCredentials: true,
      },
    );
    console.log("LEADERBOARD RESPONSE:", response.data);
    console.log("LEADERBOARD USERS:", response.data.leaderboard);

    dispatch(
      userSlice.actions.fetchLeaderboardSuccess(
        response.data.leaderboard || [],
      ),
    );
  } catch (error) {
    dispatch(userSlice.actions.fetchLeaderboardFailed());

    console.error("Leaderboard error:", error.response?.data || error.message);
  }
};

export default userSlice.reducer;
