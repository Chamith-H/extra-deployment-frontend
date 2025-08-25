import Select from "react-select";

type Option = {
  value: any;
  label: string;
};

type Props = {
  options: Option[];
  value: any;
  loading: boolean;
  disabled?: boolean;
  onChange: (selected: Option | null) => void;
};

export default function TableDropdown({
  value,
  options,
  onChange,
  loading,
  disabled,
}: Props) {
  const customStyles = {
    control: (base: any) => ({
      ...base,
      fontSize: "13px",
      fontFamily: "R3",
      fontWeight: "400",
      textShadow: "none",
      borderColor: "#e9e9e9",
      borderRadius: "3px",
      boxShadow: "none",
      height: "38px",
      minHeight: "38px",
      "&:hover": {
        borderColor: "#e9e9e9",
      },
    }),
    valueContainer: (base: any) => ({
      ...base,
      height: "38px",
      padding: "0 8px",
    }),
    indicatorsContainer: (base: any) => ({
      ...base,
      height: "38px",
    }),
    menu: (base: any) => ({
      ...base,
      fontSize: "13px",
    }),
    option: (base: any, state: any) => ({
      ...base,
      fontSize: "13px",
      fontFamily: "R3",
      fontWeight: "400",
      color: state.isSelected ? "#FFFFFF" : "#777777",
      backgroundColor: state.isSelected
        ? "#0C7184"
        : state.isFocused
        ? "#72def348"
        : "transparent",
      cursor: "pointer",
    }),
  };

  const valueFetcher = () => {
    const option = options.find((opt: any) => opt.value === value);
    return option;
  };

  return (
    <Select
      value={valueFetcher()}
      options={options}
      onChange={onChange}
      isSearchable
      placeholder="Select option"
      styles={customStyles}
      isLoading={loading}
      isDisabled={loading || disabled}
    />
  );
}
