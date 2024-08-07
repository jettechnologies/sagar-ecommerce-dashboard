import { twMerge } from "tailwind-merge";
import React from "react"

interface Props{
    select: {
        key:string;
        value:string;
    }[]
    className?:string;
    defaultText:string;
    id:string;
    name: string;
    isMultiple?:boolean;
    handleInputChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
}

const Select:React.FC<Props> = ({select, className, isMultiple, id, name, defaultText, handleInputChange}) => {

  return (
    <select 
      name={name} 
      id={id} 
      multiple = {isMultiple}
      className={twMerge("py-2 px-4 rounded-md text-size-400 font-normal font-roboto text-text-black capitalize cursor-pointer", className)}
      onChange={handleInputChange}
    >
      <option defaultValue="">
        {defaultText}
      </option>
       {
            select.map(select => (
                <option key = {select.key} value={select.key}>
                    {select.value}
                </option>
            ))
       }
    </select>
  )
}

export default Select