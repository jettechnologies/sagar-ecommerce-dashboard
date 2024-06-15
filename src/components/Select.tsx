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
    handleInputChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
}

const Select:React.FC<Props> = ({select, className, id, name, defaultText, handleInputChange}) => {
  
  return (
    <select 
      name={name} 
      id={id} 
      className={twMerge("p-3 rounded-md text-size-500 font-medium font-roboto text-text-black capitalize cursor-pointer", className)}
      onChange={handleInputChange}
    >
      <option disabled selected hidden value="">
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