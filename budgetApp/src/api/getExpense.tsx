import axios from "axios";

const API_URL = "http://localhost:3001/expenses";

export const getExpenses = async (): Promise<any[]> => {
  const res = await axios.get(API_URL);
  return res.data;
};
export const getExpenseById = async (id: string): Promise<any> => {
  const res = await axios.get(`${API_URL}/${id}`);
  return res.data;
};
export const addExpense = async (data: any): Promise<any> => {
  const res = await axios.post(API_URL, data);
  return res.data;
};
export const updateExpense = async (id: string, data: any): Promise<any> => {
  const res = await axios.put(`${API_URL}/${id}`, data);
  return res.data;
};
export const deleteExpense = async (id: string): Promise<any> => {
  const res = await axios.delete(`${API_URL}/${id}`);
  return res.data;
};
