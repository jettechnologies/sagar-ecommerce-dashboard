import Carousel from "./Carousel";
import Hero from "@/components/Hero";
import headphoneImg from "@/assets/images/headphone.jpg";
import earpodsImg from "@/assets/images/earpods-black.jpg";
import phoneBlackImg from "@/assets/images/phone-earphone.jpg";

interface Props{
    children:React.ReactNode;
    position?: "right";
}

const imageArray: { src: string, alt: string, overlayColor: string }[] = [
    {
      src: headphoneImg,
      alt: "headphone image",
      overlayColor: "bg-black",
    },
    {
      src: earpodsImg,
      alt: "earpods image",
      overlayColor: "bg-black",
    },
    {
      src: phoneBlackImg,
      alt: "phone black image",
      overlayColor: "bg-black",
    },
  ];

const FormContainer:React.FC<Props> = ({children, position}) => {

    const containerPosition = position && position;

  return (
    <div className="flex">
        <div className={`hidden lg:block w-full lg:w-1/2 h-screen ${containerPosition === "right" && "order-2"}`}>
            <Carousel
                content={imageArray.map(image => <Hero src={image.src} alt={image.alt} overlayColor={image.overlayColor} />)}
            />
          </div>
          <div className={`flex w-full lg:w-1/2 justify-center items-center bg-white space-y-8 ${containerPosition === "right" && "order-1"}`}>
            <div className="w-full px-8 md:px-16">
                {children}
            </div>
            
          </div>
        </div>
  )
}

export default FormContainer;