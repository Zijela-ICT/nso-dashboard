"use client";

import React, { useState } from "react";
import request from "@/utils/api";
import { showToast } from "@/utils/toast";

interface Practitioner {
  regNumber: string;
  firstName: string;
  lastName: string;
  cadre: string;
  email?: string | null;
  mobile?: string | null;
  regIssuedAt?: string | Date | null;
  regExpiration?: string | Date | null;
  chprbnStatus?: string | null;
  avatar?: string | null;
}

export default function PractitionerCheckPage() {
  const [regNo, setRegNo] = useState("");
  const [practitioner, setPractitioner] = useState<Practitioner | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchPractitioner = async () => {
    const trimmed = regNo.trim();
    if (!trimmed) {
      showToast("Please enter a registration number", "error");
      return;
    }

    setLoading(true);
    setPractitioner(null);

    try {
      // request uses CONFIG.API_BASE_URL as base; endpoint expected: /practitioner/:regNo
      const res = await request(
        "get",
        `/practitioner/${encodeURIComponent(trimmed)}`,
        null,
        false,
        true
      );
      // API wrapper returns response.data; controller returns { message, data }
      const data = res?.data ?? res;
      if (!data) {
        showToast("Practitioner not found", "error");
        setPractitioner(null);
        return;
      }
      setPractitioner(data);
    } catch (err: any) {
      console.error(err);
      const msg = err?.message || "Failed to fetch practitioner";
      showToast(msg, "error");
      setPractitioner(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Practitioner Lookup</h1>

      <div className="flex gap-2 mb-4">
        <input
          className="flex-1 border rounded px-3 py-2"
          placeholder="Enter registration number (e.g. ABC123)"
          value={regNo}
          onChange={(e) => setRegNo(e.target.value)}
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          onClick={fetchPractitioner}
          disabled={loading}
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {practitioner ? (
        <section className="bg-white shadow rounded p-4">
          <div className="flex items-center gap-4">
            {practitioner.avatar ? (
              <img
                src={practitioner.avatar}
                alt={`${practitioner.firstName} ${practitioner.lastName}`}
                className="w-20 h-20 rounded-full object-cover"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
                N/A
              </div>
            )}

            <div>
              <h2 className="text-xl font-bold">
                {practitioner.firstName} {practitioner.lastName}
              </h2>
              <p className="text-sm text-gray-600">{practitioner.cadre}</p>
              <p className="text-sm text-gray-600">
                Reg#: {practitioner.regNumber}
              </p>
              <p className="text-sm text-gray-600">
                Status: {practitioner.chprbnStatus}
              </p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            <div>
              <strong>Email:</strong>
              <div>{practitioner.email ?? "—"}</div>
            </div>
            <div>
              <strong>Mobile:</strong>
              <div>{practitioner.mobile ?? "—"}</div>
            </div>
            <div>
              <strong>Issued:</strong>
              <div>
                {practitioner.regIssuedAt
                  ? new Date(practitioner.regIssuedAt).toLocaleDateString()
                  : "—"}
              </div>
            </div>
            <div>
              <strong>Expires:</strong>
              <div>
                {practitioner.regExpiration
                  ? new Date(practitioner.regExpiration).toLocaleDateString()
                  : "—"}
              </div>
            </div>
          </div>
        </section>
      ) : (
        <p className="text-sm text-gray-500">No practitioner loaded.</p>
      )}
    </main>
  );
}
