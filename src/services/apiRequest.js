import axios from "axios";

const BASE_URL = "https://swkddnwcmm.us-east-1.awsapprunner.com/users";

export const apiRequest = {
  get: async (urlService, param) => {
    try {
      const response = await axios.get(`${BASE_URL}/${urlService}`, {
        params: param,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching:", error);
      throw error;
    }
  },

  post: async (
    urlService,
    payload,
    param,
    header = {
      "Content-Type": "application/json",
    }
  ) => {
    try {
      const response = await axios.post(`${BASE_URL}/${urlService}`, payload, {
        headers: header,
        params: param,
      });
      return response.data;
    } catch (error) {
      console.error("Error posting:", error);
      throw error;
    }
  },
};
