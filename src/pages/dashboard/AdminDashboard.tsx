// import Container from "@/components/Container";
// import { IndianRupee } from "lucide-react";
// import { useAuth } from "@/context/authContext";
// import useGetRequest from "../hooks/useGetRequest";
// import { useMemo, useState } from "react";
// import Spinner from "@/components/Spinner";
// import BarCharts from "@/components/BarCharts";
// import Select from "@/components/Select";

// type RevenueType = {
//   date: string;
//   totalRevenue: string;
// };

// const AdminDashboard = () => {
//   const { token, loading: authLoading } = useAuth();
//   const [filter, setFilter] = useState<'month' | 'year'>('month');

//   // Memoizing the header object to stop re-rendering
//   const headers = useMemo(() => {
//     if (token) {
//       return {
//         'Content-type': 'application/json',
//         'Accept': 'application/json',
//         'Authorization': `Bearer ${token}`,
//       };
//     }
//   }, [token]);

//   const shouldFetch = useMemo(() => {
//     return !!token && !authLoading;
//   }, [token, authLoading]);

//   const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
//     const value = e.target.value as "month" | "year";
//     if (value === "month" || value === "year") {
//       setFilter(value);
//     }
//   };

//   // Multiple API calls for the counts
//   const { data: revenue, loading: revenueLoading } = useGetRequest<number>("order-mgt/revenue", { headers }, shouldFetch);
//   const { data: customerCount, loading: customerLoading } = useGetRequest<number>("customer-mgt/customer-count", { headers }, shouldFetch);
//   const { data: staffs, loading: staffsLoading } = useGetRequest<number>("admins-mgt/staff-count", { headers }, shouldFetch);
//   const { data: productCount, loading: productLoading } = useGetRequest<number>("product-mgt/product-count", { headers }, shouldFetch);
//   const { data: categoryCount, loading: categoryLoading } = useGetRequest<number>("product-mgt/category-count", { headers }, shouldFetch);
//   const { data: stockCount, loading: stockLoading } = useGetRequest<number>("product-mgt/category-count", { headers }, shouldFetch);
//   const { data: totalRevenue, loading: totalRevenueLoading } = useGetRequest<RevenueType[]>("analytics/total-revenue-overtime", { headers }, shouldFetch);

//   return (
//     <div className="mt-4">
//       {/* Total graphs */}
//       <div className="flex justify-between gap-y-10 flex-wrap">
//         <Container className="p-4 w-[32%]">
//           <div className="w-full">
//             <h5 className="text-text-black text-size-500 font-normal mb-1">Total revenue</h5>
//             {revenue ? (
//               <div className="flex gap-x-3">
//                 <IndianRupee size={20} />
//                 <p className="text-text-black text-size-500 font-semibold">{revenue}</p>
//               </div>
//             ) : (
//               <div className="flex gap-x-3">
//                 <IndianRupee size={20} />
//                 <p className="text-text-black text-size-500 font-semibold">0</p>
//               </div>
//             )}
//             {/* {revenueLoading && (
//               <div className="w-full h-[4rem] grid place-items-center">
//                 <Spinner />
//               </div>
//             )} */}
//           </div>
//         </Container>
//         <Container className="p-4 w-[32%]">
//           <div className="w-full">
//             {customerCount && 
//               <>
//                 <h5 className="text-text-black text-size-500 font-normal mb-1">Total customer count</h5>
//                 <div className="flex gap-x-3">
//                   <p className="text-text-black text-size-500 font-semibold">{customerCount}</p>
//                 </div>
//               </>
//             }
//             {/* {
//               customerLoading && <div className="w-full max-h-24"><Spinner/></div>
//             } */}
            
//           </div>
//         </Container>
//         <Container className="p-4 w-[32%]">
//           <div className="w-full">
//             <h5 className="text-text-black text-size-500 font-normal mb-1">Staff number</h5>
//             {staffs ? (
//               <div className="flex gap-x-3">
//                 <p className="text-text-black text-size-500 font-semibold">{staffs}</p>
//               </div>
//             ) : (
//               <p className="text-text-black text-size-500 font-semibold">0</p>
//             )}
//             {/* {staffsLoading && (
//               <div className="w-full h-[4rem] grid place-items-center">
//                 <Spinner />
//               </div>
//             )} */}
//           </div>
//         </Container>
//         <Container className="p-4 w-[32%]">
//           <div className="w-full">
//             <h5 className="text-text-black text-size-500 font-normal mb-1">Total product count</h5>
//             {productCount && (
//               <div className="flex gap-x-3">
//                 <p className="text-text-black text-size-500 font-semibold">{productCount}</p>
//               </div>
//             )}
//             {productLoading && (
//               <div className="w-full h-[4rem] grid place-items-center">
//                 <Spinner />
//               </div>
//             )}
//           </div>
//         </Container>
//         <Container className="p-4 w-[32%]">
//           <div className="w-full">
//             <h5 className="text-text-black text-size-500 font-normal mb-1">Category count</h5>
//             {categoryCount && (
//               <div className="flex gap-x-3">
//                 <p className="text-text-black text-size-500 font-semibold">{categoryCount}</p>
//               </div>
//             )}
//             {categoryLoading && (
//               <div className="w-full h-[4rem] grid place-items-center">
//                 <Spinner />
//               </div>
//             )}
//           </div>
//         </Container>
//         <Container className="p-4 w-[32%]">
//           <div className="w-full">
//             <h5 className="text-text-black text-size-500 font-normal mb-1">Product stock count</h5>
//             {stockCount && (
//               <div className="flex gap-x-3">
//                 <p className="text-text-black text-size-500 font-semibold">{stockCount}</p>
//               </div>
//             )}
//           </div>
//           {stockLoading && (
//             <div className="w-full h-[4rem] border-2">
//               <Spinner />
//             </div>
//           )}
//         </Container>
//       </div>
//       {/* Revenue generated dashboard */}
//       <div className="w-full mt-5">
//         <Container className="w-full p-4">
//           <div className="w-full flex justify-between">
//             <h4 className="text-text-black text-size font-semibold">Revenue</h4>
//             <div className="w-[8rem] h-[4rem] rounded-md">
//               <Select
//                 id="filter_revenue"
//                 name="filter"
//                 className="font-normal text-sm w-full py-3 border rounded-md"
//                 select={[{ key: "month", value: "Month" }, { key: "year", value: "Year" }]}
//                 defaultText="Select the grph filter"
//                 handleInputChange={handleInputChange}
//               />
//             </div>
//           </div>
//           <div className="w-full mt-5 border-2">
//             <BarCharts data={totalRevenue} filter={filter} />
//           </div>
//         </Container>
//       </div>
//       {/* Last analytics */}
//       <div className="mt-5 w-full flex justify-between">
//         <Container className="w-[35%]">
//           <div className="w-full flex justify-between">
//             <h4 className="text-text-black text-size font-semibold">Product status</h4>
//           </div>
//           <div className="w-full mt-5 h-40 border-2"></div>
//         </Container>
//         <Container className="w-[63%]">
//           <div className="w-full flex justify-between">
//             <h4 className="text-text-black text-size font-semibold">Customers</h4>
//           </div>
//           <div className="w-full mt-5 h-40 border-2"></div>
//         </Container>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;


import Container from "@/components/Container";
import { IndianRupee } from "lucide-react";
import { useAuth } from "@/context/authContext";
import useGetRequest from "../hooks/useGetRequest";
import { useMemo, useState } from "react";
import Spinner from "@/components/Spinner";
import BarCharts from "@/components/BarCharts";
import Select from "@/components/Select";

type RevenueType = {
  date: string;
  totalRevenue: string;
};

const AdminDashboard = () => {
  const { token, loading: authLoading } = useAuth();
  const [filter, setFilter] = useState<'month' | 'year'>('month');

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

  const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.value as "month" | "year";
    if (value === "month" || value === "year") {
      setFilter(value);
    }
  };

  // Multiple API calls for the counts
  const { data: revenue, loading: revenueLoading } = useGetRequest<number>("order-mgt/revenue", { headers }, shouldFetch);
  const { data: customerCount, loading: customerLoading } = useGetRequest<number>("customer-mgt/customer-count", { headers }, shouldFetch);
  const { data: staffs, loading: staffsLoading } = useGetRequest<number>("admins-mgt/staff-count", { headers }, shouldFetch);
  const { data: productCount, loading: productLoading } = useGetRequest<number>("product-mgt/product-count", { headers }, shouldFetch);
  const { data: categoryCount, loading: categoryLoading } = useGetRequest<number>("product-mgt/category-count", { headers }, shouldFetch);
  const { data: stockCount, loading: stockLoading } = useGetRequest<number>("product-mgt/category-count", { headers }, shouldFetch);
  const { data: totalRevenue, loading: totalRevenueLoading } = useGetRequest<RevenueType[]>("analytics/total-revenue-overtime", { headers }, shouldFetch);

  return (
    <div className="mt-4">
      {/* Total graphs */}
      <div className="flex justify-between gap-y-10 flex-wrap">
        <Container className="p-4 w-[32%]">
          <div className="w-full">
            <h5 className="text-text-black text-size-500 font-normal mb-1">Total product count</h5>
            {productCount ? (
              <div className="flex gap-x-3">
                <p className="text-text-black text-size-500 font-semibold">{productCount}</p>
              </div>
            ) : (
              <p className="text-text-black text-size-500 font-semibold">0</p>
            )}
            {productLoading && (
              <div className="w-full h-[4rem] flex justify-center items-center">
                <Spinner />
              </div>
            )}
          </div>
        </Container>

        {/* Repeat similar structure for other containers */}
        <Container className="p-4 w-[32%]">
          <div className="w-full">
            <h5 className="text-text-black text-size-500 font-normal mb-1">Total revenue</h5>
            {revenue ? (
              <div className="flex gap-x-3">
                <IndianRupee size={20} />
                <p className="text-text-black text-size-500 font-semibold">{revenue}</p>
              </div>
            ) : (
              <div className="flex gap-x-3">
                <IndianRupee size={20} />
                <p className="text-text-black text-size-500 font-semibold">0</p>
              </div>
            )}
            {revenueLoading && (
              <div className="w-full h-[4rem] flex justify-center items-center">
                <Spinner />
              </div>
            )}
          </div>
        </Container>

        <Container className="p-4 w-[32%]">
          <div className="w-full">
            <h5 className="text-text-black text-size-500 font-normal mb-1">Total customer count</h5>
            {customerCount ? (
              <div className="flex gap-x-3">
                <p className="text-text-black text-size-500 font-semibold">{customerCount}</p>
              </div>
            ) : (
              <p className="text-text-black text-size-500 font-semibold">0</p>
            )}
            {customerLoading && (
              <div className="w-full h-[4rem] flex justify-center items-center">
                <Spinner />
              </div>
            )}
          </div>
        </Container>

        <Container className="p-4 w-[32%]">
          <div className="w-full">
            <h5 className="text-text-black text-size-500 font-normal mb-1">Staff number</h5>
            {staffs ? (
              <div className="flex gap-x-3">
                <p className="text-text-black text-size-500 font-semibold">{staffs}</p>
              </div>
            ) : (
              <p className="text-text-black text-size-500 font-semibold">0</p>
            )}
            {staffsLoading && (
              <div className="w-full h-[4rem] flex justify-center items-center">
                <Spinner />
              </div>
            )}
          </div>
        </Container>

        <Container className="p-4 w-[32%]">
          <div className="w-full">
            <h5 className="text-text-black text-size-500 font-normal mb-1">Category count</h5>
            {categoryCount ? (
              <div className="flex gap-x-3">
                <p className="text-text-black text-size-500 font-semibold">{categoryCount}</p>
              </div>
            ) : (
              <p className="text-text-black text-size-500 font-semibold">0</p>
            )}
            {categoryLoading && (
              <div className="w-full h-[4rem] flex justify-center items-center">
                <Spinner />
              </div>
            )}
          </div>
        </Container>

        <Container className="p-4 w-[32%]">
          <div className="w-full">
            <h5 className="text-text-black text-size-500 font-normal mb-1">Product stock count</h5>
            {stockCount ? (
              <div className="flex gap-x-3">
                <p className="text-text-black text-size-500 font-semibold">{stockCount}</p>
              </div>
            ) : (
              <p className="text-text-black text-size-500 font-semibold">0</p>
            )}
            {stockLoading && (
              <div className="w-full h-[4rem] flex justify-center items-center">
                <Spinner />
              </div>
            )}
          </div>
        </Container>
      </div>
      {/* Revenue generated dashboard */}
      <div className="w-full mt-5">
        <Container className="w-full p-4">
          <div className="w-full flex justify-between">
            <h4 className="text-text-black text-size font-semibold">Revenue</h4>
            <div className="w-[8rem] h-[4rem] rounded-md">
              <Select
                id="filter_revenue"
                name="filter"
                className="font-normal text-sm w-full py-3 border rounded-md"
                select={[{ key: "month", value: "Month" }, { key: "year", value: "Year" }]}
                defaultText="month"
                handleInputChange={handleInputChange}
              />
            </div>
          </div>
          <hr className="my-2 border border-[#c0c0c0]" />
          <div className="w-full mt-5">
            {totalRevenueLoading ?<div className="w-full h-[340px] flex justify-center items-center">
                <Spinner />
              </div> : 
              <BarCharts data={totalRevenue} filter={filter} />
            }
          </div>
        </Container>
      </div>
      {/* Last analytics */}
      <div className="mt-5 w-full flex justify-between">
        <Container className="w-[35%]">
          <div className="w-full flex justify-between">
            <h4 className="text-text-black text-size font-semibold">User retention rate</h4>
          </div>
          <div className="w-full mt-5 h-40"></div>
        </Container>
        <Container className="w-[63%]">
          <div className="w-full flex justify-between">
            <h4 className="text-text-black text-size font-semibold">Average order value</h4>
          </div>
          <div className="w-full mt-5 h-40"></div>
        </Container>
      </div>
    </div>
  );
};

export default AdminDashboard;
