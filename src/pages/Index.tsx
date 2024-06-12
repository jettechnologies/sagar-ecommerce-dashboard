import Carousel from "@/components/Carousel";
import Hero from "@/components/Hero";
import headphoneImg from "@/assets/images/headphone.jpg";
import earpodsImg from "@/assets/images/earpods-black.jpg";
import phoneBlackImg from "@/assets/images/phone-earphone.jpg";
import { Link } from "react-router-dom";

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

const Index = () => {
  return (
    <div className="w-full h-[--hero-height]">
      <div className="w-full h-[--hero-height] absolute flex justify-center items-center border-2 border-greeen-500 z-[999]">
        <div className="w-[40%] flex flex-col items-center gap-y-4">
          <h2 className="text-size-700 text-white font-bold text-center">
            Welcome to 
            <br/>
              <span className = "text-blue uppercase text-size-[2.75rem]">sagar ecommerce</span>
            <br/>
            Admin panel
          </h2>
          <Link 
              to = "login" 
              className="mt-8 w-[75%] rounded-md py-5 text-center bg-blue text-black font-semibold hover:border-2 hover:border-blue hover:bg-white text-size-600"
            >
              Get started
            </Link>
        </div>
      </div>
      <div className="w-full h-full">
        <Carousel 
          content={imageArray.map(image => <Hero src={image.src} alt={image.alt} overlayColor={image.overlayColor} />)}
        />
      </div>
    </div>
  )
}

export default Index