import { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import {
  deleteData,
  fetchDataAndTransform,
  insertData,
} from "../api/countryApi";
import CountryCard from "./CountryCard";
import { CountryWithIsSelected } from "../types/country.type";
import { AxiosError } from "axios";

const CountryList = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<AxiosError | null>(null);
  const [countryInfos, setCountryInfos] = useState<CountryWithIsSelected[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<
    CountryWithIsSelected[]
  >([]);
  const [filteredCountries, setFilteredCountries] = useState<
    CountryWithIsSelected[]
  >([]);
  let initialCountryInfos: CountryWithIsSelected[] = [];

  useEffect(() => {
    const fetchCountryData = async () => {
      try {
        const data = await fetchDataAndTransform();
        console.log("data => ", data);
        if (countryInfos.length === 0) {
          setCountryInfos(data || []);
        }
      } catch (error) {
        // AxiosError의 에러인지 확인 필요
        if (error instanceof AxiosError) {
          setError(error);
        } else {
          console.error("Error fetching data:", error);
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchCountryData();
  }, [countryInfos]);

  useEffect(() => {
    initialCountryInfos = [...countryInfos];
  }, [countryInfos]);

  useEffect(() => {
    // 배열의 각 요소에서 id를 추출하여 집합(Set)에 저장
    const selectedCountryIds = new Set(
      selectedCountries.map((country) => country.id)
    );

    // countryInfos의 상태를 변화하는 로직 수정 -> filteredCountries에 담아서 ui 그려주기
    // id가 포함되지 않은 경우 즉, 선택되지 않은 국가들만 필터링해줌.
    const filtered = countryInfos.filter(
      (country) => !selectedCountryIds.has(country.id)
    );

    setFilteredCountries(filtered);
  }, [countryInfos, selectedCountries]);

  const onToggleSelect = useCallback(
    (id: CountryWithIsSelected["id"]): void => {
      const updatedCountryList = countryInfos.map((country) =>
        country.id === id
          ? { ...country, isSelected: !country.isSelected }
          : country
      );

      const isSelectedCountry = selectedCountries.find(
        (country) => country.id === id
      );

      if (!isSelectedCountry) {
        setSelectedCountries((prev) => {
          const selectedCountry = updatedCountryList.find(
            (country) => country.id === id
          );

          // supabase에 저장하는 로직 추가
          if (selectedCountry) {
            insertData(selectedCountry);
          }

          return selectedCountry ? [...prev, selectedCountry] : prev;
        });
      } else {
        setSelectedCountries((prev) => {
          // supabase에 저장한 나라 제거
          // 동일한 id의 나라가 있다면 수파베이스애서 제거하기
          const selectedCountry = selectedCountries.find(
            (country) => country.id === id
          );
          if (selectedCountry) {
            deleteData(selectedCountry);
          }

          return prev.filter((country) => country.id !== id);
        });
      }
    },
    [countryInfos, selectedCountries]
  );

  const sortingCountries = useCallback(
    (sortOption: string) => {
      setCountryInfos((prev) => {
        const newArr = [...prev];
        switch (sortOption) {
          case "A-Z":
            newArr.sort((a, b) => a.countryName.localeCompare(b.countryName));
            break;
          case "Z-A":
            newArr.sort((a, b) => b.countryName.localeCompare(a.countryName));
            break;
          case "Default":
            console.log("initialCountryInfos", initialCountryInfos);
            return [...initialCountryInfos];
          default:
            return prev;
        }
        return newArr;
      });
    },
    [setCountryInfos, initialCountryInfos]
  );

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
      <section>
        <h1>Favorite Countries</h1>
        {selectedCountries && (
          <CountryCard
            country={selectedCountries}
            onToggleSelect={onToggleSelect}
          />
        )}
      </section>
      <section>
        <h2>Countries</h2>
        <BtnBox>
          <span>[ Sorted By ]</span>
          <button onClick={() => sortingCountries("Default")}>Default</button>
          <button onClick={() => sortingCountries("A-Z")}>A-Z</button>
          <button onClick={() => sortingCountries("Z-A")}>Z-A</button>
        </BtnBox>
        {/* countryInfos 자체를 넘겨주는게 아니라 filteredCountries를 넘겨줘서
        기존의 countryInfos는 초기값을 유지할 수 있도록 */}
        <CountryCard
          country={filteredCountries}
          onToggleSelect={onToggleSelect}
        />
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
  height: fit-content;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;

  span {
    height: fit-content;
    /* line-height: normal; */
    font-size: 17px;
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
