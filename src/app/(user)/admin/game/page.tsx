"use client";

import React from "react";

const SlitherGame = () => {
  return (
    <div className="flex justify-center items-center h-[600px] bg-black rounded-2xl">
      <iframe
        src="http://slither.io/"
        width="100%"
        height="100%"
        className="w-full h-full border-none rounded-2xl"
      />
    </div>
  );
};

export default SlitherGame;
