import React, { ChangeEvent, SetStateAction, useEffect, useState } from 'react';

type Props = {
  options: string[];
  selected: string;
  setSelected: React.Dispatch<SetStateAction<string>>;
}

const SelectWithAddOption = ({ options, selected, setSelected }: Props) => {
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
    setOptions(options)
  }, [ options ])

  return (
    <div className="w-full">
      <select
        className="w-full rounded-xl bg-gray-800 p-4 text-xl text-center"
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
            className="bg-gray-800 w-full p-2 border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500"
            placeholder="Enter a new option"
            value={newOption}
            onChange={(e) => setNewOption(e.target.value)}
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
