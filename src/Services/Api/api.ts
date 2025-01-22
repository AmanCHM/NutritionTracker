import {
  createApi,
  fetchBaseQuery,
  BaseQueryFn,
  BaseQueryApi,
} from "@reduxjs/toolkit/query/react";

import { ResponseOptions } from "./api.d";
import { API_BASE_URL } from "./Constants";
import { RootState } from "../../Store";
import { hideLoader, showLoader } from "../../Store/Loader";

// Base query function
const baseQuery: BaseQueryFn = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: async (headers, { getState }) => {

    headers.set("x-app-id", import.meta.env.VITE_NUTRITIONIX_APP_ID);
    headers.set("x-app-key", import.meta.env.VITE_NUTRITIONIX_APP_KEY);
    headers.set("Content-Type", "application/json");
    return headers;
  },
});


const baseQueryWithInterceptor = async (
  args: unknown,
  api: BaseQueryApi,
  extraOptions: object
) => {
  const { dispatch } = api;


  dispatch(showLoader());

  // Make the API request using the base query
  const result = await baseQuery(args, api, extraOptions);

  // Dispatch loading action after the request finishes
  dispatch(hideLoader());

  // Handle 401 Unauthorized error (e.g., clear user details)
  if (
    (result as ResponseOptions).error &&
    (result as ResponseOptions).error.status === 401
  ) {
    // dispatch(clearUserDetails());    // Clear user details
  }

  // Return the result of the query
  return result;
};

const api = createApi({
  baseQuery: baseQueryWithInterceptor,
  endpoints: () => ({}),
});

export default api;
