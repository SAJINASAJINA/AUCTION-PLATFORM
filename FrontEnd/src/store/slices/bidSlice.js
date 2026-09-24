import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const bidSlice = createSlice({
  name: "bid",
  initialState: {
    loading: false,
  },

  reducers: {
    bidRequest(state) {
      state.loading = true;
    },

    bidSuccess(state) {
      state.loading = false;
    },

    bidFailed(state) {
      state.loading = false;
    },
  },
});

export const placeBid = (id, data) => async (dispatch) => {
  dispatch(bidSlice.actions.bidRequest());

  try {
    const response = await axios.post(
      `https://auction-platform-lwfk.onrender.com/api/v1/bid/place/${id}`,
      data,
      {
        withCredentials: true,
      },
    );

    dispatch(bidSlice.actions.bidSuccess());

    toast.success(response.data.message);
  } catch (error) {
    dispatch(bidSlice.actions.bidFailed());

    toast.error(error.response?.data?.message || "Failed to place bid");
  }
};

export default bidSlice.reducer;
