import Image from "@/components/Image"; 
import Button from "@/components/Button";
import { User2, GripHorizontal, Shield, Trash } from "lucide-react";
import Popup from "@/components/Popup";

type AdminDataType = {
  id: number;
  adminID: string | null;
  email: string;
  role: string;
  admintype: string;
  adminAccessLevel: string;
  password: string;
  mobile: string;
  fullname: string;
  home_address: string | null;
  UpdatedAt: string | null;
  RegisteredAt: string;
  profilePicture: string | null;
  gender: string | null;
  Nationality: string | null;
  isLoggedIn: boolean;
  isRegistered: boolean;
  isActivated: boolean;
  isDeactivated: boolean;
  isVerified: boolean;
  reset_link_exptime: string | null;
  password_reset_link: string | null;
};

type AdminResponseProps = {
  response: AdminDataType[][];
  handlePopupToggle: (id: number) => void;
  activePopupId: number | null;
  handleChangeType: (id: number) => void;
  handleChangeLevel: (id: number) => void;
  handleIsDeleting: (id: number) => void;
};

const AdminResponse: React.FC<AdminResponseProps> = ({
  response,
  handlePopupToggle,
  activePopupId,
  handleChangeType,
  handleChangeLevel,
  handleIsDeleting,
}) => {
  return (
    <>
      {response[0].map((admin: AdminDataType, index) => (
        <tr key={index} className="border border-gray hover:bg-gray cursor-pointer capitalize items-center">
          <td className="whitespace-nowrap px-6 py-4 font-medium text-sm flex gap-4 items-center">
            <div className="w-[3rem] h-[3rem] rounded-full">
              {admin.profilePicture ? (
                <Image
                  src={admin.profilePicture}
                  alt="profile image"
                  className="w-[3rem] h-[3rem] rounded-full"
                />
              ) : (
                <p className="text-size-600 uppercase text-white bg-black text-center flex items-center justify-center w-full h-full rounded-full border">
                  {admin.fullname.split(" ")[0].substring(0, 1)}
                </p>
              )}
            </div>
            <div className="flex gap-y-2 flex-col">
              <p className="text-size-500 text-text-black font-semibold">
                {admin.fullname}
              </p>
              <p className="text-sm text-text-black font-normal">
                {admin.RegisteredAt.split("T")[0]}
              </p>
            </div>
          </td>
          <td className="whitespace-nowrap px-6 py-4 font-medium text-sm">{admin.email}</td>
          <td className="whitespace-nowrap px-6 py-4 font-medium text-sm">{admin.mobile}</td>
          <td className="whitespace-nowrap px-6 py-4 font-medium text-sm">{admin.adminAccessLevel}</td>
          <td className="whitespace-nowrap px-6 py-4 font-medium text-sm">{admin.Nationality ?? "was not set"}</td>
          <td className="whitespace-nowrap px-6 py-4 font-medium text-sm relative">
            <Button
              size="small"
              type="white"
              handleClick={() => handlePopupToggle(admin.id)}
              className={`border-none z-10`}
            >
              <GripHorizontal />
            </Button>
            {activePopupId === admin.id && (
              <Popup className="top-16">
                <div className="w-full border-b border-[#f0f0f0] flex">
                  <Button
                    size="small"
                    type="white"
                    handleClick={() => handleChangeType(admin.id)}
                    className="capitalize border-none bg-transparent flex gap-x-5 text-sm items-center"
                  >
                    <User2 />
                    Change Admin Type
                  </Button>
                </div>
                <div className="flex w-full border-b border-[#f0f0f0]">
                  <Button
                    size="small"
                    type="white"
                    className="capitalize border-none bg-transparent flex gap-5 text-sm items-center"
                    handleClick={() => handleChangeLevel(admin.id)}
                  >
                    <Shield />
                    Change Access Level
                  </Button>
                </div>
                <div className="flex w-full border-b border-[#f0f0f0]">
                  <Button
                    size="small"
                    type="white"
                    className="capitalize border-none bg-transparent flex gap-5 text-sm items-center"
                    handleClick={() => handleIsDeleting(admin.id)}
                  >
                    <Trash />
                    Delete Admin
                  </Button>
                </div>
              </Popup>
            )}
          </td>
        </tr>
      ))}
    </>
  );
};

export default AdminResponse;
