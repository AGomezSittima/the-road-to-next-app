type StrengthInfo = {
  labelText: string;
  strengthBarColor: string;
};

const STRENGHT_INFO_VALUES: ReadonlyArray<StrengthInfo> = [
  { labelText: "", strengthBarColor: "" },
  {
    labelText: "Very Weak",
    strengthBarColor: "bg-[#4f5b7f]",
  },
  {
    labelText: "Weak",
    strengthBarColor: "bg-[#6b47b3]",
  },
  {
    labelText: "Fair",
    strengthBarColor: "bg-[#8440e0]",
  },
  {
    labelText: "Good",
    strengthBarColor: "bg-[#9a3bf0]",
  },
  {
    labelText: "Strong",
    strengthBarColor: "bg-[#6225c5]",
  },
];

export const getPasswordStrengthInfo = (passwordScore: number) => {
  return {
    normalizedScore: passwordScore / (STRENGHT_INFO_VALUES.length - 1),
    ...STRENGHT_INFO_VALUES[passwordScore],
  };
};
