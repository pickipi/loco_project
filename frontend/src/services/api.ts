import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface SignupRequest {
  username: string;
  email: string;
  password: string;
  phoneNumber: string;
  type: 'GUEST' | 'HOST';
}

export interface SignupResponse {
  id: number;
  username: string;
  email: string;
  phoneNumber: string;
  rating: number;
}

export const userApi = {
  signup: async (data: SignupRequest): Promise<SignupResponse> => {
    const response = await api.post<SignupResponse>('/users', data);
    return response.data;
  },
}; 