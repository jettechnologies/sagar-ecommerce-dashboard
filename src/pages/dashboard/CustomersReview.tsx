import Container from "@/components/Container";


const CustomersReview = () => {
  return (
    <div className="w-full h-full">
        <Container className="pt-5">
        <div className="w-full flex flex-col gap-y-12">
            <div className="w-fit order-2">
                <h4 className="mb-6">
                  Newletter Subscribers
                </h4>
                <table className="min-w-full text-center text-sm font-light">
                    <thead className="font-medium border-b bg-black text-white">
                        <tr>
                            <th scope="col" className="px-6 py-4">S/N</th>
                            <th scope="col" className="px-6 py-4">Email Address</th>
                        </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          1
                        </td>
                        <td>
                          John@gmail.com
                        </td>
                      </tr>
                    </tbody>
                </table>
            </div>
            <div className="flex-1">
              <h4 className="mb-6">
                  Customer Feedbacks
                </h4>
                <table className="min-w-full text-center text-sm font-light">
                    <thead className="font-medium border-b bg-black text-white">
                        <tr>
                            <th scope="col" className="px-6 py-4">S/N</th>
                            <th scope="col" className="px-6 py-4">Email Address</th>
                            <th scope="col" className="px-6 py-4">Shopping Experience Rating</th>
                            <th scope="col" className="px-6 py-4">Additional Feedback</th>
                        </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          1
                        </td>
                        <td>
                          John@gmail.com
                        </td>
                        <td>
                          The experience was plensant
                        </td>
                        <td>
                          The product was nice
                        </td>
                      </tr>
                    </tbody>
                </table>
            </div>
          </div>
      </Container>
    </div>
  )
}

export default CustomersReview