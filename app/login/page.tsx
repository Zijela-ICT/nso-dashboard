"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CHPBRN_TOKEN } from "@/constants";
import { loginUser } from "@/services/auth.services";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Simple validation
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      const response = await loginUser({
        email,
        password,
      });

      console.log(response.data);
      localStorage.setItem(CHPBRN_TOKEN, response.data.data.token);
      router.push("/dashboard/home");
      setEmail("");
      setPassword("");
      setError("");
    } catch (error) {}
  };

  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      setEmail("dev@zijela.com");
      setPassword("zijela");
    }
  }, []);

  return (
    <div style={{ maxWidth: "400px", margin: "auto", padding: "20px" }}>
      <h2>Login</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit} className="w-[400px] mx-auto bg-[#fafafa]">
        <div>
          <label>Email:</label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-2">
          <label>Password:</label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <Button type="submit">Login</Button>
      </form>
    </div>
  );
};

export default LoginPage;
