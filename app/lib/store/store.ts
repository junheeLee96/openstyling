import { create } from "zustand";
import { dataTypes } from "../definitions";

interface storeType {
  infos: null | dataTypes;
  setInfos: (newInfo: dataTypes, area: string) => void;
  area: string | null;
}

const useData = create<storeType>((set) => ({
  infos: null,
  area: null,
  setInfos: (newInfo, area) => {
    set(() => ({ infos: newInfo, area }));
  },
}));

export { useData };
