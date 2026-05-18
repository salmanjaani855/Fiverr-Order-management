'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const { register, login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '', firstName: '', lastName: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(formData.email, formData.password, formData.firstName, formData.lastName);
      await login(formData.email, formData.password);
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#020617] flex items-center justify-center px-4 py-10">

  {/* Background Effects */}
  <div className="absolute inset-0">
    <div className="absolute top-[-120px] left-[-120px] w-[320px] h-[320px] bg-green-500/20 rounded-full blur-3xl animate-pulse"></div>
    <div className="absolute bottom-[-150px] right-[-120px] w-[350px] h-[350px] bg-emerald-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
    <div className="absolute top-[40%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-green-500/5 rounded-full blur-3xl"></div>
  </div>

  {/* Grid */}
  <div className="absolute inset-0 opacity-[0.04]">
    <div className="h-full w-full bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:60px_60px]"></div>
  </div>

  {/* Container */}
  <div className="relative z-10 w-full max-w-md animate-fade-up">

    <div className="relative overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.07] backdrop-blur-2xl shadow-[0_25px_100px_rgba(0,0,0,0.55)]">

      {/* Glow line */}
      <div className="absolute top-0 left-0 h-[2px] w-full bg-gradient-to-r from-transparent via-green-400/80 to-transparent"></div>

      <div className="p-8 sm:p-10">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/30">
            <span className="text-white text-2xl font-black">
  <svg
    className="w-6 h-6 text-white inline-block"
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    <path d="M3 10h2v10H3V10zm4-4h2v14H7V6zm4 7h2v7h-2v-7zm4-6h2v13h-2V7zm4 3h2v10h-2V10z"/>
  </svg>
</span>
          </div>

<div className="flex items-center gap-3">
  <div className="w-3 h-3 rounded-full bg-[#2ecc71] shadow-md" />
  <h1 className="text-2xl font-bold text-white hidden sm:block">
    Fiverr <span className="text-[#2ecc71]">Orders</span>
  </h1>
</div>

          <p className="text-gray-400 text-sm mt-2">
            Create your account
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {error && (
            <div className="animate-shake bg-red-500/10 border border-red-500/20 text-red-300 px-4 py-3 rounded-2xl text-sm">
              {error}
            </div>
          )}

          {/* Email */}
          <div className="space-y-2">
            <label className="text-sm text-gray-200">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              required
              className="w-full h-12 px-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-gray-500 outline-none focus:border-green-400 focus:ring-4 focus:ring-green-500/10 transition"
            />
          </div>

          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-gray-200">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="John"
                className="w-full h-12 px-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-gray-500 outline-none focus:border-green-400 focus:ring-4 focus:ring-green-500/10 transition"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-200">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Doe"
                className="w-full h-12 px-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-gray-500 outline-none focus:border-green-400 focus:ring-4 focus:ring-green-500/10 transition"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="text-sm text-gray-200">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              className="w-full h-12 px-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-gray-500 outline-none focus:border-green-400 focus:ring-4 focus:ring-green-500/10 transition"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="relative cursor-pointer overflow-hidden group w-full h-12 rounded-2xl bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 text-white font-semibold transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_10px_40px_rgba(34,197,94,0.45)] disabled:opacity-50"
          >
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

            <span className="relative z-10">
              {loading ? 'Creating Account...' : 'Register'}
            </span>
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-white/10 text-center">
          <p className="text-sm text-gray-400">
            Already have an account?{" "}
            <Link href="/login" className="text-green-400 hover:text-green-300 font-semibold">
              Login
            </Link>
          </p>
        </div>

      </div>
    </div>
  </div>

  {/* Animations */}
  <style>{`
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(40px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @keyframes shake {
      0%,100% { transform: translateX(0); }
      25% { transform: translateX(-4px); }
      75% { transform: translateX(4px); }
    }

    .animate-fade-up {
      animation: fadeUp 0.8s ease-out;
    }

    .animate-shake {
      animation: shake 0.3s ease-in-out;
    }
  `}</style>
</div>
  );
}
