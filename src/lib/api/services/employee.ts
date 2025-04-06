import { apiClient } from '../client';
import { Employee } from '@/lib/types/employee';

export const employeeService = {
  // 직원 목록 조회
  getEmployees: async () => {
    const response = await apiClient.get<Employee[]>('/employees');
    return response.data;
  },

  // 직원 상세 정보 조회
  getEmployee: async (id: string) => {
    const response = await apiClient.get<Employee>(`/employees/${id}`);
    return response.data;
  },

  // 직원 등록
  createEmployee: async (employee: Omit<Employee, 'id'>) => {
    const response = await apiClient.post<Employee>('/employees', employee);
    return response.data;
  },

  // 직원 정보 수정
  updateEmployee: async (id: string, employee: Partial<Employee>) => {
    const response = await apiClient.put<Employee>(`/employees/${id}`, employee);
    return response.data;
  },

  // 직원 삭제
  deleteEmployee: async (id: string) => {
    await apiClient.delete(`/employees/${id}`);
  }
}; 