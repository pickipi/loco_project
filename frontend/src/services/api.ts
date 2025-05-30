import api from "@/lib/axios";

export interface SignupRequest {
  username: string;
  email: string;
  password: string;
  phoneNumber: string;
  type: "GUEST" | "HOST";
}

export interface SignupResponse {
  id: number;
  username: string;
  email: string;
  phoneNumber: string;
  rating: number;
}

export interface HostRequestDto {
  // businessName?: string;      // 사업자명
  // businessNumber?: string;    // 사업자등록번호
  bankName: string; // 은행명
  bankAccountNumber: string; // 계좌번호
  bankAccountHolder: string; // 예금주
  description: string; // 호스트 소개
}

export const userApi = {
  signup: async (data: SignupRequest): Promise<SignupResponse> => {
    const response = await api.post<SignupResponse>("/api/v1/users", data);
    return response.data;
  },
};

export const hostApi = {
  register: async (userId: number, data: HostRequestDto) => {
    const response = await api.post(`/api/v1/hosts/${userId}`, data);
    return response.data;
  },
};
