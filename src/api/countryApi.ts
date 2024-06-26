import axios from "axios";
import { CountryInfo } from "../types/country.type";

export const getCountryDatas = async (): Promise<CountryInfo[]> => {
  const { data } = await axios.get<CountryInfo[]>(
    "https://restcountries.com/v3.1/all"
  );
  //   console.log(data);
  return data;
};
