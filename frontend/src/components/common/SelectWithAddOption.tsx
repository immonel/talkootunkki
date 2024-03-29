import React, { ChangeEvent, SetStateAction, useEffect, useState } from 'react';

type Props = {
  options: string[];
  selected: string;
  setSelected: React.Dispatch<SetStateAction<string>>;
  maxLength: number;
}

const SelectWithAddOption = ({ options, selected, setSelected, maxLength }: Props) => {
  const [ _options, setOptions ] = useState<string[]>([]);
  const [ newOption, setNewOption ] = useState<string>('');
  const [ newOptionInputOpen, setNewOptionInputOpen ] = useState(false)

  const handleAddOption = () => {
    if (newOption.trim() && !options.includes(newOption)) {
      setOptions([...options, newOption.trim()]);
      setSelected(newOption.trim());
    }
    setNewOption('');
    setNewOptionInputOpen(false)
  };

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const selected = event.target.value

    if (selected === '__add__') {
      setNewOptionInputOpen(true)
    } else {
      setNewOptionInputOpen(false)
    }
    setSelected(selected)
  }

  useEffect(() => {
    if (options) {
      setOptions(options)
    }
  }, [ options ])

  const handleNewOptionChange = (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value
    if (!(input.length > maxLength)) {
      setNewOption(input)
    }
  }

  return (
    <div className="w-full">
      <select
        className="
          w-full rounded-xl p-4 text-xl text-center
          bg-gray-200 dark:bg-gray-800
        "
        value={selected}
        onChange={handleChange}
      >
        <option value="" disabled>
        </option>
        {_options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
        <option value="__add__">+ Add new</option>
      </select>
      {newOptionInputOpen && (
        <div className="mt-2">
          <input
            className="
              w-full p-2 rounded-md shadow-sm focus:outline-none
              bg-gray-200 dark:bg-gray-800 border-gray-300 focus:border-cs-orange
            "
            placeholder="Enter a new option"
            value={newOption}
            onChange={handleNewOptionChange}
          />
          <button
            className="bg-cs-orange hover:bg-amber-700 rounded-xl p-3 m-2 w-1/2"
            onClick={handleAddOption}
          >
            Add
          </button>
        </div>
      )}
    </div>
  );
};

export default SelectWithAddOption;
