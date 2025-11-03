import React from "react";
import { Footer, Header, HeroSection } from "../../components";

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <HeroSection />
      {/* <main className="flex-grow flex flex-col px-8">
        <div className="max-w-7xl">
          <div>
            <div
              id="welcome-section"
              className="flex mt-5 p-6 flex-col justify-center items-center min-h-screen"
            >
              <h1 className="text-4xl font-bold text-center py-5 w-fit">
                How it Works
              </h1>

              <StepsCard />
            </div>

            <DecisionCategories />

            <WhyUseDecidifi />

            <DecisionMakingTool />
          </div>
        </div>
      </main> */}
      <Footer />
    </div>
  );
};

export default Home;
