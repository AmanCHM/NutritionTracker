import api from '../../api';

export const userApi = api.injectEndpoints({
  endpoints: (build :any) => ({
    fetchSuggestions: build.query({
      query: (query: string) => `search/instant/?query=${query}`,
    }),
    addMeal: build.mutation({
      query: (select: string) => ({
        url: `natural/nutrients`,
        method: "POST",
        body: { query: select },
      }),
    }),
  }),
  overrideExisting: false,
});


export const { useFetchSuggestionsQuery, useAddMealMutation } = userApi;