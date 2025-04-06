import { create } from 'zustand';
import { Employee } from '@/lib/types/employee';
import { employeeService } from '@/lib/api/services/employee';

interface EmployeeState {
  employees: Employee[];
  selectedEmployee: Employee | null;
  isLoading: boolean;
  error: string | null;
  fetchEmployees: () => Promise<void>;
  selectEmployee: (employee: Employee | null) => void;
  createEmployee: (employee: Omit<Employee, 'id'>) => Promise<void>;
  updateEmployee: (id: string, employee: Partial<Employee>) => Promise<void>;
  deleteEmployee: (id: string) => Promise<void>;
}

export const useEmployeeStore = create<EmployeeState>((set, get) => ({
  employees: [],
  selectedEmployee: null,
  isLoading: false,
  error: null,

  fetchEmployees: async () => {
    set({ isLoading: true, error: null });
    try {
      const employees = await employeeService.getEmployees();
      set({ employees, isLoading: false });
    } catch (error) {
      set({ error: '직원 목록을 불러오는데 실패했습니다.', isLoading: false });
    }
  },

  selectEmployee: (employee) => {
    set({ selectedEmployee: employee });
  },

  createEmployee: async (employee) => {
    set({ isLoading: true, error: null });
    try {
      const newEmployee = await employeeService.createEmployee(employee);
      set((state) => ({
        employees: [...state.employees, newEmployee],
        isLoading: false
      }));
    } catch (error) {
      set({ error: '직원 등록에 실패했습니다.', isLoading: false });
    }
  },

  updateEmployee: async (id, employee) => {
    set({ isLoading: true, error: null });
    try {
      const updatedEmployee = await employeeService.updateEmployee(id, employee);
      set((state) => ({
        employees: state.employees.map((emp) =>
          emp.id === id ? updatedEmployee : emp
        ),
        isLoading: false
      }));
    } catch (error) {
      set({ error: '직원 정보 수정에 실패했습니다.', isLoading: false });
    }
  },

  deleteEmployee: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await employeeService.deleteEmployee(id);
      set((state) => ({
        employees: state.employees.filter((emp) => emp.id !== id),
        isLoading: false
      }));
    } catch (error) {
      set({ error: '직원 삭제에 실패했습니다.', isLoading: false });
    }
  }
})); 