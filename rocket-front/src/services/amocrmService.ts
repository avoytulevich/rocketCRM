import axios from "axios";

const API_BASE_URL = process.env.VUE_APP_API_BASE_URL;

export const getLeads = async (query?: string) => {
  try {
    let url = `${API_BASE_URL}/leads`;

    if (query && query.length >= 3) {
      url += `?query=${encodeURIComponent(query)}`;
    }

    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching leads:", error);
    throw error;
  }
};
