import styled from "styled-components";
import { CountryWithIsSelected } from "../types/country.type";
import { useState } from "react";

interface CountryCardProps {
  country: CountryWithIsSelected[];
  onToggleSelect: (id: string) => void;
}

const CountryCard = ({ country, onToggleSelect }: CountryCardProps) => {
  // const [isSelected, setSelected] = useState<boolean>(false);

  // const onClickHandler = (id: CountryWithIsSelected["id"]) => {
  //   onToggleSelect(id);
  //   if (onToggleSelect(id)) {
  //     setSelected(!isSelected);
  //   }
  // };
  //  const toggleIsSelected = () => {
  //   if()
  // };

  return (
    <Ul>
      {country &&
        country.map((list) => (
          <li
            key={list.id}
            onClick={() => onToggleSelect(list.id)}
            style={{ border: list.isSelected ? "1px solid green" : "none" }}
          >
            <img src={list.flagImage} alt="" />
            <div>
              <h4>{list.countryName}</h4>
              <h5>{list.capitalCity}</h5>
            </div>
          </li>
        ))}
    </Ul>
  );
};

export default CountryCard;

const Ul = styled.ul`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  grid-auto-rows: 160px;
  gap: 20px;
  padding: 0px 80px;
  li {
    max-width: 350px;
    min-width: 200px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    box-shadow: 0px 5px 10px 1px rgba(0, 0, 0, 0.1);
    padding: 20px;
    border-radius: 10px;
    gap: 20px;
    &:hover {
      box-shadow: 0px 10px 10px 1px rgba(0, 0, 0, 0.1);
      cursor: pointer;
    }
    &:transform {
      border: 1px solid green;
    }

    img {
      align-self: center;
      width: 80px;
      height: 50px;
      object-fit: cover;
    }

    div {
      display: flex;
      flex-direction: column;
      gap: 10px;
      h4 {
        font-size: 20px;
        font-weight: 600;
      }
      h5 {
        font-size: 18px;
        font-weight: 400;
      }
    }
  }
`;
