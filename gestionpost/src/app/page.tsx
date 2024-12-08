"use client"
import Link from 'next/link';
import { useState, FormEvent,useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function Signup() {
  const [firstname, setFirstName] = useState('');
  const [LastName, setLastName] = useState('');
  const [email, setemail] = useState('');
  const [Password, setPassword] = useState('');
  const [message, setMessage] = useState('');  
  const router = useRouter();
  const [isError, setIsError] = useState(false);  
  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    console.log(token);
    
    if (token) {
       
          router.push('/Post');
       
   
    }
  }, [router]);

  const handleSignup = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(''); 
    setIsError(false);

    
    const formdata = {
      nom: firstname,
      prenom: LastName,
      email: email,
      password: Password
    };

    try {
      const response = await axios.post(`http://localhost:5000/user/adduser`, formdata);
      if (response.status == 200) {
        setMessage("User enregistré avec succès !");
      }
    } catch (error: any) {
      if (error.response && error.response.status === 400) {
       
        setMessage("L'utilisateur existe déjà !");
        setIsError(true);
      } else {
        setMessage("Erreur lors de l'enregistrement de l'utilisateur.");
        setIsError(true);
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-3xl font-bold mb-6 text-center text-indigo-600">Create an Account</h2>
        
        {/* Formulaire */}
        <form onSubmit={handleSignup}>
          <input
            type="text"
            placeholder="First Name"
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full p-3 mb-4 border border-gray-300 rounded"
            required
          />
          <input
            type="text"
            placeholder="Last Name"
            onChange={(e) => setLastName(e.target.value)}
            className="w-full p-3 mb-4 border border-gray-300 rounded"
            required
          />
          <input
            type="email"
            placeholder="Email"
            onChange={(e) => setemail(e.target.value)}
            className="w-full p-3 mb-4 border border-gray-300 rounded"
            required
          />
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 mb-6 border border-gray-300 rounded"
            required
          />
          <button
            type="submit"
            className="w-full  p-3 text-white bg-indigo-600 rounded hover:bg-indigo-700"
          >
            Sign Up
          </button>
        </form>

        
        {message && (
          <div className={`mt-4 p-3 text-center rounded ${isError ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
            {message}
          </div>
        )}

        <p className="mt-4 text-center text-gray-600">
          Already have an account?{' '}
          <Link href="/Login" className="text-indigo-500 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}
