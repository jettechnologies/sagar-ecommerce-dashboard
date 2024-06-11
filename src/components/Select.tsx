import { twMerge } from "tailwind-merge";

interface Props{
    select: {
        key:string;
        value:string;
    }[]
    className?:string;
    id:string;
    name: string
}

const Select:React.FC<Props> = ({select, className, id, name}) => {
  return (
    <select name={name} id={id} className={twMerge("p-3 rounded-md text-size-500 font-medium font-roboto text-text-black capitalize cursor-pointer", className)}>
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