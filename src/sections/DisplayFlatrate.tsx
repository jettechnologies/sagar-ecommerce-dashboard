import { useMemo, useState, useEffect, useCallback } from "react";
import useGetRequest from "@/pages/hooks/useGetRequest";
import { useAuth } from "@/context/authContext";
import Spinner from "@/components/Spinner"
import { Edit, Trash2, CircleAlert } from "lucide-react";
import { formatToHumanReadableDate } from "@/utils/dateFunctions";
import Modal from "@/components/Modal";
import Button from "@/components/Button";
import { EasyHTTP } from "@/utils/httpRequest";
import Select from "@/components/Select";

interface FlatRateType {
    id: number;
    flateRate: string;
    currency: string;
    createdAt: string;
    updatedAt: string | null;
}

const currencies = [
  {key:"pound", value : "Pound"},
  {key: "dollar", value:"Dollar"},
  {key: "euro", value :"Euro"},
  {key: "rupee", value : "Rupee"},
  {key: "yuan", value :"Chinese yuan " }
]


const easyHttp = new EasyHTTP();

const DisplayFlatrate = () => {

    const { token, loading:authLoading } = useAuth();

    // getting the shipping rate
    const headers = useMemo(() => {
        if (token && !authLoading) {
            return {
                "Content-Type": 'application/json',
                "Accept": "application/json",
                Authorization: `Bearer ${token}`,
            };
        }
        return undefined;
    }, [token, authLoading]);

    const shouldFetch = useMemo(() => !!(token && !authLoading), [token, authLoading]);

    const { loading:flatrateLoading, data, error: fetchError } = useGetRequest<FlatRateType[]>(
        "order-mgt/get-flatrate", 
        { headers },
        shouldFetch
    );
    const [flatrates, setFlatrates] = useState<FlatRateType[] | []>([]);

    useEffect(() =>{
        if(data){
        setFlatrates(data);
    }
    }, [data]);

    const [isEditing, setIsEditing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [currentId, setCurrentId] = useState<number | null>(null);
    const [editFlatrate, setEditFlatrate] = useState<{rate:string, currency:string}>({
      rate: "",
      currency: "",
    });

    const [loading, setLoading] = useState(false);

    const handleShippingInput =  (
      e:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) =>{
      const target = e.target as HTMLInputElement | HTMLSelectElement;
      const { name, value } = target;
  
      setEditFlatrate({ ...editFlatrate, [name]: value.toLocaleLowerCase().trim()});
    }

    // functions for calling the modal
    // for the delete modal
    const handleDeleting = (id:number) =>{
        const currentFlatrate = flatrates.find(flatrate => flatrate.id === id);

        currentFlatrate && setCurrentId(currentFlatrate.id);
        setIsDeleting(prevState => !prevState);
    }
    // for the edit modal
    const handleEditing = (id:number) =>{
      const currentFlatrate = flatrates.find(flatrate => flatrate.id === id);

      currentFlatrate && setCurrentId(currentFlatrate.id);
      setIsEditing(prevState => !prevState);
  }

  // editing the flat rate from the server
  const editingFlatrate = useCallback(
    async(e: React.FormEvent<HTMLFormElement>) =>{

      e.preventDefault();

      if(editFlatrate.currency === "" || editFlatrate.rate === "") return;

        const url = `order-mgt/update-flatrate/${currentId}`;
        const headers: HeadersInit = {
            "Content-Type": 'application/json',
            "Accept": "application/json",
            Authorization: `Bearer ${token}`,
        };

        const data = {
          flatRate: parseInt(editFlatrate.rate),
          currency: editFlatrate.currency,
        }

        console.log(data);

        try {
          setLoading(true);
          const response = await easyHttp.patch(url, headers, data);
          console.log(response);

          setFlatrates(prevState =>{
            return prevState.map(flatrate => ({
              ...flatrate,
              flateRate: editFlatrate.rate,
              currency: editFlatrate.currency
            }))
          });
          setIsEditing(false);
      } catch (err) {
          console.log((err as Error).message);
          // setError((err as Error).message); // Uncomment and handle the error state if needed
      } finally {
          setLoading(false);
      }


    }, [currentId, editFlatrate, token]
  );

  // deleting the rate from the server
    const deletingFlatrate = useCallback(async () =>{
        if(flatrates.length === 0) return;

        const url = `order-mgt/delete-flatrate/${currentId}`;
        const headers: HeadersInit = {
            "Content-Type": 'application/json',
            "Accept": "application/json",
            Authorization: `Bearer ${token}`,
        };

        // Filter out the notification to be deleted
        const remainingFlatrates = flatrates?.filter(flatrate => flatrate.id !== currentId);

        try {
            setLoading(true);
            const response = await easyHttp.delete(url, headers);
            console.log(response);

            setFlatrates(remainingFlatrates);
            setIsDeleting(false);
        } catch (err) {
            console.log((err as Error).message);
            // setError((err as Error).message); // Uncomment and handle the error state if needed
        } finally {
            setLoading(false);
        }



    }, [currentId, flatrates, token]); 


  return (
    <>
          <div className="w-full flex gap-x-12 shadow-md pt-6 border-t border-[#c0c0c0]">
            {
              flatrateLoading ? <div className="w-full h-[15rem] py-6 px-4">
                <Spinner />
              </div>
              :
              fetchError ? <div className="w-full h-full">
                <p>{fetchError}</p>
              </div>
              : <div className="w-full my-10 flex flex-wrap">
                  {flatrates && flatrates.length > 0 && flatrates.map(flatrate => (
                    <div key = {flatrate.id} className="w-fit p-4 rounded-md border border-[#c0c0c0]">
                      <div className="w-full flex items-center gap-x-8">
                        <p className="text-text-black text-size-500 font-normal">
                          Shipping fee set at: {`${flatrate.flateRate} ${flatrate.currency}`}
                        </p>
                        <div className="flex gap-4">
                          <div 
                            className="p-2 cursor-pointer text-green-500"
                            onClick={() => handleEditing(flatrate.id)}
                          >
                            <Edit size = {20}/>
                          </div>
                          <div 
                            className="p-2 cursor-pointer text-red-500"
                            onClick={() => handleDeleting(flatrate.id)}
                            >
                            <Trash2 size = {20}/>
                          </div>
                        </div>
                      </div>
                      <div className="w-full mt-2">
                        <p className="text-[#c0c0c0] text-size-500 font-normal">
                          Created at: {formatToHumanReadableDate(flatrate.createdAt.split("T")[0])}
                        </p>
                        {flatrate.updatedAt && <p className="text-[#c0c0c0] text-size-500 font-normal">
                          Updated at: {formatToHumanReadableDate(flatrate.updatedAt.split("T")[0])}
                        </p>}
                      </div>
                    </div>
                ))}
              </div>
            }
          </div>

          {/* for editing the flatrate */}

          <Modal title = "Edit flatrate" isOpen={isEditing} handleModalOpen={() => setIsEditing(prevState => !prevState)}>
            <div className="flex flex-col w-full">
              <p className="text-text-black font-medium text-size-500">Edit flatrate</p>
              <form 
                id = "coupon-form" 
                className="w-full flex flex-col gap-5 border border-gray mt-5"
                onSubmit={editingFlatrate}
              >
                      <div className="w-full">
                        <label htmlFor="shipping-fee" className="text-size-400 text-text-black font-medium mb-3">
                          Flat rate
                        </label>
                        <input 
                          type="text" 
                          placeholder="Shipping fee" 
                          id = "shipping-fee"
                          value = {editFlatrate.rate}
                          name="rate"
                          onChange={handleShippingInput}
                          className="mt-3 rounded-md border border-[#c0c0c0] w-full p-3 font-roboto text-size-400 font-normal first-letter:uppercase"
                        />
                      </div>
                    <div className="w-full">
                    <label htmlFor="currency" className="text-size-400 text-text-black font-medium mb-3">
                      Currency
                    </label>
                    <div className="mt-3">
                    <Select
                      id="currncy"
                      name="currency"
                      className="border border-[#c0c0c0] text-medium text-sm w-full"
                      select={currencies}
                      defaultText="Shipping Currency"
                      handleInputChange={handleShippingInput}
                    />
                  </div>
                  </div>
                  <Button size = "medium" className = "">
                    {loading ? "Loading..." : "Edit flatrate"}
                  </Button>
                </form>
            </div>
          </Modal>

          {/* 
            {/* Deleting existing product category */}
            <Modal title = "Delete flatrates" isOpen={isDeleting} handleModalOpen={() => setIsDeleting(prevState => !prevState)}>
            <div className="flex flex-col w-full">
                <div className="flex items-center gap-3">
                    {/* <MessageSquareWarning size = {35} color = "rgb(239 68 68)"/> */}
                    <CircleAlert size = {35} color = "rgb(239 68 68)" />
                    <p className="text-text-black font-medium text-size-400">
                        Are you sure u want to delete this shipping fee rate ?
                    </p>
                </div>
                <div className="flex gap-5 mt-5 border-t border-[#f0f0f0] pt-3">
                    <Button 
                        type="white" 
                        size="medium" 
                        className="text-sm uppercase flex-1"
                        handleClick = {() => setIsDeleting(prevState => !prevState)}
                    >
                        no, cancel
                    </Button>
                    <Button 
                        type="danger" 
                        size="medium"
                        handleClick={() => deletingFlatrate()}
                        className="text-sm uppercase flex-1"
                    >
                        {loading ? "loading" : "yes, delete"}
                    </Button>
                </div>
            </div>
            </Modal>
    </>
  )
}

export default DisplayFlatrate
