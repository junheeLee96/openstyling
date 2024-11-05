"use client";

import { radioEntities } from "@/app/lib/formEntities";
import { FormEvent, useState } from "react";
import { SubmitBtn } from "./button";
import { getCardData } from "@/app/lib/data";
import { useData } from "@/app/lib/store/store";
import { dataTypes } from "@/app/lib/definitions";
import Graph from "./Graph";

export default function Research() {
  const { setInfos, infos } = useData();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const sex = formData.get("sex") as string;
    const area = formData.get("area") as string;
    const purpose = formData.get("purpose") as string;
    const age = formData.get("age") as string;
    const data = await getCardData(sex, area, purpose, age);
    if (!data) return;
    setInfos(data, area);
  };

  return (
    <div>
      {infos ? (
        <Graph />
      ) : (
        <form onSubmit={handleSubmit}>
          <div className=" w-full flex flex-col items-center justify-center p-5">
            <div className="w-full lg:w-[800px]">
              {radioEntities.map((entity, key) => (
                <div className="w-full h-fit p-1 lg:p-4 rounded-lg" key={key}>
                  <fieldset className="h-auto">
                    <legend className="text-white text-lg font-medium w-full mb-4">
                      {entity.legend}
                    </legend>
                    <div className="flex items-center gap-4">
                      {entity.values.map((v, valueKey) => (
                        <div className="flex items-center" key={valueKey}>
                          <input
                            id={v.value}
                            type="radio"
                            name={v.name}
                            value={v.value}
                            className="hidden peer"
                          />
                          <label
                            htmlFor={v.value}
                            className="px-2 py-2 lg:px-4 lg:py-2 w-fit rounded-md text-sm font-medium transition-colors cursor-pointer bg-slate-100 hover:bg-slate-200 text-gray-800 peer-checked:bg-clickedbg peer-checked:text-white"
                          >
                            {v.kr}
                          </label>
                        </div>
                      ))}
                    </div>
                  </fieldset>
                </div>
              ))}
              <div className="p-4">
                <label
                  htmlFor="area"
                  className="text-white text-lg font-medium w-full mb-4"
                >
                  지역을 입력해주세요.
                </label>
                <div className="relative mt-2 rounded-md">
                  <div className="relative">
                    <input
                      id="area"
                      name="area"
                      type="text"
                      placeholder="서울시"
                      className="peer block w-full rounded-md border border-gray-200 py-2 pl-4 text-sm outline-2 placeholder:text-gray-500 focus:outline-none focus:ring-4 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <SubmitBtn />
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
