import ComponentLayout from "@/pages/layout/ComponentLayout";
import React from "react";

const Hero = () => {
  return (
    <ComponentLayout>
      <div
        className="w-screen md:h-[550px] bg-cover bg-center"
        style={{
          backgroundImage: "url('/landscape.webp')",
        }}
      >
        <div className="mx-auto text-center px-8 md:pt-32 md:pb-12 pt-20 pb-8">
          <span className="text-orange-500 font-semibold text-base md:text-2xl">
            🏆 Rewards for Everything 🚀
          </span>
          <h1 className="font-extrabold text-white mb-6 text-7xl md:text-9xl">
            GATEWAY
            <p className="font-semibold text-3xl md:text-5xl text-white">
              on Archway
            </p>
          </h1>
          <div className="md:text-lg mb-10 text-gray-100 mx-4 md:mx-32">
            <p>Bridging Web2 and Web3 to empower developers and</p>
            <p>accelerate the growth of the decentralized applications.</p>
          </div>
        </div>
      </div>
    </ComponentLayout>
  );
};

export default Hero;
