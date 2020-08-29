import React from "react";
import Head from "next/head";
import nextConnect from "next-connect";
import database from "../../middlewares/database";

export default function EmailVerifyPage({ success }) {
  return (
    <div className="lg:container lg:mx-auto px-3 py-10 flex justify-center">
      <div className="w-full max-w-md">
        <Head>
          <title>Sign up</title>
        </Head>
        {success ? (
          <p className="text-center text-indigo-300 font-bold mb-5">
            Thank you for verifying your email address. You may close this page.
          </p>
        ) : (
          <p className="text-center text-red-600 font-bold mb-5">
            This link may have been expired.
          </p>
        )}
      </div>
    </div>
  );
}

export async function getServerSideProps(ctx) {
  const handler = nextConnect();
  handler.use(database);
  await handler.apply(ctx.req, ctx.res);

  const { token } = ctx.query;
  const { value: tokenDoc } = await ctx.req.db
    .collection("tokens")
    .findOneAndDelete({ token, type: "emailVerify" });

  if (!tokenDoc) {
    return { props: { success: false } };
  }

  await ctx.req.db
    .collection("users")
    .updateOne({ _id: tokenDoc.userId }, { $set: { emailVerified: true } });

  return { props: { success: true } };
}
