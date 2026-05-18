'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
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

  {/* Grid Background */}
  <div className="absolute inset-0 opacity-[0.04]">
    <div className="h-full w-full bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:60px_60px]"></div>
  </div>

  {/* Main Container */}
  <div className="relative z-10 w-full max-w-md animate-fade-up">

    <div className="relative overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.07] backdrop-blur-2xl shadow-[0_25px_100px_rgba(0,0,0,0.55)]">

      {/* Glass Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none"></div>

      {/* Top Glow Line */}
      <div className="absolute top-0 left-0 h-[2px] w-full bg-gradient-to-r from-transparent via-green-400/80 to-transparent"></div>

      <div className="p-8 sm:p-10">

        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="relative group">

            {/* Glow */}
            <div className="absolute inset-0 rounded-3xl bg-green-500 blur-xl opacity-40 group-hover:opacity-70 transition duration-500"></div>

            <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center border border-white/20 shadow-2xl shadow-green-500/20">
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
          </div>
        </div>

        {/* Heading */}
        <div className="text-center mb-8">
<div className="flex items-center gap-3">
  <div className="w-3 h-3 rounded-full bg-[#2ecc71] shadow-md" />
  <h1 className="text-2xl font-bold text-white hidden sm:block">
    Fiverr <span className="text-[#2ecc71]">Orders</span>
  </h1>
</div>

          <p className="text-gray-400 text-sm mt-2 leading-relaxed">
            Secure access to your professional workspace
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Error */}
          {error && (
            <div className="animate-shake bg-red-500/10 border border-red-500/20 text-red-300 px-4 py-3 rounded-2xl text-sm backdrop-blur-sm">
              {error}
            </div>
          )}

          {/* Email */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-200">
              Email Address
            </label>

            <div className="relative group">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full h-14 rounded-2xl bg-white/5 border border-white/10 pl-5 pr-4 text-white placeholder:text-gray-500 outline-none transition-all duration-300 focus:border-green-400 focus:bg-white/10 focus:ring-4 focus:ring-green-500/10"
              />

              <div className="absolute inset-0 rounded-2xl border border-green-400/0 group-focus-within:border-green-400/40 pointer-events-none transition-all duration-300"></div>
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-200">
              Password
            </label>

            <div className="relative group">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="w-full h-14 rounded-2xl bg-white/5 border border-white/10 pl-5 pr-4 text-white placeholder:text-gray-500 outline-none transition-all duration-300 focus:border-green-400 focus:bg-white/10 focus:ring-4 focus:ring-green-500/10"
              />

              <div className="absolute inset-0 rounded-2xl border border-green-400/0 group-focus-within:border-green-400/40 pointer-events-none transition-all duration-300"></div>
            </div>
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="relative cursor-pointer overflow-hidden group w-full h-14 rounded-2xl bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 text-white font-semibold tracking-wide transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_10px_40px_rgba(34,197,94,0.45)] disabled:opacity-50 disabled:cursor-not-allowed"
          >

            {/* Shine Animation */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

            <span className="relative z-10">
              {loading ? 'Logging in...' : 'Login to Dashboard'}
            </span>
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-white/10 text-center">
          <p className="text-sm text-gray-400">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="text-green-400 hover:text-green-300 font-semibold transition duration-300"
            >
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>

    {/* Bottom Text */}
    <p className="text-center text-gray-500 text-[11px] mt-6 tracking-[0.18em] uppercase">
      Demo Access • test@example.com / password123
    </p>
  </div>

  <style>{`
    @keyframes fadeUp {
      from {
        opacity: 0;
        transform: translateY(40px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes shake {
      0%, 100% {
        transform: translateX(0);
      }
      25% {
        transform: translateX(-4px);
      }
      75% {
        transform: translateX(4px);
      }
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
