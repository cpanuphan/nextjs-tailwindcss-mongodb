import React from "react";
import { useCurrentUser } from "../lib/hooks";

const IndexPage = () => {
  const [user] = useCurrentUser();

  return (
    <>
      <div style={{ marginBottom: "2rem" }}>
        <h2>Hello, {user ? user.name : "stranger"}!</h2>
        <p>Have a wonderful day.</p>
      </div>
      <div>
        <h3>
          All posts from the Web{" "}
          <span role="img" aria-label="Earth">
            🌎
          </span>
        </h3>
      </div>
    </>
  );
};

export default IndexPage;
