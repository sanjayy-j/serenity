import React, { useState, useEffect } from "react";
import { auth, provider, signInWithPopup, signOut } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function LoginPage({ onLogin }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser && onLogin) onLogin(currentUser);
    });
    return () => unsubscribe();
  }, [onLogin]);

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      alert("Google sign-in failed");
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        <div className="mt-4 text-center">
          {user ? (
            <div>
              <p>Welcome, {user.displayName}</p>
              <button
                onClick={handleSignOut}
                className="mt-2 w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={handleGoogleSignIn}
              className="mt-2 w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition"
            >
              Sign in with Google
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
