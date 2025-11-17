import { MainEnum } from "../../configs/enums/main.enum";

export const checkOne = (permission: number) => {
  const accessArray = JSON.parse(
    localStorage.getItem(MainEnum.ACCESS_ARRAY) || "[]"
  );
  console.log(accessArray);
  console.log(permission);
};

export const checkMultiple = (permissions: number[]) => {
  const accessArray = JSON.parse(
    localStorage.getItem(MainEnum.ACCESS_ARRAY) || "[]"
  );
  console.log(permissions);
};
