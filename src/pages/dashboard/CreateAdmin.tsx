import { CircleUserRound } from "lucide-react";
import Container from "@/components/Container";
import Select from "@/components/Select";
import Button from "@/components/Button";

const nationality:{key:string; value:string}[] = [
    { "key": "nationality", "value": "Select nationality" },
    { "key": "american", "value": "American" },
    { "key": "canadian", "value": "Canadian" },
    { "key": "british", "value": "British" },
    { "key": "australian", "value": "Australian" },
    { "key": "indian", "value": "Indian" },
    { "key": "chinese", "value": "Chinese" },
    { "key": "japanese", "value": "Japanese" },
    { "key": "german", "value": "German" },
    { "key": "french", "value": "French" },
    { "key": "italian", "value": "Italian" },
    { "key": "mexican", "value": "Mexican" },
    { "key": "brazilian", "value": "Brazilian" },
    { "key": "russian", "value": "Russian" },
    { "key": "spanish", "value": "Spanish" },
    { "key": "south_korean", "value": "South Korean" },
    { "key": "nigerian", "value": "Nigerian" },
    { "key": "south_african", "value": "South African" },
    { "key": "egyptian", "value": "Egyptian" },
    { "key": "kenyan", "value": "Kenyan" },
    { "key": "ethiopian", "value": "Ethiopian" },
    { "key": "saudi", "value": "Saudi Arabian" },
    { "key": "emirati", "value": "Emirati" },
    { "key": "turkish", "value": "Turkish" },
    { "key": "iranian", "value": "Iranian" },
    { "key": "iraqi", "value": "Iraqi" },
    { "key": "israeli", "value": "Israeli" }
  ]

  const adminType:{key:string; value:string}[] = [
    { "key": "adminType", "value": "Select admin type" },
    { "key": "admin", "value": "Other Admin" },
    { "key": "super_admin", "value": "Admin" }
  ]
  
  const adminLevel:{key:string; value:string}[] = [
    { "key": "adminLevel", "value": "Select admin level" },
    { "key": "level-one", "value": "Level one" },
    { "key": "level-two", "value": "level two" },
    { "key": "level-three", "value": "level three" }
  ]

const CreateAdmin = () => {
  return (
    <Container className ="mt-4 min-h-screen grid place-items-center">
        <div className="min-h-1/2 w-fit border border-[#c0c0c0] rounded-md py-2 flex flex-col gap-y-6 items-center">
            <CircleUserRound size = {80} strokeWidth={1} color="#121212"/>
            <form className="w-[30rem] p-4">
                <div id = "create-admin-form"  className="w-full h-fit flex flex-col ">
                    <div className="w-full">
                        <label htmlFor="fullname" className="text-size-400 text-text-black font-medium mb-3 capitalize">
                            Fullname
                        </label>
                        <input 
                            type="text" 
                            placeholder="Enter Fullname" 
                            id="fullname" 
                            name="fullname"
                            className="rounded-md mt-3 border border-[#c0c0c0] w-full p-3 font-roboto text-size-400 font-normal first-letter:uppercase"
                        />
                    </div>
                    <div className="w-full">
                        <label htmlFor="email" className="text-size-400 text-text-black font-medium mb-3 capitalize">
                            email
                        </label>
                        <input 
                            type="text" 
                            placeholder="Enter Email Address" 
                            id="email" 
                            name="email"
                            className="rounded-md mt-3 border border-[#c0c0c0] w-full p-3 font-roboto text-size-400 font-normal first-letter:uppercase"
                        />
                    </div>
                    <div className="w-full">
                        <label htmlFor="nationality" className="text-size-400 text-text-black font-medium mb-3 capitalize">
                            nationality
                        </label>
                        <div className="mt-3">
                            <Select id = "nationality" name="nationality" className="border border-[#c0c0c0] text-medium text-sm w-full" select={nationality}/>
                        </div>
                    </div>
                    <div className="flex gap-x-6">
                        <div className="w-full">
                            <label htmlFor="admin-type" className="text-size-400 text-text-black font-medium mb-3 capitalize">
                                admin type
                            </label>
                            <div className="mt-3">
                                <Select id = "admin-type" name="admin-type" className="border border-[#c0c0c0] text-medium text-sm w-full" select={adminType}/>
                            </div>
                        </div>
                        <div className="w-full">
                            <label htmlFor="admin-level" className="text-size-400 text-text-black font-medium mb-3 capitalize">
                                admin level
                            </label>
                            <div className="mt-3">
                                <Select id = "admin-level" name="admin-level" className="border border-[#c0c0c0] text-medium text-sm w-full" select={adminLevel}/>
                            </div>
                        </div>
                    </div>
                </div>
                <Button size = "large" className="w-full mt-4">Create Admin</Button>
            </form>
        </div>
    </Container>
  )
}

export default CreateAdmin