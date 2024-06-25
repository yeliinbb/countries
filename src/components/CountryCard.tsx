import React from "react";
import styled from "styled-components";
import { Country } from "../types/typs";

const CountryCard = ({ country }: { country: Country }) => {
  const { countryName, capitalCity, flagImage } = country;
  return (
    <List>
      <img src={flagImage} alt="" />
      <div>
        <h4>{countryName}</h4>
        <h5>{capitalCity}</h5>
      </div>
    </List>
  );
};

export default CountryCard;

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
