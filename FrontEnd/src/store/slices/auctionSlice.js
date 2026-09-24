import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const auctionSlice = createSlice({
  name: "auction",

  initialState: {
    loading: false,
    itemDetail: {},
    auctionDetails: {},
    auctionBidders: [],
    myAuctions: [],
    allAuctions: [],
  },

  reducers: {
    createAuctionRequest(state) {
      state.loading = true;
    },

    createAuctionSuccess(state) {
      state.loading = false;
    },

    createAuctionFailed(state) {
      state.loading = false;
    },

    getAllAuctionItemRequest(state) {
      state.loading = true;
    },

    getAllAuctionItemSuccess(state, action) {
      state.loading = false;
      state.allAuctions = action.payload;
    },

    getAllAuctionItemFailed(state) {
      state.loading = false;
      state.allAuctions = [];
    },

    getAuctionDetailRequest(state) {
      state.loading = true;
    },

    getAuctionDetailSuccess(state, action) {
      state.loading = false;
      state.auctionDetails = action.payload.auctionItem;
      state.auctionBidders = action.payload.bidders || [];
    },

    getAuctionDetailFailed(state) {
      state.loading = false;
    },
    getMyAuctionItemsRequest(state) {
      state.loading = true;
    },

    getMyAuctionItemsSuccess(state, action) {
      state.loading = false;
      state.myAuctions = action.payload;
    },

    getMyAuctionItemsFailed(state) {
      state.loading = false;
      state.myAuctions = [];
    },

    resetSlice(state) {
      state.loading = false;
    },
  },
});

export const getAllAuctionItems = () => async (dispatch) => {
  dispatch(auctionSlice.actions.getAllAuctionItemRequest());

  try {
    const response = await axios.get(
      "https://auction-platform-lwfk.onrender.com/api/v1/auctionitem/allitems",
      {
        withCredentials: true,
      },
    );

    dispatch(
      auctionSlice.actions.getAllAuctionItemSuccess(response.data.items || []),
    );
  } catch (error) {
    dispatch(auctionSlice.actions.getAllAuctionItemFailed());

    console.error(
      "Get all auction items error:",
      error.response?.data || error.message,
    );
  }
};

export const getAuctionDetail = (id) => async (dispatch) => {
  dispatch(auctionSlice.actions.getAuctionDetailRequest());

  try {
    const response = await axios.get(
      `https://auction-platform-lwfk.onrender.com/api/v1/auctionitem/auction/${id}`,
      {
        withCredentials: true,
      },
    );

    dispatch(auctionSlice.actions.getAuctionDetailSuccess(response.data));
  } catch (error) {
    dispatch(auctionSlice.actions.getAuctionDetailFailed());

    console.error(
      "Get auction detail error:",
      error.response?.data || error.message,
    );
  }
};
export const getMyAuctionItems = () => async (dispatch) => {
  dispatch(auctionSlice.actions.getMyAuctionItemsRequest());

  try {
    const response = await axios.get(
      "https://auction-platform-lwfk.onrender.com/api/v1/auctionitem/myitems",
      {
        withCredentials: true,
      },
    );

    dispatch(
      auctionSlice.actions.getMyAuctionItemsSuccess(response.data.items || []),
    );
  } catch (error) {
    dispatch(auctionSlice.actions.getMyAuctionItemsFailed());

    console.error(
      "Get my auction items error:",
      error.response?.data || error.message,
    );
  }
};

export const createAuction = (data) => async (dispatch) => {
  dispatch(auctionSlice.actions.createAuctionRequest());

  try {
    const response = await axios.post(
      "https://auction-platform-lwfk.onrender.com/api/v1/auctionitem/create",
      data,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    dispatch(auctionSlice.actions.createAuctionSuccess());

    toast.success(response.data.message);
  } catch (error) {
    dispatch(auctionSlice.actions.createAuctionFailed());

    toast.error(error.response?.data?.message || "Failed to create auction");

    console.error(
      "Create auction error:",
      error.response?.data || error.message,
    );
  }
};

export default auctionSlice.reducer;
