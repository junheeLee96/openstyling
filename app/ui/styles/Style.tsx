"use client";

import { useData } from "@/app/lib/store/store";
import React from "react";
import StyleImage from "./StyleImage";
import Container from "../Container";
import Clothes from "./Clothes";
import Image from "next/image";

const Style = () => {
  const { infos, area } = useData();
  console.log(infos);
  if (!infos) return null;
  console.log(Object.keys(infos.prompt).map((key) => key));
  return (
    <Container>
      <div className="flex min-h-[500px] flex-col gap-5 rounded-lg lg:flex-row ">
        <StyleImage img={infos.image} />
        <div className="flex-1 p-4 border border-customGray rounded-md">
          {Object.keys(infos.prompt).map(
            (clothes, key) =>
              clothes !== "tip" && (
                <Clothes
                  key={key}
                  clothes={infos.prompt[clothes]}
                  item={infos.productsURL[clothes].items[0]}
                />
              )
          )}
        </div>
      </div>
    </Container>
  );
};

export default Style;
