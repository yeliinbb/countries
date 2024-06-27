import { useEffect, useState } from "react";
import styled from "styled-components";
import { getCountryDatas } from "../api/countryApi";
import CountryCard from "./CountryCard";
import { CountryInfo, CountryWithIsSelected } from "../types/country.type";
import { AxiosError } from "axios";

const CountryList = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<AxiosError | null>(null);
  const [countryInfos, setCountryInfos] = useState<CountryWithIsSelected[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<
    CountryWithIsSelected[]
  >([]);
  const [sortOption, setSortOption] = useState("Default");
  let initialCountryInfos: CountryWithIsSelected[] = [];

  const fetchData = async (): Promise<void> => {
    try {
      const data: CountryInfo[] = await getCountryDatas();
      // console.log("data => ", data);
      // data 배열을 돌면서 countryName과 capital, flagImage 만 저장
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
            countryName: countryName,
            capitalCity: capital ? capital[0] : "Unknown",
            flagImage: flagImage,
            id: crypto.randomUUID(),
            isSelected: false,
          };
          return newCountry;
        });

      if (countryInfos.length === 0) {
        for (const country of countryInfos) {
          initialCountryInfos.push(country);
        }
        setCountryInfos(newCountryInfos || []);
      }
      // console.log("countryInfos => ", countryInfos);
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

  // countryInfos의 상태를 변화하는 로직 수정 -> filteredCountries에 담아서 ui 그려주기
  const onToggleSelect = (id: CountryWithIsSelected["id"]): void => {
    const selectedCountryList = countryInfos.map((country) =>
      country.id === id
        ? { ...country, isSelected: !country.isSelected }
        : country
    );

    const unselectedCountryList = countryInfos.map((country) =>
      country.id !== id
        ? { ...country, isSelected: country.isSelected }
        : country
    );

    const isSelectedCountry = selectedCountries.find(
      (country) => country.id === id
    );
    // console.log("isSelectedCountry => ", isSelectedCountry);

    if (!isSelectedCountry) {
      setSelectedCountries((prev) => {
        // console.log("selected1");
        const selectedCountry = selectedCountryList.find(
          (country) => country.id === id
        );
        // console.log(selectedCountry);
        return selectedCountry ? [...prev, selectedCountry] : prev;
      });
      setCountryInfos(() => {
        // console.log("selected2");
        return unselectedCountryList.filter((country) => country.id !== id);
      });
    } else {
      setSelectedCountries((prev) => {
        console.log("unselected1");
        return prev.filter((country) => country.id !== id);
      });
      setCountryInfos((prev) => {
        const selected = selectedCountries.find((country) => country.id === id);
        console.log("selected => ", selected);
        console.log("unselected2");
        return selected ? [{ ...selected, isSelected: false }, ...prev] : prev;
      });
    }
  };

  const sortCountries = (
    sortOption: string,
    countryInfos: CountryWithIsSelected[]
  ): CountryWithIsSelected[] => {
    const newArr = [...countryInfos];
    switch (sortOption) {
      case "A-Z":
        newArr.sort((a, b) => a.countryName.localeCompare(b.countryName));
        break;
      case "Z-A":
        newArr.sort((a, b) => b.countryName.localeCompare(a.countryName));
        break;
      case "Default":
        return [...initialCountryInfos];
      default:
        return countryInfos;
    }
    return newArr;
  };

  const handleSortChange = (sortOption: string) => {
    setSortOption(sortOption);
    const sortedCountries = sortCountries(sortOption, countryInfos);
    setCountryInfos(sortedCountries);
  };

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
          <button onClick={() => handleSortChange("Default")}>Default</button>
          <button onClick={() => handleSortChange("A-Z")}>A-Z</button>
          <button onClick={() => handleSortChange("Z-A")}>Z-A</button>
        </BtnBox>
        {/* countryInfos 자체를 넘겨주는게 아니라 filteredCountries를 넘겨줘서
        기존의 countryInfos는 초기값을 유지할 수 있도록 */}
        <CountryCard country={countryInfos} onToggleSelect={onToggleSelect} />
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
