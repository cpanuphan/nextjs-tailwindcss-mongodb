import React, { useState, useEffect, useRef } from "react";
import Head from "next/head";
import { useCurrentUser } from "../lib/hooks";

const ProfileSection = () => {
  const [user, { mutate }] = useCurrentUser();
  const [isUpdating, setIsUpdating] = useState(false);
  const nameRef = useRef();
  const bioRef = useRef();
  const profilePictureRef = useRef();
  const [msg, setMsg] = useState({ message: "", isError: false });

  useEffect(() => {
    nameRef.current.value = user.name;
    bioRef.current.value = user.bio;
  }, [user]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isUpdating) return;
    setIsUpdating(true);
    const formData = new FormData();
    if (profilePictureRef.current.files[0]) {
      formData.append("profilePicture", profilePictureRef.current.files[0]);
    }
    formData.append("name", nameRef.current.value);
    formData.append("bio", bioRef.current.value);
    const res = await fetch("/api/user", {
      method: "PATCH",
      body: formData,
    });
    if (res.status === 200) {
      const userData = await res.json();
      mutate({
        user: {
          ...user,
          ...userData.user,
        },
      });
      setMsg({ message: "Profile updated" });
    } else {
      setMsg({ message: await res.text(), isError: true });
    }
  };

  const handleSubmitPasswordChange = async (e) => {
    e.preventDefault();
    const body = {
      oldPassword: e.currentTarget.oldPassword.value,
      newPassword: e.currentTarget.newPassword.value,
    };
    e.currentTarget.oldPassword.value = "";
    e.currentTarget.newPassword.value = "";

    const res = await fetch("/api/user/password", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.status === 200) {
      setMsg({ message: "Password updated" });
    } else {
      setMsg({ message: await res.text(), isError: true });
    }
  };

  async function sendVerificationEmail() {
    await fetch("/api/user/email/verify", {
      method: "POST",
    });
  }

  return (
    <div className="lg:container lg:mx-auto px-3 py-10 flex justify-center">
      <div className="w-full max-w-4xl">
        <Head>
          <title>Settings</title>
        </Head>
        <section>
          {msg.message ? (
            <p
              style={{
                color: msg.isError ? "red" : "#0070f3",
                textAlign: "center",
              }}
            >
              {msg.message}
            </p>
          ) : null}
          <form
            className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
            onSubmit={handleSubmit}
          >
            {!user && !user.emailVerified ? (
              <p className="text-gray-500 text-center">
                Your email has not been verify. {/* eslint-disable-next-line */}
                <a
                  className="underline"
                  role="button"
                  onClick={sendVerificationEmail}
                >
                  Send verification email
                </a>
              </p>
            ) : null}

            <h2 className="mt-5 mb-5 font-bold">Edit Profile</h2>
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="name"
            >
              Name
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
              id="name"
              name="name"
              type="text"
              placeholder="Your name"
              ref={nameRef}
            />
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="bio"
            >
              Bio
            </label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="bio"
              name="bio"
              type="text"
              placeholder="Bio"
              ref={bioRef}
            />
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="avatar"
            >
              Profile picture
            </label>
            <div class="flex w-full h-screen items-center justify-left bg-grey-lighter mb-5">
              <label class="w-64 flex flex-col items-center px-4 py-6 bg-white text-blue rounded-lg shadow-lg tracking-wide uppercase border border-blue cursor-pointer hover:bg-blue hover:text-white">
                <svg
                  class="w-8 h-8"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
                </svg>
                <span class="mt-2 text-base leading-normal">Select a file</span>
                <input
                  id="avatar"
                  name="avatar"
                  accept="image/png, image/jpeg"
                  ref={profilePictureRef}
                  type="file"
                  class="hidden"
                />
              </label>
            </div>
            <button
              className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
              disabled={isUpdating}
              type="submit"
            >
              Save
            </button>
          </form>
          <form
            className="mt-5 bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
            onSubmit={handleSubmitPasswordChange}
          >
            <h2 className="mb-5 font-bold">Change password</h2>
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="oldpassword"
            >
              Old Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="password"
              name="oldPassword"
              id="oldpassword"
              required
            />
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="newpassword"
            >
              New Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="password"
              name="newPassword"
              id="newpassword"
              required
            />
            <button
              className="mt-5 bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
              type="submit"
            >
              Change Password
            </button>
          </form>
        </section>
      </div>
    </div>
  );
};

const SettingPage = () => {
  const [user] = useCurrentUser();

  if (!user) {
    return (
      <div className="lg:container lg:mx-auto px-3 py-10 flex justify-center">
        <div className="w-full max-w-xl">
          <h1 className="text-center font-bold text-red-500">Please sign in</h1>
        </div>
      </div>
    );
  }
  return (
    <>
      <h1 className="mt-10 text-xl text-center font-bold">Settings</h1>
      <ProfileSection />
    </>
  );
};

export default SettingPage;
