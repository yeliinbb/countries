import axios from "axios";
import { CountryInfoAll, CountryWithIsSelected } from "../types/country.type";
import supabase from "../supabase/supabaseClient";
import { v4 as uuid4 } from "uuid";

const countryApi = axios.create({
  baseURL: "https://restcountries.com/v3.1",
});

// 데이터 변환 함수
const transformData = (data: CountryInfoAll[]): CountryWithIsSelected[] => {
  const newCountryInfos = data
    ?.filter((info) => {
      const {
        name: { common: countryName },
        capital,
        flags: { svg: flagImage },
      } = info;
      return countryName && capital && flagImage;
    })
    .map((info) => {
      const {
        name: { common: countryName },
        capital,
        flags: { svg: flagImage },
      } = info;

      const newCountry = {
        id: uuid4(),
        countryName: countryName,
        capitalCity: capital ? capital[0] : "Unknown",
        flagImage: flagImage,
        isSelected: false,
      };
      return newCountry;
    });
  return newCountryInfos;
};

// API에서 데이터 가져오기 및 삽입
export const fetchDataAndTransform = async () => {
  try {
    const { data } = await countryApi.get<CountryInfoAll[]>("/all");
    // console.log(data);
    const transformedData = transformData(data);
    return transformedData;
  } catch (error) {
    console.error("Error fetching data : ", error);
  }
};

// 데이터 삽입 함수
export const insertData = async (selectedCountry: CountryWithIsSelected) => {
  // console.log("insertDataFn", selectedCountry);
  try {
    const { data, error } = await supabase
      .from("country_infos")
      .insert(selectedCountry, { onConflict: "id" });

    if (error) {
      console.error(`Error inserting data : ${error.message}`);
      throw error;
    }
    console.log("Data inserted successfully:", data);
    // return data;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Failed to insert data :", error);
      throw new Error(`Failed to insert data : ${error.message}`);
    }
  }
};

// 데이터 삭제 함수
export const deleteData = async (selectedCountry: CountryWithIsSelected) => {
  // console.log("deleteDataFn", selectedCountry);
  try {
    const { data, error } = await supabase
      .from("country_infos")
      .delete()
      .eq("id", selectedCountry.id);

    if (error) {
      console.error(`Error deleting data : ${error}`);
      throw error;
    }
    console.log("Data deleted successfully:", data);
  } catch (error) {
    if (error instanceof Error) {
      console.error("Failed to delete data :", error);
      throw new Error(`Failed to delete data : ${error.message}`);
    }
  }
};
