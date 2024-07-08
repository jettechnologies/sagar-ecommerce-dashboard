import Notification from "@/components/Notification";
import Container from "@/components/Container";
import Select from "@/components/Select";
import { useCallback, useEffect, useState, useMemo } from "react";
import { Order } from "@/types";
import { useAuth } from "@/context/authContext";
import Button from "@/components/Button";
import { GripHorizontal, IndianRupee, BadgeCheck } from "lucide-react";
import Popup from "@/components/Popup";
import Spinner from "@/components/Spinner";
import { Link } from "react-router-dom";
import Modal from "@/components/Modal";
import { formatToHumanReadableDate } from "@/utils/dateFunctions";
import Pagination from "@/components/Pagination";
// import { EasyHTTP } from "@/utils/httpRequest";

type FilterType = "all_orders" | "delivered_orders" | "processed_orders" | "shipped_orders";

const ViewOrders = () => {
    const { token, loading:authLoading } = useAuth();
    const [filter, setFilter] = useState<string>("all_orders");
    const [orders, setOrders] = useState<Order[]>([]);
    const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [activePopupId, setActivePopupId] = useState<number | null>(null);

    const url = useMemo(() =>{
        const urls: Record<FilterType, string> = {
            all_orders: "order-mgt/get-all-orders",
            delivered_orders: "order-mgt/get-all-delivered-orders",
            processed_orders: "order-mgt/get-all-processing-orders",
            shipped_orders: "order-mgt/get-all-shipped-orders",
        };

        const url = urls[filter as FilterType];
        return url;
    }, [filter]);

    console.log(orders);

    const fetchOrders = useCallback(async () => {
        if (token === "" || authLoading) return;

        
        const headers: HeadersInit = { Authorization: `Bearer ${token}` };

        try {
            setLoading(true);
            const res = await fetch(`${import.meta.env.VITE_PRODUCT_LIST_API}${url}`, { headers });
            const response = await res.json();

            if (!res.ok) {
                throw new Error(response.message);
            }

            setOrders(response[0]);
            setError("");
        } catch (err) {
            setError((err as Error).message);
            setOrders([]);
        } finally {
            setLoading(false);
        }
    }, [authLoading, token, url]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const handlePopupToggle = (id: number) => {
        setActivePopupId((prevId) => (prevId === id ? null : id));
    };

    type NotificationType = "processing" | "delivered" | "shipped";

    const notificationStatus = [
        { key: "processing", value: "Processing" },
        { key: "delivered", value: "Delivered" },
        { key: "shipped", value: "Shipped" },
    ];

    const notificationType: Record<NotificationType, { type: "success" | "warning"; message: string }> = {
        processing: {
            type: "warning",
            message: "Processing",
        },
        delivered: {
            type: "success",
            message: "Delivered",
        },
        shipped: {
            type: "success",
            message: "Shipped",
        },
    };

    const handleUpdateOrder = useCallback(
        (id: number) => {
            const activeOrder = orders.find((order) => order.id === id);
            if (activeOrder) {
                setCurrentOrder(activeOrder);
                setIsUpdating(true);
            }
        },
        [orders]
    );

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement | HTMLInputElement>) => {
        setCurrentOrder((prevState) => {
            if (prevState) {
                return {
                    ...prevState,
                    status: e.target.value,
                };
            }
            return prevState;
        });
    };

    const updateOrderStatus = useCallback(
        async (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
    
            if (currentOrder) {
                const url = `${import.meta.env.VITE_PRODUCT_LIST_API}order-mgt/update-order-status/${currentOrder.id}`;
                const headers: HeadersInit = {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                };
                const data = {
                    status: currentOrder.status,
                };
    
                try {
                    setUpdating(true);
    
                    const response = await fetch(url, {
                        method: 'PATCH',
                        headers: headers,
                        body: JSON.stringify(data)
                    });
    
                    // Handle different response statuses
                    if (!response.ok) {
                        const resData = await response.json();
                        throw new Error(resData.message || 'An error occurred while updating the order status');
                    }
    
                    if (response.status === 204) {
                        // No content but operation was successful
                        console.log("No content");
                    } else if (response.headers.get('Content-Length') === '0') {
                        // Empty response
                        console.log("Empty response from server");
                    } else {
                        // Parse JSON response
                        const resData = await response.json();
                        console.log(resData);
                    }
    
                    setOrders((prevOrders) =>
                        prevOrders.map((order) =>
                            order.id === currentOrder.id ? { ...order, status: currentOrder.status } : order
                        )
                    );
                    setIsUpdating(false);
                    setError("");
                    window.location.reload();
    
                    console.log("is it reaching here");
                } catch (err) {
                    setError((err as Error).message);
                } finally {
                    setUpdating(false);
                }
            }
        },
        [currentOrder, token]
    );
    

    return (
        <>
            <div className="min-h-16 w-full">
                <Container>
                    <div className="flex w-full justify-end">
                        <div className="w-fit h-full">
                            <Select
                                id="order_filter"
                                name="order_filter"
                                className="border border-[#c0c0c0]"
                                handleInputChange={(e) => setFilter(e.target.value)}
                                select={[
                                    { key: "all_orders", value: "Get all orders" },
                                    { key: "delivered_orders", value: "Delivered orders" },
                                    { key: "processed_orders", value: "Processed orders" },
                                    { key: "shipped_orders", value: "Shipped orders" },
                                ]}
                                defaultText="Order filter"
                            />
                        </div>
                    </div>
                </Container>
            </div>
            <Container className="mt-4 min-h-screen">
                <div className="flex justify-between items-center w-full mb-4">
                    <h3 className="font-semibold text-size-500 text-text-bold">All Orders</h3>
                </div>
                <div className="h-full w-full overflow-x-auto">
                    <table className="min-w-full text-center text-sm font-light">
                        <thead className="font-medium border-b bg-black text-white">
                            <tr>
                                <th scope="col" className="px-2 py-2 sm:px-4 sm:py-4">
                                    Order No
                                </th>
                                <th scope="col" className="px-2 py-2 sm:px-4 sm:py-4">
                                    Date
                                </th>
                                <th scope="col" className="px-2 py-2 sm:px-4 sm:py-4">
                                    Customer Name
                                </th>
                                <th scope="col" className="px-2 py-2 sm:px-4 sm:py-4">
                                    Email
                                </th>
                                <th scope="col" className="px-2 py-2 sm:px-4 sm:py-4">
                                    Price
                                </th>
                                <th scope="col" className="px-2 py-2 sm:px-4 sm:py-4">
                                    Status
                                </th>
                                <th scope="col" className="px-2 py-2 sm:px-4 sm:py-4">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody className="w-full">
                            {orders.length > 0 &&
                                orders.map((order) => (
                                    <tr key={order.id} className="border border-gray hover:bg-[#f0f0f0] cursor-pointer">
                                        <td className="whitespace-nowrap px-2 py-2 sm:px-4 sm:py-4 font-medium text-sm">{order.id}</td>
                                        <td className="whitespace-nowrap px-2 py-2 sm:px-4 sm:py-4 font-medium text-sm">{order.createdAT.split("T")[0]}</td>
                                        <td className="whitespace-nowrap px-2 py-2 sm:px-4 sm:py-4 font-medium text-sm">{order?.user.fullname}</td>
                                        <td className="whitespace-nowrap px-2 py-2 sm:px-4 sm:py-4 font-medium text-sm">{order?.user.email}</td>
                                        <td className="whitespace-nowrap px-2 py-2 sm:px-4 sm:py-4 font-medium text-sm flex gap-2">
                                            <IndianRupee size={20} />
                                            {order?.total}
                                        </td>
                                        <td className="whitespace-nowrap px-2 py-2 sm:px-4 sm:py-4 font-medium text-sm">
                                            <Notification
                                                type={notificationType[order.status as NotificationType]?.type}
                                                message={notificationType[order.status as NotificationType]?.message}
                                                className="rounded-md w-fit"
                                            />
                                        </td>
                                        <td className="whitespace-nowrap px-2 py-2 sm:px-4 sm:py-4 font-medium text-sm relative">
                                            <Button
                                                size="small"
                                                type="white"
                                                handleClick={() => handlePopupToggle(order.id)}
                                                className="border-none z-10"
                                            >
                                                <GripHorizontal />
                                            </Button>
                                            {activePopupId === order.id && (
                                                <Popup className="top-16">
                                                    <div className="flex w-full border-b border-[#f0f0f0]">
                                                        <Button
                                                            size="small"
                                                            type="white"
                                                            className="capitalize border-none bg-transparent flex gap-5 text-sm items-center"
                                                            handleClick={() => handleUpdateOrder(order.id)}
                                                        >
                                                            <BadgeCheck />
                                                            Update order status
                                                        </Button>
                                                    </div>
                                                </Popup>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                    {loading && (
                        <div className="w-full h-full grid place-items-center">
                            <Spinner />
                        </div>
                    )}
                    {error && (
                        <div className="mx-auto w-full h-screen grid place-content-center gap-4 border-2">
                            <h1 className="text-text-black font-medium text-xl first-letter:uppercase">{error}</h1>
                            <Link
                                to="/admin/"
                                className="mt-5 w-[20rem] py-3 cursor-pointer text-size-500 font-medium text-white bg-black text-center"
                            >
                                Refresh page
                            </Link>
                        </div>
                    )}
                </div>
                <Pagination url={url} setData={setOrders} dataLength={orders.length}/>
                
            </Container>

            {/* modal for updating the order status */}
            <Modal title="Update Order Status" isOpen={isUpdating} handleModalOpen={() => setIsUpdating((prevState) => !prevState)}>
                <form id="update_order_status" onSubmit={updateOrderStatus} className="w-full">
                    <div className="w-full flex justify-between flex-wrap gap-6 mb-6">
                        <div className="w-fit">
                            <p className="text-base font-semibold capitalize mb-4">Customer Name</p>
                            <p className="text-sm text-normal capitalize">{currentOrder?.user?.fullname}</p>
                        </div>
                        <div className="w-fit">
                            <p className="text-base font-semibold capitalize mb-4">Customer Email</p>
                            <p className="text-sm text-normal first-letter:uppercase">{currentOrder?.user?.email}</p>
                        </div>
                        <div className="w-fit">
                            <p className="text-base font-semibold capitalize mb-4">Day of Order</p>
                            <p className="text-sm text-normal capitalize">
                                {currentOrder?.createdAT && formatToHumanReadableDate(currentOrder.createdAT.split("T")[0])}
                            </p>
                        </div>
                        <div className="w-fit">
                            <p className="text-base font-semibold capitalize mb-4">Quantity</p>
                            <p className="text-sm text-normal capitalize">
                                {currentOrder?.items?.reduce((total, item) => total + item.quantity, 0)}
                            </p>
                        </div>
                        <div className="w-fit">
                            <p className="text-base font-semibold capitalize mb-4">Price</p>
                            <div className="flex gap-2">
                                <IndianRupee size={20} />
                                <p className="text-sm text-normal capitalize">
                                    {currentOrder?.items?.reduce((total, item) => total + parseFloat(item.price) * item.quantity, 0)}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="w-full">
                        <label htmlFor="order_status" className="text-size-500 font-semibold capitalize text-text-black mb-4">
                            Order Status
                        </label>
                        <div className="flex items-center border-2 border-[#c0c0c0] focus-within:border-blue mb-3 py-3 px-3 rounded-md mt-4">
                            <Select
                                id="order_status"
                                name="orderStatus"
                                select={notificationStatus}
                                className="font-normal text-text-black w-full p-0 border-none outline-none"
                                defaultText="Select order status"
                                handleInputChange={handleChange}
                            />
                        </div>
                    </div>
                    <button type="submit" className="w-full py-3 text-white bg-black font-bold text-size-500">
                        {updating ? "Loading..." : "Update Order Status"}
                    </button>
                </form>
            </Modal>
        </>
    );
};

export default ViewOrders;
