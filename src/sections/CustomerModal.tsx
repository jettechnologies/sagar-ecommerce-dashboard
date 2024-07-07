import React from 'react'
import Modal from '@/components/Modal';
import { CustomerData } from '@/pages/dashboard/Customers';


interface Props{
    isOpen: boolean;
    handleModalOpen: () => void;
    customer: CustomerData | null;
}

const CustomerModal:React.FC<Props> = ({
    isOpen,
    handleModalOpen,
    customer,
}) => {

    console.log(isOpen, customer)

  return (
    <Modal title = "Customer details" isOpen={isOpen} handleModalOpen={handleModalOpen}>
        <div className='w-full border-2 flex justify-between'>
            <div className="w-full flex">
                <h5 className="text-text-black font-semibold text-size-50-">
                    C
                </h5>
            </div>
        </div>
    </Modal>
  )
}

export default CustomerModal