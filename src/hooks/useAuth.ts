import api from '../configs/axios';
import { useAppContext } from '../context/AppContext';

interface LoginPayload { email: string; password: string; }
interface RegisterPayload { name: string; email: string; password: string; password_confirmation: string; role: string; }

export function useAuth() {
  const { setUser, setError } = useAppContext();

  const login = async (payload: LoginPayload) => {
    try {
      await api.get('/sanctum/csrf-cookie');
      const res = await api.post('/api/login', payload);
      setUser({ id: res.data.user.id, name: res.data.user.name, token: res.data.token, role: res.data.roles[0], permissions:res.data.permissions });
      return true;
    } catch (e: any) {
      setError(e.response?.data?.message || 'Login failed');
      return false;
    }
  };

  const register = async (payload: RegisterPayload) => {
    try {
      await api.get('/sanctum/csrf-cookie');
      await api.post('/api/register', payload);
      return true;
    } catch (e: any) {
      setError(e.response?.data?.message || 'Registration failed');
      return false;
    }
  };

  const logout = async () => {
    try {
      await api.post('/api/logout');
    } catch {
      // ignore
    } finally {
      localStorage.removeItem('token');
      setUser(null as any);
    }
  };

  return { login, register, logout };
}