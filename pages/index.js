// pages/index.js
import { useState } from "react";

export default function Home() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = new FormData(e.target);
    const res = await fetch('/api/zip-crack', {
      method: 'POST',
      body: data
    });
    const json = await res.json();
    setResult(json);
    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">ZIP Password Brute Force (Demo)</h1>
      <form onSubmit={handleSubmit} className="mb-4" encType="multipart/form-data">
        <input type="file" name="zipfile" accept=".zip" required className="mb-2" />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Cari Password</button>
      </form>
      {loading && <div>Mencari password, mohon tunggu...</div>}
      {result && (
        <div className="mt-4">
          <div>Hasil: {result.password ? <b>Password ditemukan: {result.password}</b> : "Password tidak ditemukan (coba password max 3 karakter)"}</div>
          <div>Password diuji: {result.tested}</div>
        </div>
      )}
    </div>
  );
      }
