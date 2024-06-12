import { twMerge } from "tailwind-merge";

interface Props{
    src: string;
    alt?: string;
    className?: string;
}

const Image:React.FC<Props> = ({
    src,
    alt,
    className
}) => {
  return (
    <img
      loading = "lazy"
      src={src}
      alt={alt}
      className={twMerge("w-full h-full object-cover", className)}
    />
  );
};

export default Image;