import Image from "next/image";
import React from "react";

const Clothes = ({
  clothes,
  item,
}: {
  clothes: { [key: string]: string };
  item: {
    [key: string]: string;
  };
}) => {
  return (
    <div className="w-full min-h-[80px] mt-6 p-5 border-b border-customGray">
      <div className="font-extrabold">상의:{clothes.suggest}</div>
      <div className="text-sm mt-1">{clothes.reason}</div>
      <a
        href={item.link}
        target="_blank"
        rel="noopener noreferrer"
        className="flex mt-6 border border-gray-400 rounded-md"
      >
        <div
          className="w-[150px] h-[150px] rounded-md"
          style={{
            backgroundImage: `url(${item.image})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center center",
          }}
        ></div>
        <div
          className="ml-4 mt-1"
          dangerouslySetInnerHTML={{ __html: item.title }}
        />
      </a>
    </div>
  );
};

export default Clothes;
