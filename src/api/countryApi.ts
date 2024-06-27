import axios from "axios";
import { CountryInfoAll } from "../types/country.type";

export const getCountryDatas = async (): Promise<CountryInfoAll[]> => {
  const { data } = await axios.get<CountryInfoAll[]>(
    "https://restcountries.com/v3.1/all"
  );
  console.log(data);
  return data;
};

// 데이터 변환 함수
// const transformData = () => {};

// 데이터 삽입 함수
// const insertData = () => {};

// API에서 데이터 가져오기 및 삽입
// const fetchDataAndInsert = () => {};
