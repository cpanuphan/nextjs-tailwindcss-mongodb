import React from "react";
import Head from "next/head";
import Link from "next/link";
import Error from "next/error";
import middleware from "../../../middlewares/middleware";
import { useCurrentUser } from "../../../lib/hooks";
import { getUser } from "../../../lib/db";
import { useRouter } from "next/router";
import Card from "../../../components/card";

const UserPage = ({ user }) => {
  const router = useRouter();
  if (!user) return <Error statusCode={404} />;
  const { name, email, bio, profilePicture } = user || {};
  const [currentUser] = useCurrentUser();
  if (!currentUser && typeof window !== "undefined") router.push("/");

  return (
    <div className="lg:container lg:mx-auto px-3 py-10 flex justify-center">
      <div className="w-full max-w-4xl">
        <Head>
          <title>{name}</title>
        </Head>
        <Card
          image={profilePicture}
          title={name}
          detail={bio}
          subDetail={email}
        />
        {String(currentUser?._id) === String(user._id) && (
          <Link href="/settings">
            <button
              className="mt-5 bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
              type="button"
            >
              Edit
            </button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default UserPage;

export async function getServerSideProps(context) {
  await middleware.apply(context.req, context.res);
  const user = await getUser(context.req, context.params.userId);
  if (!user) context.res.statusCode = 404;
  return {
    props: {
      user,
    }, // will be passed to the page component as props
  };
}
