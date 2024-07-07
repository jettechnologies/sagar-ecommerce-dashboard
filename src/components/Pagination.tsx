import Button from "./Button";
import { ArrowLeftIcon, ArrowRightIcon } from "@/icons/svg";
import { useRef, useEffect } from "react";
import { EasyHTTP } from "@/utils/httpRequest";
import { useAuth } from "@/context/authContext";

interface Props<T> {
    url: string;
    setData: (data: T) => void;
    dataLength: number;
}

const easyHttp = new EasyHTTP();

const Pagination = <T,>({ url, setData, dataLength }: Props<T>) => {

    const { token } = useAuth();
    const currentPage = useRef(1);

  // useEffect(() => {
  //   const fetchData = async () => {

  //     const headers:HeadersInit = {
  //       'Content-type': 'application/json',
  //       "Accept": "application/json",
  //        Authorization: `Bearer ${token}`,
  //     }

  //     try {
  //       const response = await easyHttp.get(`${url}?page=${currentPage.current}`, headers);
  //       console.log(response)
  //       // setData(result.data);
  //     } catch (error) {
  //       console.error('Error fetching data:', error);
  //     }
  //   };

  //   fetchData();
  // }, [url, setData, token]);

  const handlePrevious = () => {
    console.log("working")

    if (currentPage.current > 1) {
      currentPage.current -= 1;
      fetchData();
    }
  };

  const handleNext = () => {
    currentPage.current += 1;
    console.log("working", currentPage.current)

    fetchData();
  };

  const fetchData = async () => {

    const headers:HeadersInit = {
      'Content-type': 'application/json',
      "Accept": "application/json",
       Authorization: `Bearer ${token}`,
    }

    try {
      const response = await easyHttp.get(`${url}/?page=${currentPage.current}`, headers);
        console.log(response[0])
        setData(response[0])
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div className="mt-8 w-full flex justify-end">
        <div className="w-fit flex gap-x-5 h-10">
            {currentPage.current  === 1 || <Button size="small" handleClick={handlePrevious} className="text-white text-sm lg:text-base font-medium flex justify-center gap-2">
                <ArrowLeftIcon stroke="#fff" />
                Previous
            </Button>}
            {dataLength >= 30 && <Button size="small" handleClick={handleNext} className="text-white text-sm lg:text-base font-medium flex justify-center gap-2 px-6">
                Next
                <ArrowRightIcon stroke="#fff" />
            </Button>}
        </div>
    </div>
  )
}

export default Pagination