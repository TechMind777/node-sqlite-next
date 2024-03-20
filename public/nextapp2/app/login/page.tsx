"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


import Header from '../components/Header';
import Footer from '../components/Footer'; 


const LoginPage: React.FC = () => {
  const router = useRouter();

  const [username, setUsername] = useState("admin@gmail.com");
  const [password, setPassword] = useState("pass12345");
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        }
      );


      let rData = await response.json();
      
      if (response.ok) {


        localStorage.setItem("user", JSON.stringify(rData))
        // Redirect to user list page upon successful login
        router.push("/user-list");

        toast.success("Login successful");
      } else {
        const data = await response.json();
        setError(data.message);
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error logging in:", error);
      toast.error("An error occurred while logging in");
    }
  };

  return (
    <>
      <div>
        <h1>Login Page</h1>
        <form onSubmit={handleSubmit}>
          <label>
            Username:
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>
          <br />
          <label>
            Password:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <br />
          <button type="submit">Login</button>
        </form>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
      <ToastContainer />
    </>
  );
};

export default LoginPage;
