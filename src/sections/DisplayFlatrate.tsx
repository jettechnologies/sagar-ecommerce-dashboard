import { useMemo, useState, useEffect, useCallback } from "react";
import useGetRequest from "@/pages/hooks/useGetRequest";
import { useAuth } from "@/context/authContext";
import { Spinner } from "@radix-ui/themes";
import { Edit, Trash2, CircleAlert } from "lucide-react";
import { formatToHumanReadableDate } from "@/utils/dateFunctions";
import Modal from "@/components/Modal";
import Button from "@/components/Button";
import { EasyHTTP } from "@/utils/httpRequest";

interface FlatRateType {
    id: number;
    flateRate: string;
    currency: string;
    createdAt: string;
    updatedAt: string | null;
}

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

    // const [isEditing, setIsEditing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [currentId, setCurrentId] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);

    const handleDeleting = (id:number) =>{
        const currentFlatrate = flatrates.find(flatrate => flatrate.id === id);

        currentFlatrate && setCurrentId(currentFlatrate.id);
        setIsDeleting(prevState => !prevState);
    }

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
              flatrateLoading ? <div className="w-full h-full py-6 px-4">
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
                          <div className="p-2 cursor-pointer text-green-500">
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
                      <div className="flex w-full justify-between mt-2">
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
