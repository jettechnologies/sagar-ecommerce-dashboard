import { useState, useEffect } from "react";
import { Nationalities } from "@/data";
import Select from "@/components/Select";
import Button from "@/components/Button";

interface EditUser{
    fullname: string;
    email: string;
    nationality: string;
    address: string;
    mobile: string;
    gender: string;
}

type EditProfileProps = {
    token: string;
};

const EditProfile:React.FC<EditProfileProps> = ({token}) => {

    const [currentEmail,setCurrentEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [editUser, setEditUser] = useState<EditUser>({
        fullname: "",
        email: "",
        nationality: "",
        address: "",
        mobile: "",
        gender: "",
      });

    console.log(error);

    // fetching the profile info
  const getAdminInfo = async(token:string) =>{
    try {
      const res = await fetch("https://sagar-e-commerce-backend.onrender.com/api/v1/sagar_stores_api/admin-auth/profile", {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      
      const data = await res.json();

      if (!res.ok) {
        console.log(res);
        setError(data.message || 'An error occurred');
        return;
      }

      const user:EditUser = {
        fullname: data?.fullname,
        email: data.email,
        nationality: data?.Nationality ? data?.Nationality : "",
        address : "",
        mobile: data?.mobile,
        gender: data?.gender ? data?.gender : "",
      }
      setCurrentEmail(data.email)
      setEditUser(user)
      console.log(user)
    }
    catch (e : any) {
      console.log(e.message);
      setError(e.message);
    } finally {
      console.log("fetch finally")
    }
  }

    useEffect(() =>{
      if(!token) return;

      getAdminInfo(token);
    }, [token]);
  
    
    // handling the update of the state controlling the userEdit inputs
    const handleUserEdit = (
        e:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
      ) =>{
        const target = e.target as HTMLInputElement | HTMLSelectElement;
        const { name, value } = target;
    
        setEditUser({ ...editUser, [name]: value.toLocaleLowerCase()});
      }
  // Handling the profile submit
  const handleEditProfile = async(e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const {fullname, email, nationality, mobile, address, gender} = editUser;

    let data;
    
    if(email.toLocaleLowerCase() === currentEmail.toLocaleLowerCase()){
      data = {
        firstname: fullname,
        mobile: mobile,
        Nationality: nationality,
        home_address: address,
        gender,
      }
    }
    else{
      data = {
        email,
        firstname: fullname,
        mobile: mobile,
        Nationality: nationality,
        home_address: address,
        gender,
      }
    }

    console.log(data)

    const headers = {
      'Content-type': 'application/json',
      "Accept": "application/json",
      Authorization: `Bearer ${token}`,
    }

    try {
      setLoading(true);
      const res = await fetch(
          "https://sagar-e-commerce-backend.onrender.com/api/v1/sagar_stores_api/admin-profile-mgt/edit-admin-profile",
          {
              method: "PATCH",
              headers,
              body: JSON.stringify(data)
          }
      )

      if (res.ok) {
          console.log('Product created successfully');
          console.log(res)
          const data = await res.json();
        console.log(data);

          // setResponse('Product created successfully');
      } else {
          const errorData = await res.json();
          console.error('Failed to create product:', errorData.message);
          setError('Failed to edit profile: ' + errorData.message);
        }
    } catch (error: any) {
        console.error('Error:', error.message);
        setError('Failed to edit profile'+ error.message);
    } finally {
        setLoading(false);
    }
  
  }


  return (
    <div className="flex-1">
            {/* edit profile section */}
          <div className="w-full h-full">
              <h4 className="text-size-500 text-text-black font-medium">Edit Profile</h4>
              <form id="edit-profile" onSubmit={handleEditProfile} className="w-full h-[95%] flex flex-col justify-evenly gap-5 border border-gray p-5 mt-5 shadow-md">
                <div className="w-full">
                  <label htmlFor="fullname" className="text-size-400 text-text-black font-medium mb-3">
                      Fullname
                  </label>
                    <input 
                      className="mt-3 rounded-md border border-[#c0c0c0] w-full p-3 font-roboto text-size-400 font-normal first-letter:uppercase"
                      type="text" 
                      name="fullname" 
                      id="fullname" 
                      value = {editUser.fullname} 
                      onChange={handleUserEdit}
                    />
                  </div>
                  <div className="w-full">
                  <label htmlFor="email" className="text-size-400 text-text-black font-medium mb-3">
                      Email
                  </label>
                    <input 
                      className="mt-3 rounded-md border border-[#c0c0c0] w-full p-3 font-roboto text-size-400 font-normal first-letter:uppercase"
                      type="text" 
                      name="email" 
                      id="email" 
                      value = {editUser.email} 
                      onChange={handleUserEdit}
                    />
                  </div>
                  <div className="w-full">
                  <label htmlFor="nationality" className="text-size-400 text-text-black font-medium mb-3">
                      Nationality
                  </label>
                  <Select
                    id="nationality"
                    name="nationality"
                    className="font-normal text-sm w-full py-3 border border-[#c0c0c0] mt-3"
                    select={Nationalities}
                    defaultText="Select your nationality"
                    handleInputChange={handleUserEdit}
                    />
                  </div>
                  <div className="w-full">
                  <label htmlFor = "address" className="text-size-400 text-text-black font-medium mb-3">
                    Home Address
                  </label>
                    <input 
                      className="mt-3 rounded-md border border-[#c0c0c0] w-full p-3 font-roboto text-size-400 font-normal first-letter:uppercase" 
                      type="text" 
                      name="address" 
                      id="address" 
                      value = {editUser.address} 
                      onChange={handleUserEdit}
                    />
                  </div>
                  <div className="w-full">
                    <label htmlFor="mobile" className="text-size-400 text-text-black font-medium mb-3">
                      Mobile
                    </label>
                    <input 
                      className="mt-3 rounded-md border border-[#c0c0c0] w-full p-3 font-roboto text-size-400 font-normal first-letter:uppercase"
                      type="text" 
                      name="mobile" 
                      id="mobile" 
                      value={editUser.mobile}
                      onChange={handleUserEdit}
                    />
                  </div>
                  <div className="full">
                    <label htmlFor="gender" className="text-size-400 text-text-black font-medium mb-3">
                      Gender
                    </label>
                    <input 
                      className="mt-3 rounded-md border border-[#c0c0c0] w-full p-3 font-roboto text-size-400 font-normal first-letter:uppercase"
                      type="text" 
                      name="gender" 
                      id="gender" 
                      value = {editUser.gender}
                      onChange={handleUserEdit}
                    />
                  </div>
                  <Button size = "small" className = "">
                    {loading ? "Loading..." :"Update profile"}
                  </Button>
              </form>
            </div>
          </div>
  )
}

export default EditProfile