import Container from "@/components/Container";
import useGetRequest from "../hooks/useGetRequest";
import { useAuth } from "@/context/authContext";
import { useMemo } from "react";
import { Subscription, FeedbackResponse } from "@/types";
import { formatToHumanReadableDate } from "@/utils/dateFunctions";
import Spinner from "@/components/Spinner";


const CustomersReview = () => {

  const { token, loading: authLoading } = useAuth();

    // Memoizing the header object to stop re-rendering
    const headers = useMemo(() => {
      if (token) {
        return {
          'Content-type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        };
      }
    }, [token]);
  
    const shouldFetch = useMemo(() => {
      return !!token && !authLoading;
    }, [token, authLoading]);

  const { data: newsletter, loading: newsletterLoading } = useGetRequest<[Subscription[], number]>("customer-mgt/all-subscribers", { headers }, shouldFetch);
  const { data: feedbacks, loading: feedbackLoading } = useGetRequest<[FeedbackResponse[], number]>("customer-mgt/all-feedbacks", { headers }, shouldFetch);
  console.log(feedbacks, feedbackLoading);

  return (
    <div className="w-full h-full">
        <Container className="pt-5">
          <div className="w-full flex flex-col gap-y-12">
            <div className="w-fit order-2">
              <h4 className="mb-6 font-bold text-base text-text-black">
                Newsletter Subscribers
              </h4>
              <table className="w-full text-center text-sm font-light">
                <thead className="font-medium border-b bg-black text-white">
                  <tr>
                    <th scope="col" className="px-6 py-4">S/N</th>
                    <th scope="col" className="px-6 py-4">Email Address</th>
                    <th scope="col" className="px-6 py-4">Subscribed at</th>
                  </tr>
                </thead>
                <tbody>
                  {!newsletterLoading && newsletter[0] && newsletter[0].length > 0 ? (
                    newsletter[0].map((n) => (
                      <tr
                        key={n.id}
                        className="border border-gray hover:bg-gray cursor-pointer capitalize items-center"
                      >
                        <td className="whitespace-nowrap px-6 py-4 font-medium text-sm">
                          {n?.id}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 font-medium text-sm">
                          {n?.email}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 font-medium text-sm">
                          {formatToHumanReadableDate(n?.SubscribedAt)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={3}
                        className="w-full min-h-[23rem] grid place-items-center"
                      >
                        <Spinner />
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="flex-1">
              <h4 className="mb-6">Customer Feedbacks</h4>
              <table className="min-w-full text-center text-sm font-light">
                <thead className="font-medium border-b bg-black text-white">
                  <tr>
                    <th scope="col" className="px-6 py-4">S/N</th>
                    <th scope="col" className="px-6 py-4">Email Address</th>
                    <th scope="col" className="px-6 py-4">Shopping Experience Rating</th>
                    <th scope="col" className="px-6 py-4">Additional Feedback</th>
                    <th scope="col" className="px-6 py-4">Feedback given at</th>
                  </tr>
                </thead>
                <tbody>
                  {!feedbackLoading && feedbacks[0] && feedbacks[0].length > 0 ?
                    feedbacks[0].map((f) => (
                      <tr
                        key={f.id}
                        className="border border-gray hover:bg-gray cursor-pointer capitalize items-center"
                      >
                        <td className="whitespace-nowrap px-6 py-4 font-medium text-sm">
                          {f?.id}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 font-medium text-sm">
                          {f?.email}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 font-medium text-sm">
                          {f?.shoppingExperience}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 font-medium text-sm">
                          {f?.additionalFeedback ? f?.additionalFeedback : ""}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 font-medium text-sm">
                          {formatToHumanReadableDate(f?.feedbackGivenAT)}
                        </td>
                      </tr>
                    ))
                      :
                      (
                        <tr>
                          <td
                            colSpan={3}
                            className="w-full min-h-[23rem] grid place-items-center"
                          >
                            <Spinner />
                          </td>
                        </tr>
                      )
                    }
                </tbody>
              </table>
            </div>
          </div>

      </Container>
    </div>
  )
}

export default CustomersReview