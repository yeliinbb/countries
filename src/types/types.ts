export interface CountryInfo {
  name: {
    common: string;
  };
  capital: string[];
  flags: {
    svg: string;
  };
}

export type Country = {
  id: string;
  countryName: string;
  capitalCity: string;
  flagImage: string;
};
