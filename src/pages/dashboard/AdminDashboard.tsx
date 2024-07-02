import Container from "@/components/Container"
import { IndianRupee } from "lucide-react"

const AdminDashboard = () => {
  return (
    <div className="mt-4">
      <div className="flex justify-between">
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
          <div className="border-2 h-36 mt-2">

          </div>
        </Container>
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
          <div className="border-2 h-36 mt-2">

          </div>
        </Container>
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
          <div className="border-2 h-36 mt-2">

          </div>
        </Container>
      </div>
    </div>
  )
}

export default AdminDashboard