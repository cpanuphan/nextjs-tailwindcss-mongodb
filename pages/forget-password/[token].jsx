import React from "react";
import Head from "next/head";
import nextConnect from "next-connect";
import Router from "next/router";
import database from "../../middlewares/database";

const ResetPasswordTokenPage = ({ valid, token }) => {
  async function handleSubmit(event) {
    event.preventDefault();
    const body = {
      password: event.currentTarget.password.value,
      token,
    };

    const res = await fetch("/api/user/password/reset", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.status === 200) Router.replace("/");
  }

  return (
    <div className="lg:container lg:mx-auto px-3 py-10 flex justify-center">
      <div className="w-full max-w-md">
        <Head>
          <title>Forget password</title>
        </Head>
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <h2 className="text-center font-bold mb-5">Forget password</h2>
          {valid ? (
            <>
              <p className="text-center mb-5">Enter your new password.</p>
              <form onSubmit={handleSubmit}>
                <div>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-5"
                    name="password"
                    type="password"
                    placeholder="New password"
                  />
                </div>
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="submit"
                >
                  Set new password
                </button>
              </form>
            </>
          ) : (
            <p className="text-center text-red-600 font-bold mb-5">
              This link may have been expired
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export async function getServerSideProps(ctx) {
  const handler = nextConnect();
  handler.use(database);
  await handler.apply(ctx.req, ctx.res);
  const { token } = ctx.query;

  const tokenDoc = await ctx.req.db.collection("tokens").findOne({
    token: ctx.query.token,
    type: "passwordReset",
  });

  return { props: { token, valid: !!tokenDoc } };
}

export default ResetPasswordTokenPage;
