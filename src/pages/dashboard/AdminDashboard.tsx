import Container from "@/components/Container"
import { IndianRupee } from "lucide-react"

const AdminDashboard = () => {
  return (
    <div className="mt-4">
      {/* total graphs */}
      <div className="flex justify-between gap-y-10 flex-wrap">
        <Container className="p-4 w-[32%]">
          <div className="w-full">
            <h5 className="text-text-black text-size-500 font-normal mb-1">Total revenue</h5>
            <div className="flex gap-x-3">
              <IndianRupee size = {20} />
              <p className="text-text-black text-size-500 font-semibold">
                30000
              </p>
              </div>
          </div>
          {/* <div className="border-2 h-36 mt-2">

          </div> */}
        </Container>
        <Container className="p-4 w-[32%]">
          <div className="w-full">
            <h5 className="text-text-black text-size-500 font-normal mb-1">Total customer count</h5>
            <div className="flex gap-x-3">
              {/* <IndianRupee size = {20} /> */}
              <p className="text-text-black text-size-500 font-semibold">
                300
              </p>
              </div>
          </div>
          {/* <div className="border-2 h-36 mt-2">

          </div> */}
        </Container>
        <Container className="p-4 w-[32%]">
          <div className="w-full">
            <h5 className="text-text-black text-size-500 font-normal mb-1">Staff number</h5>
            <div className="flex gap-x-3">
              {/* <IndianRupee size = {20} /> */}
              <p className="text-text-black text-size-500 font-semibold">
                30
              </p>
              </div>
          </div>
          {/* <div className="border-2 h-36 mt-2">

          </div> */}
        </Container>
        <Container className="p-4 w-[32%]">
          <div className="w-full">
            <h5 className="text-text-black text-size-500 font-normal mb-1">Total product count</h5>
            <div className="flex gap-x-3">
              {/* <IndianRupee size = {20} /> */}
              <p className="text-text-black text-size-500 font-semibold">
                30000
              </p>
              </div>
          </div>
          {/* <div className="border-2 h-36 mt-2">

          </div> */}
        </Container>
        <Container className="p-4 w-[32%]">
          <div className="w-full">
            <h5 className="text-text-black text-size-500 font-normal mb-1">Best products</h5>
            <div className="flex gap-x-3">
              {/* <IndianRupee size = {20} /> */}
              <p className="text-text-black text-size-500 font-semibold">
                30
              </p>
              </div>
          </div>
          {/* <div className="border-2 h-36 mt-2">

          </div> */}
        </Container>
        <Container className="p-4 w-[32%]">
          <div className="w-full">
            <h5 className="text-text-black text-size-500 font-normal mb-1">Total product count</h5>
            <div className="flex gap-x-3">
              {/* <IndianRupee size = {20} /> */}
              <p className="text-text-black text-size-500 font-semibold">
                30000
              </p>
              </div>
          </div>
          {/* <div className="border-2 h-36 mt-2">

          </div> */}
        </Container>
      </div>
      {/* revenue generated dashboard */}
      <div className="w-full mt-5">
        <Container className="w-full p-4">
          <div className="w-full flex justify-between">
            <h4 className="text-text-black text-size font-semibold">
              Revenue
            </h4>
          </div>
          <div className="w-full mt-5 h-60 border-2">

          </div>
        </Container>
      </div>

      {/* last analatics */}
      <div className="mt-5 w-full flex justify-between">
        <Container className="w-[35%]">
          <div className="w-full flex justify-between">
            <h4 className="text-text-black text-size font-semibold">
              Product status
            </h4>
          </div>
          <div className="w-full mt-5 h-40 border-2">

          </div>
        </Container>
        <Container className="w-[63%]">
          <div className="w-full flex justify-between">
            <h4 className="text-text-black text-size font-semibold">
              Customers
            </h4>
          </div>
          <div className="w-full mt-5 h-40 border-2">

          </div>
        </Container>
      </div>
    </div>
  )
}

export default AdminDashboard