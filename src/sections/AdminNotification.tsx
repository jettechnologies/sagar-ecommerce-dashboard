import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Trash2, CircleAlert } from "lucide-react";
import useGetRequest from "@/pages/hooks/useGetRequest";
import { useAuth } from "@/context/authContext";
import Spinner from "@/components/Spinner";
import Modal from "@/components/Modal";
import Button from "@/components/Button";
import { EasyHTTP } from "@/utils/httpRequest";
import { formatToHumanReadableDate } from "@/utils/dateFunctions";

interface NotificationType {
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

  const { loading: notificationLoading, data, error: fetchError } = useGetRequest<[NotificationType[], number]>(
    "admin-profile-mgt/all-notifications", 
    { headers },
    shouldFetch
  );

  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [currentNotification, setCurrentNotification] = useState<NotificationType | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (data && data[0]) {
      setNotifications(data[0]);
    }
  }, [data]);

  const deleteNotification = useCallback(async () => {
    // e.stopPropagation();
    if (!currentNotification) return;

    const url = `admin-profile-mgt/delete-one-notification/${currentNotification.id}`;
    const headers: HeadersInit = {
      "Content-Type": 'application/json',
      "Accept": "application/json",
      Authorization: `Bearer ${token}`,
    };

    // Filter out the notification to be deleted
    const remainingNotifications = notifications.filter(notification => notification.id !== currentNotification.id);

    try {
      setLoading(true);
      const response = await easyHttp.delete(url, headers);
      console.log(response);

      setNotifications(remainingNotifications);
      setIsDeleting(false);
    } catch (err) {
      console.log((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [currentNotification, token, notifications]);

  const handleNotificationDelete = (id: number, e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // Prevent event bubbling
    const current = notifications.find(notification => notification.id === id);
    if (current) {
      setCurrentNotification(current);
      setIsDeleting(true);
    }
  };

  return (
    <>
      <div className="p-4 w-[18rem] z-40 h-[20rem] absolute top-[5.5rem] right-[3rem] shadow-md overflow-y-scroll bg-white rounded-md">
        <div className="overflow-auto w-full min-h-screen">
          <h3 className="text-text-black font-semibold text-xl capitalize">notifications</h3>
          <hr className="my-3 border-[#c0c0c0]" />
          <ul className="flex flex-col gap-y-6">
            {notificationLoading ? (
              <div className="w-full h-fit">
                <Spinner />
              </div>
            ) : notifications.length > 0 ? (
              notifications.map(notification => (
                <li key={notification.id} className="w-full py-2 flex gap-3">
                  <div className="flex-1">
                    <h4 className="text-size-500 font-semibold first-letter:uppercase text-text-black mb-2">
                      {notification.subject}
                    </h4>
                    <p className="text-sm font-normal text-text-black first-letter:uppercase mb-2">
                      {notification.message}
                    </p>
                    <p className="text-sm text-[#c0c0c0] font-normal">
                      {notification.date && formatToHumanReadableDate(notification.date.split("T")[0])}
                    </p>
                  </div>
                  <button 
                    className="p-1 h-fit text-red-500 cursor-pointer"
                    onClick={(e) => handleNotificationDelete(notification.id, e)}
                  >
                    <Trash2 size={20} />
                  </button>
                </li>
              ))
            ) : (
              <p>No notifications available.</p>
            )}
          </ul>
        </div>
      </div>

      <Modal title="Delete Notification" isOpen={isDeleting} handleModalOpen={() => setIsDeleting(false)}>
        <div className="flex flex-col w-full">
          <div className="flex items-center gap-3">
            <CircleAlert size={35} color="rgb(239 68 68)" />
            <p className="text-text-black font-medium text-size-400">
              Are you sure you want to delete this notification?
            </p>
          </div>
          <div className="flex gap-5 mt-5 border-t border-[#f0f0f0] pt-3">
            <Button 
              type="white" 
              size="medium" 
              className="text-sm uppercase flex-1"
              handleClick={() => setIsDeleting(false)}
            >
              No, cancel
            </Button>
            <Button 
              type="danger" 
              size="medium"
              handleClick={() => deleteNotification()}
              className="text-sm uppercase flex-1"
            >
              {loading ? "Loading" : "Yes, delete"}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default AdminNotification;

// // Usage of the component
// const [isShowing, setIsShowing] = useState(false);

// return (
//   <div 
//     className="w-10 h-10 flex items-center justify-center rounded-full text-blue cursor-pointer relative"
//     onClick={() => setIsShowing(prevState => !prevState)}
//   >
//     <BellDot size={27}/>
//     {isShowing && <AdminNotification />}
//   </div>
// );
