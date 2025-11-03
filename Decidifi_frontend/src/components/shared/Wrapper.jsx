import React from "react";
import { Header, Footer } from "..";

const Wrapper = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header isLoggedIn={true} />
      <main className="flex-grow flex flex-col items-center px-8">
        <div className="max-w-7xl">{children}</div>
      </main>
      <Footer />
    </div>
  );
};

export default Wrapper;