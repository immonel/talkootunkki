import SelectWithAddOption from "@components/common/SelectWithAddOption";
import React, { SetStateAction, FormEvent } from "react"

const MAX_NAME_LENGTH = 32

type Props = {
  associations: string[];
  selected: string;
  setSelected: React.Dispatch<SetStateAction<string>>;
  proceed: () => void;
}

const SelectAssociation = ({ associations, selected, setSelected, proceed }: Props) => {

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (selected === '__add__') {
      setSelected('')
    }
    proceed()
  }

  const skip = (event: React.MouseEvent) => {
    event.preventDefault()
    setSelected('')
    proceed()
  }

  return (
    <div className="flex flex-col items-center">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col w-60 mt-5 gap-3 text-center"
      >
        Select association
        <small>You can help your association win the competition!</small>

        <SelectWithAddOption
          options={associations}
          selected={selected}
          setSelected={setSelected}
          maxLength={MAX_NAME_LENGTH}
        />
        <button disabled={selected === '__add__'} className="bg-cs-orange hover:bg-amber-700 rounded-xl p-4 w-full">
          Submit
        </button>
        <button onClick={skip} className="bg-slate-700 hover:bg-slate-800 rounded-xl p-4 w-full">
          Skip
        </button>
      </form>
    </div>
  )
}

export default SelectAssociation