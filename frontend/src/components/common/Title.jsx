import React from "react";

const Title = ({ text1, text2 }) => {
  return (
    <div className="flex items-center justify-center gap-3 mb-6">
      <p className="text-lg sm:text-xl text-gray-700 font-semibold tracking-wide">
        {text1}{" "}
        <span className="text-pink-600 font-bold">
          {text2}
        </span>
      </p>
      <div className="w-10 sm:w-14 h-[2px] bg-gray-700 rounded-full" />
    </div>
  );
};

export default Title;
