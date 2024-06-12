import Image from "@/components/Image";

interface Props{
  src: string;
  alt: string;
  overlayColor?: string;
}

const Hero:React.FC<Props> = ({
    src,
    alt,
    overlayColor
}) =>{

  return(
    <div className="w-full h-full relative">
      <div className={`w-full h-full absolute ${overlayColor ? overlayColor : "bg-black"} opacity-70 top-0 left-0`}></div>
      <Image src={src} alt={alt} />
    </div>
  );  
}

export default Hero;