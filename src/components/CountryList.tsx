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
  const [selectedCountries, setSelectedCountries] = useState<Country[]>([]);
  const [sortOption, setSortOption] = useState("default");

  const fetchData = async () => {
    try {
      const data: CountryInfo[] = await getCountryDatas();
      // console.log("data => ", data);
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
    const newArr = [...countryInfos];
    switch (sortOption) {
      case "A-Z":
        newArr.sort((a, b) => a.countryName.localeCompare(b.countryName));
        break;
      case "Z-A":
        newArr.sort((a, b) => b.countryName.localeCompare(a.countryName));
        break;
    }
    setCountryInfos(newArr);
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

  const onToggleClick = (id: string) => {
    // console.log(id);
    // 선택된 국가 찾기
    const selectedCountry = countryInfos.find((item) => item.id === id);
    // 선택된 국가가 있으면 해당 국가를 제외하고 상태 업데이트
    setSelectedCountries((prev) => {
      const isSelected = prev.find((item) => item.id === id);
      if (isSelected) {
        return prev.filter((item) => item.id !== id);
      }
      return [...prev, selectedCountry];
    });

    // console.log("selectedCountry => ", selectedCountry);
  };

  const sortAZ = () => {
    const newArr = [...countryInfos];
    const sortedArr = newArr.sort((a, b) =>
      a.countryName.localeCompare(b.countryName)
    );
    console.log("sortedArr => ", sortedArr);
    setCountryInfos(sortedArr);
  };

  const sortZA = () => {
    const newArr = [...countryInfos];
    const sortedArr = newArr.sort((a, b) =>
      b.countryName.localeCompare(a.countryName)
    );
    console.log("sortedArr => ", sortedArr);
    setCountryInfos(sortedArr);
  };

  return (
    <Main>
      <section>
        <h1>Favorite Countires</h1>
        {selectedCountries && (
          <CountryCard
            country={selectedCountries}
            onToggleClick={onToggleClick}
          />
        )}
      </section>
      <section>
        <h2>Countries</h2>
        <BtnBox>
          <span>[ Sorted By ]</span>
          <button onClick={sortAZ}>A-Z</button>
          <button onClick={sortZA}>Z-A</button>
        </BtnBox>
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
        >
          <option value="">Default</option>
          <option value="A-Z">A-Z</option>
          <option value="Z-A">Z-A</option>
        </select>
        <CountryCard country={countryInfos} onToggleClick={onToggleClick} />
      </section>
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

  section {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 30px;
  }
`;

const BtnBox = styled.div`
  /* height: 30px; */
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;

  span {
    height: 25px;
    font-size: 20px;
    font-weight: 400;
  }

  button {
    border: 1px solid black;
    border-radius: 50px;
    min-width: 80px;
    height: 35px;
    font-size: 17px;
    text-align: center;
    &:hover {
      background-color: black;
      color: white;
      cursor: pointer;
    }
  }
`;
