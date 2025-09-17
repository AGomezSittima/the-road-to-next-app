type StrengthInfo = {
  labelText: string;
  strengthBarColor: string;
  strengthTextColor: string;
};

const STRENGHT_INFO_VALUES: ReadonlyArray<StrengthInfo> = [
  { labelText: "", strengthBarColor: "", strengthTextColor: "" },
  {
    labelText: "Very Weak",
    strengthBarColor: "bg-red-400",
    strengthTextColor: "text-red-400",
  },
  {
    labelText: "Weak",
    strengthBarColor: "bg-orange-500",
    strengthTextColor: "text-orange-500",
  },
  {
    labelText: "Fair",
    strengthBarColor: "bg-yellow-500",
    strengthTextColor: "text-yellow-500",
  },
  {
    labelText: "Good",
    strengthBarColor: "bg-lime-500",
    strengthTextColor: "text-lime-500",
  },
  {
    labelText: "Strong",
    strengthBarColor: "bg-green-500",
    strengthTextColor: "text-green-500",
  },
];

export const getPasswordStrengthInfo = (passwordScore: number) => {
  return {
    normalizedScore: passwordScore / (STRENGHT_INFO_VALUES.length - 1),
    ...STRENGHT_INFO_VALUES[passwordScore],
  };
};
