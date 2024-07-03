import Container from "@/components/Container";
import { IndianRupee } from "lucide-react";
import { useAuth } from "@/context/authContext";
import useGetRequest from "../hooks/useGetRequest";
import { useMemo, useState } from "react";
import Spinner from "@/components/Spinner";
// import BarCharts from "@/components/LineCharts";
import Select from "@/components/Select";
import LineCharts from "@/components/LineCharts";
import BarCharts from "@/components/Barcharts";

type RevenueType = {
  date: string;
  totalRevenue: string;
};

type RetentionType = {
  date: string,
  retentionRate: number;
}

type AverageOrderType = {
  date:string;
  averageOrderValue: string;
}

const AdminDashboard = () => {
  const { token, loading: authLoading } = useAuth();
  const [filter, setFilter] = useState<Record<string, 'month' | 'year'>>({
    revenue: "month",
    retention: "month",
  });

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
  const value = e.target.value as 'month' | 'year';
  const name = e.target.name;
  if (value === 'month' || value === 'year') {
    setFilter(prevFilter => ({
      ...prevFilter,
      [name]: value,
    }));
  }
};

  
  

  // Multiple API calls for the counts
  const { data: revenue, loading: revenueLoading } = useGetRequest<number>("order-mgt/revenue", { headers }, shouldFetch);
  const { data: customerCount, loading: customerLoading } = useGetRequest<number>("customer-mgt/customer-count", { headers }, shouldFetch);
  const { data: staffs, loading: staffsLoading } = useGetRequest<number>("admins-mgt/staff-count", { headers }, shouldFetch);
  const { data: productCount, loading: productLoading } = useGetRequest<number>("product-mgt/product-count", { headers }, shouldFetch);
  const { data: categoryCount, loading: categoryLoading } = useGetRequest<number>("product-mgt/category-count", { headers }, shouldFetch);
  const { data: stockCount, loading: stockLoading } = useGetRequest<number>("product-mgt/category-count", { headers }, shouldFetch);
  const { data: totalRevenue, loading: totalRevenueLoading, error: totalRevenueError } = useGetRequest<RevenueType[]>("analytics/total-revenue-overtime", { headers }, shouldFetch);
  const { data: userRetention, loading: retentionLoading, error: retentionError } = useGetRequest<RetentionType[]>("analytics/user-retention-rate", { headers }, shouldFetch);
  const { data: averageOrder, loading: averageOrderLoading, error: averageOrderError } = useGetRequest<AverageOrderType[]>("analytics/average-order-value", { headers }, shouldFetch);


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
                name="revenue"
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
              !totalRevenueError && <LineCharts data={totalRevenue} filter={filter.revenue} />
            }
            {
              totalRevenueError && totalRevenueError.includes("Forbidden") 
                && 
                <div className = "w-full h-[340px] grid place-items-center">
                  <p className="text-text-black text-size-600 font-semibold">
                    You have no access to view this
                  </p>
                </div>
            }
          </div>
        </Container>
      </div>
      {/* Last analytics */}
      <div className="mt-5 w-full flex justify-between">
        <Container className="w-[35%]">
          <div className="w-full flex justify-between items-center">
            <h4 className="text-text-black text-size font-semibold capitalize">User retention rate</h4>
            <div className="w-[8rem] rounded-md">
              <Select
                id="user_retention"
                name="retention"
                className="font-normal text-sm w-full py-3 border rounded-md"
                select={[{ key: "month", value: "Month" }, { key: "year", value: "Year" }]}
                defaultText="Select filter"
                handleInputChange={handleInputChange}
              />
            </div>
          </div>
          <hr className="my-4 border border-[#c0c0c0]" />
          <div className="w-full mt-5 h-full">
            {retentionLoading ? <div className="w-full h-[340px] flex justify-center items-center">
              <Spinner />
            </div> 
              :
              !retentionError && <BarCharts filter={filter.retention} data = {userRetention} dateKey="date" valueKey= "retentionRate"/>}
            {
              retentionError && retentionError.includes("Forbidden") 
                && 
                <div className = "w-full h-[340px] grid place-items-center">
                  <p className="text-text-black text-size-600 font-semibold">
                    You have no access to view this
                  </p>
                </div>
            }
          </div>
        </Container>
        <Container className="w-[63%]">
          <div className="w-full flex justify-between">
            <h4 className="text-text-black text-size font-semibold capitalize">Average order value</h4>
            <div className="w-[8rem] rounded-md">
              <Select
                id="average_order"
                name="order"
                className="font-normal text-sm w-full py-3 border rounded-md"
                select={[{ key: "month", value: "Month" }, { key: "year", value: "Year" }]}
                defaultText="Select order filter"
                handleInputChange={handleInputChange}
              />
            </div>
          </div>
          <hr className="my-4 border border-[#c0c0c0]" />
          <div className="w-full mt-5 h-full">
            {(averageOrderLoading) ? <div className="w-full h-[340px] flex justify-center items-center">
              <Spinner />
            </div>
              :
            !averageOrderError && <BarCharts filter={filter.averageOrder} data = {averageOrder} dateKey="date" valueKey= "averageOrderValue"/>}
            {
              averageOrderError && averageOrderError.includes("Forbidden") 
                && 
                <div className = "w-full h-[340px] grid place-items-center">
                  <p className="text-text-black text-size-600 font-semibold">
                    You have no access to view this
                  </p>
                </div>
            }
          </div>
        </Container>
      </div>
    </div>
  );
};

export default AdminDashboard;
