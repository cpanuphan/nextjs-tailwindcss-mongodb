import React from "react";
import Link from "next/link";

const Card = ({ image, title, detail, subDetail }) => {
  return (
    <div className="max-w-sm w-full lg:max-w-full lg:flex mt-10 border-b border-l border-r border-gray-400 lg:border-t lg:border-gray-400 bg-white rounded-b rounded-t">
      <div
        className="lg:rounded-b-none lg:rounded-r h-48 lg:h-auto lg:w-48 flex-none bg-cover rounded-t lg:rounded-t-none lg:rounded-l text-center overflow-hidden"
        // style={{ backgroundImage: `url('${image}')` }}
      >
        <img src={image} width="100%" height="100%" alt={title} />
      </div>
      <div className="bg-white rounded-b lg:rounded-b-none lg:rounded-r p-4 flex flex-col justify-between leading-normal w-full">
        <div className="mb-8">
          <div className="text-gray-900 font-bold text-xl mb-2">{title}</div>
          <p className="text-gray-700 text-base">{detail}</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-sm">
            <p className="text-gray-900 leading-none">{subDetail}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
