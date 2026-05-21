"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { useTheme } from "@/context/ThemeContext";
import { usePathname } from "next/navigation";

export function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const getInitial = () => {
    return user?.email.charAt(0).toUpperCase() || "U";
  };

  return (
    <nav className="bg-transparent/30 backdrop-blur-md border-b border-gray-200/20 dark:border-gray-700/40 shadow-sm sticky top-0 z-40 transition-colors duration-300">
      <div className="max-w-full px-4 md:px-6 py-3.5 flex items-center justify-between gap-3">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-[#2ecc71] shadow-md" />
            <h1 className="text-2xl font-bold text-white hidden sm:block">
              Fiverr <span className="text-[#2ecc71]">Orders</span>
            </h1>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/dashboard"
            className={`font-semibold text-sm px-4 py-2 rounded-lg transition-all duration-200 ${pathname === "/dashboard" ? "text-[#2ecc71] bg-white/5" : "text-gray-200 hover:text-white hover:bg-white/5"}`}
          >
            Dashboard
          </Link>

          <Link
            href="/team"
            className={`font-semibold text-sm px-4 py-2 rounded-lg transition-all duration-200 ${pathname === "/team" ? "text-[#2ecc71] bg-white/5" : "text-gray-200 hover:text-white hover:bg-white/5"} flex items-center gap-2`}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
            </svg>
            Team
          </Link>

          <Link
            href="/tasks"
            className={`font-semibold text-sm px-4 py-2 rounded-lg transition-all duration-200 ${pathname === "/tasks" ? "text-[#2ecc71] bg-white/5" : "text-gray-200 hover:text-white hover:bg-white/5"}`}
          >
            Tasks
          </Link>

          {/* <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-gray-200/50 dark:bg-gray-700/50 hover:bg-gray-300/50 dark:hover:bg-gray-600/50 border border-gray-300/30 dark:border-gray-600/30 transition-colors duration-200"
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? (
              <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v2a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.536l1.414 1.414a1 1 0 001.414-1.414l-1.414-1.414a1 1 0 00-1.414 1.414zm2.121-10.607a1 1 0 010 1.414l-1.414 1.414a1 1 0 11-1.414-1.414l1.414-1.414a1 1 0 011.414 0zM5.464 5.464a1 1 0 00-1.414 1.414L5.464 8.292a1 1 0 001.414-1.414L5.464 5.464zm0 9.172l-1.414 1.414a1 1 0 101.414 1.414l1.414-1.414a1 1 0 00-1.414-1.414zM19 11a1 1 0 110 2h-2a1 1 0 110-2h2zM5 10a1 1 0 110 2H3a1 1 0 110-2h2z" clipRule="evenodd" />
              </svg>
            )}
          </button> */}

          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="w-10 h-10 bg-gradient-to-br text-[#2ecc71] bg-[#2ecc71] hover:cursor-pointer text-white rounded-full flex items-center justify-center font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-200 transform hover:scale-105"
            >
              {getInitial()}
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 py-2 z-50">
                <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {user?.email}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full hover:cursor-pointer text-left px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200 font-medium flex items-center gap-2"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="md:hidden flex items-center gap-2">
          {/* <Link
            href="/tasks"
            className="text-xs font-semibold text-gray-700 dark:text-gray-300 px-2.5 py-1.5 rounded-lg bg-gray-200/50 dark:bg-gray-700/50 border border-gray-300/30 dark:border-gray-600/30"
          >
            Tasks
          </Link> */}


          <div className="md:hidden flex items-center gap-2">
  <Link
    href="/dashboard"
    className="text-xs font-semibold text-gray-700 dark:text-gray-300 px-2.5 py-1.5 rounded-lg bg-gray-200/50 dark:bg-gray-700/50 border border-gray-300/30 dark:border-gray-600/30"
  >
    Dashboard
  </Link>

  <Link
    href="/team"
    className="text-xs font-semibold text-gray-700 dark:text-gray-300 px-2.5 py-1.5 rounded-lg bg-gray-200/50 dark:bg-gray-700/50 border border-gray-300/30 dark:border-gray-600/30"
  >
    Team
  </Link>

  <Link
    href="/tasks"
    className="text-xs font-semibold text-gray-700 dark:text-gray-300 px-2.5 py-1.5 rounded-lg bg-gray-200/50 dark:bg-gray-700/50 border border-gray-300/30 dark:border-gray-600/30"
  >
    Tasks
  </Link>

  {/* Avatar */}
</div>
          {/* <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-gray-200/50 dark:bg-gray-700/50 hover:bg-gray-300/50 dark:hover:bg-gray-600/50 transition-colors duration-200"
          >
            {theme === "light" ? (
              <svg
                className="w-5 h-5 text-gray-700"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            ) : (
              <svg
                className="w-5 h-5 text-yellow-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 2a1 1 0 011 1v2a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.536l1.414 1.414a1 1 0 001.414-1.414l-1.414-1.414a1 1 0 00-1.414 1.414zm2.121-10.607a1 1 0 010 1.414l-1.414 1.414a1 1 0 11-1.414-1.414l1.414-1.414a1 1 0 011.414 0zM5.464 5.464a1 1 0 00-1.414 1.414L5.464 8.292a1 1 0 001.414-1.414L5.464 5.464zm0 9.172l-1.414 1.414a1 1 0 101.414 1.414l1.414-1.414a1 1 0 00-1.414-1.414zM19 11a1 1 0 110 2h-2a1 1 0 110-2h2zM5 10a1 1 0 110 2H3a1 1 0 110-2h2z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </button> */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="w-9 h-9 bg-gradient-to-br from-cyan-500 to-blue-600 text-white rounded-full flex items-center justify-center font-semibold text-sm hover:shadow-lg transition-all duration-200"
            >
              {getInitial()}
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-3 w-48 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50">
                <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                  <p className="text-xs font-medium text-gray-900 dark:text-white truncate">
                    {user?.email}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200 font-medium flex items-center gap-2"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
