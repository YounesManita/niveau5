
"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();


  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    console.log(token);
    
    if (token) {
       
          router.push('/Post');
       
   
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/user/login', {
        email,
        password,
      });
      console.log(response.data.user);

      if(response.status==200){
      
      const data = response.data;
      localStorage.setItem('token', data.token);
      localStorage.setItem('role',data.user.role)
      localStorage.setItem('iduser',data.user.id)

     
          router.push('/Post');
     

     
   
   
   
    }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        const errorMessage = err.response?.data?.message || 'Login failed';
        setError(errorMessage);
      } else {
        setError('An error occurred during login. Please try again.');
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-green-400 via-teal-500 to-blue-600">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-3xl font-bold mb-6 text-center text-teal-600">Login to Your Account</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 mb-4 border border-gray-300 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 mb-6 border border-gray-300 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full p-3 text-white bg-teal-600 rounded hover:bg-teal-700"
          >
            Login
          </button>
                <p className="mt-4 text-center">
        Don't have an account?{' '}
        <Link className="text-teal-600 hover:underline" href="/">
        Sign up here
        </Link>
      </p>

        </form>

        {error && <p className="mt-4 text-center text-red-500">{error}</p>}
      </div>
    </div>
  );
};

export default Login;
