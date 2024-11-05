import Image from "next/image";
import React from "react";

const StyleImage = ({ img }: { img: string }) => {
  return (
    <div className="flex-1  min-h-full ">
      <div className="flex-1 p-1 rounded-lg bg-slate-500 sticky top-10">
        <Image
          alt="X"
          src={img}
          width={0}
          height={0}
          sizes="100%"
          style={{ width: "100%", height: "auto" }} // optional
        />
      </div>{" "}
    </div>
  );
};

export default StyleImage;
