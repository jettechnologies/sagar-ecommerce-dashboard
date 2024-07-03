import Button from "./Button";
import Modal from "./Modal";
import { useNavigate } from "react-router-dom";
import { CircleAlert } from "lucide-react";

interface Props{
    error: string | null;
    setError: () => void;
    redirect: string;
}

const ErrorModal = ({
    error, 
    setError,
    redirect,
}:Props) => {

    const navigate = useNavigate();

  return (
    <Modal title="Search Error" isOpen = {!!error} handleModalOpen = {setError}>
        <div className="flex flex-col w-full ">
        <div className="flex items-center gap-3">
            {/* <MessageSquareWarning size = {35} color = "rgb(239 68 68)"/> */}
            <CircleAlert size = {35} color = "rgb(239 68 68)" />
            <p className="first-letter:uppercase">
            {error}
            </p>
        </div>
        <div className="flex gap-5 mt-5 border-t border-[#f0f0f0] pt-3">
            <Button  
                size="medium"
                handleClick={() => {
                    navigate(redirect, {replace: true});
                    setError()
                }}
                className="text-sm uppercase flex-1"
            >
                Try again
            </Button>
        </div>
        </div>
    </Modal>
  )
}

export default ErrorModal