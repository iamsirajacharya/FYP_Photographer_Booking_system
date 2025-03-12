import axios from "axios";
import ApiLink from "../../api";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const applyAsPhotographer = createAsyncThunk(
  "user/apply",
  async ({ formData, samplePics }, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const token = state.auth.token; // must be logged in to have a token

      const form = new FormData();
      if (formData.name) form.append("name", formData.name);
      if (formData.camera) form.append("camera", formData.camera);
      if (formData.expertise) form.append("expertise", formData.expertise);
      if (formData.address) form.append("address", formData.address);

      samplePics.forEach((file) => {
        form.append("image", file);
      });

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      };

      const response = await axios.post(
        ApiLink.applyPhotographer.url,
        form,
        config
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.msg || "Something went wrong. Please try again."
      );
    }
  }
);
