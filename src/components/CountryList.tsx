import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { getCountryDatas } from "../api/countryApi";
import CountryCard from "./CountryCard";
import { Country, CountryInfo } from "../types/typs";

type CountryList = Country[];

const CountryList = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [countryInfos, setCountryInfos] = useState<Country[]>([]);

  const fetchData = async () => {
    try {
      const data: CountryInfo[] = await getCountryDatas();
      console.log("data => ", data);
      // data 배열을 돌면서 countryName과 capital 만 저장
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

          const newCountry: Country = {
            countryName: countryName,
            capitalCity: capital[0],
            flagImage: flagImage,
            id: crypto.randomUUID(),
          } as Country;
          return newCountry;
        });

      if (countryInfos.length === 0) {
        setCountryInfos(newCountryInfos || []);
      }
      console.log("countryInfos => ", countryInfos);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error as Error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [countryInfos]);

  if (isLoading) {
    return <div style={{ fontSize: 36 }}>로딩중...</div>;
  }

  if (error) {
    console.error(error);
    return (
      <div style={{ fontSize: 24 }}>에러가 발생했습니다: {error.message}</div>
    );
  }

  return (
    <Main>
      <h1>Favorite Countires</h1>
      <h2>Countries</h2>
      <ul>
        {countryInfos &&
          countryInfos.map((list) => (
            <CountryCard key={list.id} country={list} />
          ))}
      </ul>
    </Main>
  );
};

export default CountryList;

const Main = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  gap: 30px;

  h1 {
    font-size: 30px;
    font-weight: 600;
  }
  h2 {
    font-size: 40px;
    font-weight: 600;
  }
  ul {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    grid-auto-rows: 160px;
    gap: 20px;
    padding: 0px 80px;
  }
`;
