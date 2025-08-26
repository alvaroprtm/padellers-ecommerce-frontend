import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [errorMessages, setErrorMessages] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', password_confirmation: '', role: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setFormData(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData)
    const ok = await register(formData as any);
    if (ok) navigate('/login');
    else setErrorMessages('Registration failed');
  };
  return (
    <div className="flex flex-col min-h-full justify-center py-12">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm pb-4">
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-white">Register</h2>
      </div>
      <form onSubmit={handleSubmit} className="mx-10 px-10">
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          {/* Form fields */}
          <div className="sm:col-span-4 mt-2">
            <label htmlFor="name" className="block text-sm/6 font-medium text-white">Name</label>
            <div className="mt-3">
              <input
                required
                id="name"
                type="text"
                name="name"
                onChange={handleChange}
                className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
              />
            </div>
          </div>
          <div className="sm:col-span-4 mt-2">
            <label htmlFor="email" className="block text-sm/6 font-medium text-white">Email address</label>
            <div className="mt-3">
              <input
                required
                id="email"
                type="email"
                name="email"
                onChange={handleChange}
                className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
              />
            </div>
          </div>
          <div className="sm:col-span-4 mt-2">
            <label htmlFor="password" className="block text-sm/6 font-medium text-white">Password</label>
            <div className="mt-3">
              <input
                required
                id="password"
                type="password"
                name="password"
                onChange={handleChange}
                className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
              />
            </div>
          </div>
          <div className="sm:col-span-4 mt-2">
            <label htmlFor="password_confirmation" className="block text-sm/6 font-medium text-white">Confirm Password</label>
            <div className="mt-3">
              <input
                required
                id="password_confirmation"
                type="password"
                name="password_confirmation"
                onChange={handleChange}
                className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
              />
            </div>
          </div>

          {/* Role selection */}
          <div className="sm:col-span-4 mt-2">
            <label htmlFor="role" className="block text-sm/6 font-medium text-white">Type</label>
            <div className="mt-3">
            <select
                id="role"
                name="role"
                required
                value={formData.role}
                onChange={handleChange}
                className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
            >
                <option value="" disabled>-- Select --</option>
                <option value="supplier">Supplier</option>
                <option value="user">Customer</option>
            </select>
            </div>
          </div>
        </div>

        {/* Display error messages */}
        {errorMessages && (
          <div className="mt-3 text-sm text-red-500">
            {errorMessages.split('\n').map((message, index) => (
              <p key={index}>{message}</p>
            ))}
          </div>
        )}

        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button type="submit" className="rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">Save</button>
        </div>
      </form>
    </div>
  );
};

export default Register;