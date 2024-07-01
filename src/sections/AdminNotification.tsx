import { Trash2, CircleAlert } from "lucide-react";
import useGetRequest from "@/pages/hooks/useGetRequest";
import { useAuth } from "@/context/authContext";
import { Spinner } from "@radix-ui/themes";
import Modal from "@/components/Modal";
import Button from "@/components/Button";
import { EasyHTTP } from "@/utils/httpRequest";
import { formatToHumanReadableDate } from "@/utils/dateFunctions";
import { useCallback, useEffect, useMemo, useState } from "react";

interface NotifcationType {
    id: number;
    date: string;
    account: string;
    message: string;
    subject: string;
}

const easyHttp = new EasyHTTP();

const AdminNotification = () => {
    const { token, loading: authLoading } = useAuth();

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

    const { loading: notificationLoading, data, error: fetchError } = useGetRequest<[NotifcationType[] , number]>(
        "admin-profile-mgt/all-notifications", 
        { headers },
        shouldFetch
    );
    const [notifications, setNotifications] = useState<NotifcationType[] | []>([]);
    const [currentNotification, setCurrentNotification] = useState<NotifcationType | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [loading, setLoading] = useState(false);
    console.log(data)

    useEffect(() =>{
        if(data && data[0]){
            setNotifications(data[0]);
        }
    }, [data]);

    const deleteNotification = useCallback(async () => {
        if (!currentNotification && notifications.length === 0) return;

        const url = `admin-profile/delete-one-notification/${currentNotification?.id}`;
        const headers: HeadersInit = {
            "Content-Type": 'application/json',
            "Accept": "application/json",
            Authorization: `Bearer ${token}`,
        };

        // Filter out the notification to be deleted
        const remainingNotifications = notifications?.filter(notification => notification.id !== currentNotification?.id);

        try {
            setLoading(true);
            const response = await easyHttp.delete(url, headers);
            console.log(response);

            setNotifications(remainingNotifications);
            setIsDeleting(false);
        } catch (err) {
            console.log((err as Error).message);
            // setError((err as Error).message); // Uncomment and handle the error state if needed
        } finally {
            setLoading(false);
        }
    }, [currentNotification, token, notifications, setNotifications]);

    // for the loading of the notifications
    

    if (notificationLoading) {
        return <div className="w-full h-full">
            <Spinner />
        </div>
    }

    if (fetchError) {
        return <div className="w-full h-full">
            <p>{fetchError}</p>
        </div>
    }

    const handleNotificationDelete = (id:number) =>{
        if(notifications){
            const current = notifications.find(prevState => prevState.id === id);
            current && setCurrentNotification(current);
        }
        setIsDeleting(prevState => !prevState);

    console.log("its working")
    }

    return (
        <>
        <div className="p-4 w-[18rem] z-40 h-[20rem] absolute top-[4.5rem] -left-[1rem] shadow-md overflow-y-scroll bg-white rounded-md">
            <div className="overflow-auto w-full min-h-screen">
                <h3 className="text-text-black font-semibold text-xl capitalize">notifications</h3>
                <hr className="my-3 border-[#c0c0c0]" />
                <ul className="flex flex-col gap-y-6">
                    {notifications && notifications.length > 0 ? (
                        notifications.map(notification => (
                            <li key={notification.id} className="w-full px-4 py-2 flex">
                                <div className="flex-1">
                                    <h4 className="text-size-500 font-semibold first-letter:uppercase text-text-black mb-2">
                                        {notification.subject}
                                    </h4>
                                    <p className="text-sm font-normal text-text-black first-letter:uppercase mb-2">
                                        {notification.message}
                                    </p>
                                    <p className="text-sm text-[#c0c0c0] font-normal">{notification.date && formatToHumanReadableDate(notification.date.split("T")[0])}</p>
                                </div>
                                <div 
                                    className="w-4 h-4 text-red-500 cursor-pointer"
                                    onClick={() =>handleNotificationDelete(notification.id)}
                                >
                                    <Trash2 size={20} />
                                </div>
                            </li>
                        ))
                    ) : (
                        <p>No notifications available.</p>
                    )}
                </ul>
            </div>
        </div>

        {/* Deleting existing product category */}
        <Modal title = "Delete other admins" isOpen={isDeleting} handleModalOpen={() => setIsDeleting(prevState => !prevState)}>
        <div className="flex flex-col w-full">
            <div className="flex items-center gap-3">
                {/* <MessageSquareWarning size = {35} color = "rgb(239 68 68)"/> */}
                <CircleAlert size = {35} color = "rgb(239 68 68)" />
                <p className="text-text-black font-medium text-size-400">
                    Are you sure u want to delete this notification ?
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
                    handleClick={() => deleteNotification()}
                    className="text-sm uppercase flex-1"
                >
                    {loading ? "loading" : "yes, delete"}
                </Button>
            </div>
        </div>
        </Modal>
        </>
    );
};

export default AdminNotification;
