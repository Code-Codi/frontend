import axios from "axios";

export const createSchedule = async (scheduleData) => {
  try {
    const response = await axios.post("/api/schedules", scheduleData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getSchedule = async (year, month) => {
  try {
    const response = await axios.get(
      `/api/schedules?year=${year}&month=${month}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateSchedule = async (id, scheduleData) => {
  try {
    const response = await axios.patch(`/api/schedules/${id}`, scheduleData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteSchedule = async (id) => {
  try {
    const response = await axios.delete(`/api/schedules/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
