import React, { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useCurrentUser } from "../lib/hooks";

const LoginPage = () => {
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState("");
  const [user, { mutate }] = useCurrentUser();
  useEffect(() => {
    // redirect to home if user is authenticated
    if (user) router.push("/");
  }, [user]);

  async function onSubmit(e) {
    e.preventDefault();
    const body = {
      email: e.currentTarget.email.value,
      password: e.currentTarget.password.value,
    };
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.status === 200) {
      const userObj = await res.json();
      mutate(userObj);
    } else {
      setErrorMsg("Incorrect username or password. Try again!");
    }
  }

  return (
    <div className="lg:container lg:mx-auto px-3 py-10 flex justify-center">
      <div className="w-full max-w-xs">
        <Head>
          <title>Sign in</title>
        </Head>
        <form
          className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
          onSubmit={onSubmit}
        >
          <h1 className="text-center font-bold mb-5">Sign in</h1>
          {errorMsg ? <p className="text-red-600">{errorMsg}</p> : null}
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="email"
          >
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="email"
              name="email"
              placeholder="Email address"
            />
          </label>
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="password"
          >
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              name="password"
              placeholder="Password"
            />
          </label>
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Sign in
            </button>
            <a
              className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
              href="/forget-password"
            >
              Forget password
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
