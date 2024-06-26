import axios from "axios";
import { CountryInfo } from "../types/types";

export const getCountryDatas = async (): Promise<CountryInfo[]> => {
  const { data } = await axios.get("https://restcountries.com/v3.1/all");
  //   console.log(data);
  return data;
};
