// pages/index.js
import { useState } from "react";

export default function Home() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResult(null);
    setLoading(true);

    const form = new FormData(e.target);
    const res = await fetch("/api/zip-crack", {
      method: "POST",
      body: form,
    });
    const json = await res.json();
    setResult(json);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">
          ZIP Password Brute Force
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="file"
            name="zipfile"
            accept=".zip"
            required
            className="border w-full rounded p-2"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-xl font-semibold hover:bg-blue-700 transition"
            disabled={loading}
          >
            {loading ? "Mencari password..." : "Cari Password"}
          </button>
        </form>
        <div className="mt-6 text-center">
          {result && (
            <>
              {result.password ? (
                <div className="text-green-700 font-bold">
                  Password ditemukan: <span className="font-mono">{result.password}</span>
                </div>
              ) : (
                <div className="text-red-600">
                  Password **tidak ditemukan** (uji max 3 karakter)
                </div>
              )}
              <div className="text-sm mt-2 text-gray-600">
                Jumlah kombinasi diuji: {result.tested}
              </div>
            </>
          )}
        </div>
        <div className="text-xs mt-6 text-gray-400 text-center">
          Limit demo: Password max 3 karakter (huruf & angka).<br />
          Untuk password panjang, jalankan brute-force di PC/Laptop.
        </div>
      </div>
    </div>
  );
}
