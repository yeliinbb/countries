type FlagsPropertyType = {
  // index signature
  [key: string]: string;
  // png: string;
  // svg: string;
};

export type CountryInfo = {
  name: {
    common: string;
  };
  capital?: string[];
  flags: {
    svg: string;
  };
};

type Country = {
  id: string;
  countryName: string;
  capitalCity: string;
  flagImage: string;
};

// isSelected 데이터 타입 추가
export type CountryWithIsSelected = Country & {
  isSelected: boolean;
};
