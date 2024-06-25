import React, { useState } from "react";
import styled from "styled-components";
import { Country } from "../types/typs";

const CountryCard: React.FC<{
  country: Country[];
  onToggleClick: (id: number) => void;
}> = ({ country, onToggleClick }) => {
  return (
    <Ul>
      {country &&
        country.map((list) => (
          <li
            key={list.id}
            onClick={() => onToggleClick(list.id)}
            // $isSelected={isSelected}
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
    /* border: ${(props) =>
      props.$isSelected ? "1px solid green" : "none"}; */
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

const List = styled.li`
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
  &:active {
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
`;
