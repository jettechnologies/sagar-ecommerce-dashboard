import Notification from "@/components/Notification";
import Container from "@/components/Container";

const ViewOrders = () => {
  return (
    <Container className="mt-4 min-h-screen">
            <div className="flex justify-between items-center w-full mb-4">
                <h3 className="font-semibold text-size-500 text-text-bold">
                    All Orders
                </h3>
            </div>
            <div className="h-full">
                <table className="min-w-full text-center text-sm font-light">
                    <thead className="font-medium border-b bg-black text-white">
                        <tr>
                            <th scope="col" className="px-6 py-4">Customer Name</th>
                            <th scope="col" className="px-6 py-4">#ID</th>
                            <th scope="col" className="px-6 py-4">Spent</th>
                            <th scope="col" className="px-6 py-4">Last Ordered</th>
                            <th scope="col" className="px-6 py-4">Email</th>
                            <th scope="col" className="px-6 py-4">Phone Number</th>
                            <th scope="col" className="px-6 py-4">Status</th>
                            <th scope="col" className="px-6 py-4">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border border-gray hover:bg-gray cursor-pointer">
                            <td className="whitespace-nowrap px-6 py-4 font-medium text-sm items-center flex gap-2">
                                <input type="checkbox" className=""/>
                                John Doe
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 font-medium text-sm">Mark</td>
                            <td className="whitespace-nowrap px-6 py-4 font-medium text-sm">Otto</td>
                            <td className="whitespace-nowrap px-6 py-4 font-medium text-sm">@mdo</td>
                            <td className="whitespace-nowrap px-6 py-4 font-medium text-sm">Otto</td>
                            <td className="whitespace-nowrap px-6 py-4 font-medium text-sm">@mdo</td>
                            <td className="whitespace-nowrap px-6 py-4 font-medium text-sm"><Notification type = "warning" message="pending" className="text-orange-500 rounded-md w-fit"/></td>
                            <td className="whitespace-nowrap px-6 py-4 font-medium text-sm">@mdo</td>
                        </tr>
                        <tr className="border border-gray rounded-lg cursor-pointer">
                            <td className="whitespace-nowrap px-6 py-4 font-medium text-sm items-center flex gap-2">
                                <input type="checkbox" className=""/>
                                John Doe
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 font-medium text-sm">Mark</td>
                            <td className="whitespace-nowrap px-6 py-4 font-medium text-sm">Otto</td>
                            <td className="whitespace-nowrap px-6 py-4 font-medium text-sm">@mdo</td>
                            <td className="whitespace-nowrap px-6 py-4 font-medium text-sm">Otto</td>
                            <td className="whitespace-nowrap px-6 py-4 font-medium text-sm">@mdo</td>
                            <td className="whitespace-nowrap px-6 py-4 font-medium text-sm"><Notification type = "warning" message="pending" className="text-orange-500 rounded-md w-fit"/></td>
                            <td className="whitespace-nowrap px-6 py-4 font-medium text-sm">@mdo</td>
                        </tr>
                        <tr className="border border-gray hover:bg-gray cursor-pointer">
                            <td className="whitespace-nowrap px-6 py-4 font-medium text-sm items-center flex gap-2">
                                <input type="checkbox" className=""/>
                                John Doe
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 font-medium text-sm">Mark</td>
                            <td className="whitespace-nowrap px-6 py-4 font-medium text-sm">Otto</td>
                            <td className="whitespace-nowrap px-6 py-4 font-medium text-sm">@mdo</td>
                            <td className="whitespace-nowrap px-6 py-4 font-medium text-sm">Otto</td>
                            <td className="whitespace-nowrap px-6 py-4 font-medium text-sm">@mdo</td>
                            <td className="whitespace-nowrap px-6 py-4 font-medium text-sm"><Notification type = "warning" message="pending" className="text-orange-500 rounded-md w-fit"/></td>
                            <td className="whitespace-nowrap px-6 py-4 font-medium text-sm">@mdo</td>
                        </tr>
                        <tr className="border border-gray rounded-lg cursor-pointer">
                            <td className="whitespace-nowrap px-6 py-4 font-medium text-sm items-center flex gap-2">
                                <input type="checkbox" className=""/>
                                John Doe
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 font-medium text-sm">Mark</td>
                            <td className="whitespace-nowrap px-6 py-4 font-medium text-sm">Otto</td>
                            <td className="whitespace-nowrap px-6 py-4 font-medium text-sm">@mdo</td>
                            <td className="whitespace-nowrap px-6 py-4 font-medium text-sm">Otto</td>
                            <td className="whitespace-nowrap px-6 py-4 font-medium text-sm">@mdo</td>
                            <td className="whitespace-nowrap px-6 py-4 font-medium text-sm"><Notification type = "warning" message="pending" className="text-orange-500 rounded-md w-fit"/></td>
                            <td className="whitespace-nowrap px-6 py-4 font-medium text-sm">@mdo</td>
                        </tr>
                        <tr className="border border-gray hover:bg-gray cursor-pointer">
                            <td className="whitespace-nowrap px-6 py-4 font-medium text-sm items-center flex gap-2">
                                <input type="checkbox" className=""/>
                                John Doe
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 font-medium text-sm">Mark</td>
                            <td className="whitespace-nowrap px-6 py-4 font-medium text-sm">Otto</td>
                            <td className="whitespace-nowrap px-6 py-4 font-medium text-sm">@mdo</td>
                            <td className="whitespace-nowrap px-6 py-4 font-medium text-sm">Otto</td>
                            <td className="whitespace-nowrap px-6 py-4 font-medium text-sm">@mdo</td>
                            <td className="whitespace-nowrap px-6 py-4 font-medium text-sm"><Notification type = "success" message="success" className="text-green-700 rounded-md w-fit"/></td>
                            <td className="whitespace-nowrap px-6 py-4 font-medium text-sm">@mdo</td>
                        </tr>
                        <tr className="border border-gray rounded-lg cursor-pointer">
                            <td className="whitespace-nowrap px-6 py-4 font-medium text-sm items-center flex gap-2">
                                <input type="checkbox" className=""/>
                                John Doe
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 font-medium text-sm">Mark</td>
                            <td className="whitespace-nowrap px-6 py-4 font-medium text-sm">Otto</td>
                            <td className="whitespace-nowrap px-6 py-4 font-medium text-sm">@mdo</td>
                            <td className="whitespace-nowrap px-6 py-4 font-medium text-sm">Otto</td>
                            <td className="whitespace-nowrap px-6 py-4 font-medium text-sm">@mdo</td>
                            <td className="whitespace-nowrap px-6 py-4 font-medium text-sm"><Notification type = "success" message="success" className="text-green-700 rounded-md w-fit"/></td>
                            <td className="whitespace-nowrap px-6 py-4 font-medium text-sm">@mdo</td>
                        </tr>
                        <tr className="border border-gray hover:bg-gray cursor-pointer">
                            <td className="whitespace-nowrap px-6 py-4 font-medium text-sm items-center flex gap-2">
                                <input type="checkbox" className=""/>
                                John Doe
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 font-medium text-sm">Mark</td>
                            <td className="whitespace-nowrap px-6 py-4 font-medium text-sm">Otto</td>
                            <td className="whitespace-nowrap px-6 py-4 font-medium text-sm">@mdo</td>
                            <td className="whitespace-nowrap px-6 py-4 font-medium text-sm">Otto</td>
                            <td className="whitespace-nowrap px-6 py-4 font-medium text-sm">@mdo</td>
                            <td className="whitespace-nowrap px-6 py-4 font-medium text-sm"><Notification type = "warning" message="pending" className="text-orange-500 rounded-md w-fit"/></td>
                            <td className="whitespace-nowrap px-6 py-4 font-medium text-sm">@mdo</td>
                        </tr>
                        <tr className="border border-gray hover:bg-gray cursor-pointer">
                            <td className="whitespace-nowrap px-6 py-4 font-medium text-sm items-center flex gap-2">
                                <input type="checkbox" className=""/>
                                John Doe
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 font-medium text-sm">Mark</td>
                            <td className="whitespace-nowrap px-6 py-4 font-medium text-sm">Otto</td>
                            <td className="whitespace-nowrap px-6 py-4 font-medium text-sm">@mdo</td>
                            <td className="whitespace-nowrap px-6 py-4 font-medium text-sm">Otto</td>
                            <td className="whitespace-nowrap px-6 py-4 font-medium text-sm">@mdo</td>
                            <td className="whitespace-nowrap px-6 py-4 font-medium text-sm"><Notification type = "success" message="success" className="text-green-700 rounded-md w-fit"/></td>
                            <td className="whitespace-nowrap px-6 py-4 font-medium text-sm">@mdo</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className="mt-6 w-full flex justify-end">
                <div className="w-48 h-10 border-2 border-black">

                </div>
            </div>
        </Container>
  )
}

export default ViewOrders;