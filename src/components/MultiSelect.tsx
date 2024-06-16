import Select, { OptionsOrGroups, GroupBase, ActionMeta, SingleValue, MultiValue } from 'react-select';
import { twMerge } from 'tailwind-merge';

interface Props {
  setSelectedOption: (option: SingleValue<string> | MultiValue<string> | null, actionMeta: ActionMeta<string>) => void;
  selectedOption?: SingleValue<string> | MultiValue<string>;
  options?: OptionsOrGroups<string, GroupBase<string>> | undefined;
  isMulti?: boolean;
  isSearchable?: boolean;
  className?: string;
  selectClassName?: string;
  value: SingleValue<string> | MultiValue<string>;
}

const MultiSelect: React.FC<Props> = ({
  selectedOption,
  setSelectedOption,
  options,
  isMulti,
  isSearchable,
  className,
  selectClassName,
  value
}) => {
  return (
    <div className={twMerge("w-full h-full", className)}>
      <Select
        defaultValue={selectedOption}
        onChange={setSelectedOption}
        options={options}
        isMulti={isMulti}
        isSearchable={isSearchable}
        value={value}
        className={selectClassName}
      />
    </div>
  );
};

export default MultiSelect;
