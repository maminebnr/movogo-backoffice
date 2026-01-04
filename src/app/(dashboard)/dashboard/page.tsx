"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useQuery } from "@apollo/client/react";
import { 
  GET_TODAY_DELIVERIES, 
  GET_ACTIVE_DELIVERIES, 
  GET_APP_GAIN_AND_FUNDS,
  GET_ALL_CARRIERS,
  GET_ALL_SENDERS,
  GET_ALL_ACCOUNTS
} from "@/lib/graphql/queries";
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";
import { Package, Truck, Users, DollarSign, TrendingUp, Activity } from "lucide-react";

const COLORS = ['#f97316', '#3b82f6', '#10b981', '#ef4444', '#8b5cf6', '#f59e0b'];

export default function DashboardPage() {
  const { data: todayData, loading: todayLoading } = useQuery(GET_TODAY_DELIVERIES);
  const { data: activeData, loading: activeLoading } = useQuery(GET_ACTIVE_DELIVERIES);
  const { data: gainData, loading: gainLoading } = useQuery(GET_APP_GAIN_AND_FUNDS);
  const { data: carriersData, loading: carriersLoading } = useQuery(GET_ALL_CARRIERS);
  const { data: sendersData, loading: sendersLoading } = useQuery(GET_ALL_SENDERS);
  const { data: accountsData, loading: accountsLoading } = useQuery(GET_ALL_ACCOUNTS);

  // Calculate KPIs
  const todayCount = (todayData && typeof todayData === 'object' && 'todaysDeliveries' in todayData && Array.isArray((todayData as any).todaysDeliveries)) ? (todayData as any).todaysDeliveries.length : 0;
  const activeCount = (activeData && typeof activeData === 'object' && 'availableDeliveries' in activeData && Array.isArray((activeData as any).availableDeliveries)) ? (activeData as any).availableDeliveries.length : 0;
  const carriersCount = (carriersData && typeof carriersData === 'object' && 'getAllCarriers' in carriersData && Array.isArray((carriersData as any).getAllCarriers)) ? (carriersData as any).getAllCarriers.length : 0;
  const sendersCount = (sendersData && typeof sendersData === 'object' && 'getAllSenders' in sendersData && Array.isArray((sendersData as any).getAllSenders)) ? (sendersData as any).getAllSenders.length : 0;
  const accountsCount = (accountsData && typeof accountsData === 'object' && 'getAllAccounts' in accountsData && Array.isArray((accountsData as any).getAllAccounts)) ? (accountsData as any).getAllAccounts.length : 0;
  
  // Calculate app gain and total funds
  const gainHistory = (gainData && typeof gainData === 'object' && 'getAppGainHistory' in gainData && Array.isArray((gainData as any).getAppGainHistory)) ? (gainData as any).getAppGainHistory : [];
  const appGain = gainHistory.reduce((sum: number, item: any) => sum + (item.appGain || 0), 0);
  const totalFunds = gainHistory.reduce((sum: number, item: any) => sum + (item.totalPrice || 0), 0);

  // Prepare chart data
  // App Gain History Chart
  const gainChartData = gainHistory
    .map((item: any, index: number) => {
      let dateValue: Date | null = null;
      let dateString = 'N/A';
      
      // Try to parse the date in various formats
      if (item.date) {
        dateValue = new Date(item.date);
        // If date is invalid, try parsing as timestamp or other formats
        if (isNaN(dateValue.getTime())) {
          // Try as timestamp
          const timestamp = typeof item.date === 'number' ? item.date : parseInt(item.date);
          if (!isNaN(timestamp)) {
            dateValue = new Date(timestamp);
          }
        }
        
        // If still invalid, use index as fallback
        if (isNaN(dateValue.getTime())) {
          dateValue = new Date();
          dateValue.setDate(dateValue.getDate() - (gainHistory.length - index));
        }
        
        dateString = dateValue.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      } else {
        // No date provided, use index-based date
        dateValue = new Date();
        dateValue.setDate(dateValue.getDate() - (gainHistory.length - index));
        dateString = dateValue.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      }
      
      return {
        date: dateString,
        dateValue: dateValue.getTime(),
        appGain: Number(item.appGain) || 0,
        totalPrice: Number(item.totalPrice) || 0,
      };
    })
    .sort((a: any, b: any) => a.dateValue - b.dateValue) // Sort by date
    .slice(-10) // Last 10 entries
    .map(({ dateValue, ...rest }: any) => rest); // Remove dateValue, keep only display date

  // Delivery Status Distribution
  const statusCounts: Record<string, number> = {};
  if (todayData && typeof todayData === 'object' && 'todaysDeliveries' in todayData && Array.isArray((todayData as any).todaysDeliveries)) {
    (todayData as any).todaysDeliveries.forEach((delivery: any) => {
      const status = delivery.status || 'UNKNOWN';
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });
  }
  if (activeData && typeof activeData === 'object' && 'availableDeliveries' in activeData && Array.isArray((activeData as any).availableDeliveries)) {
    (activeData as any).availableDeliveries.forEach((delivery: any) => {
      const status = delivery.status || 'UNKNOWN';
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });
  }
  
  const statusChartData = Object.entries(statusCounts).map(([name, value]) => ({
    name,
    value,
  }));

  // Daily Deliveries (group by date)
  const dailyDeliveries: Record<string, number> = {};
  if (todayData && typeof todayData === 'object' && 'todaysDeliveries' in todayData && Array.isArray((todayData as any).todaysDeliveries)) {
    (todayData as any).todaysDeliveries.forEach((delivery: any) => {
      if (delivery.createdAt) {
        try {
          const dateObj = new Date(delivery.createdAt);
          if (!isNaN(dateObj.getTime())) {
            const date = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            dailyDeliveries[date] = (dailyDeliveries[date] || 0) + 1;
          }
        } catch (e) {
          // Skip invalid dates
        }
      }
    });
  }
  
  const dailyChartData = Object.entries(dailyDeliveries)
    .map(([date, count]) => {
      // Try to parse the date for sorting
      const dateObj = new Date(date);
      return {
        date,
        deliveries: count,
        dateValue: isNaN(dateObj.getTime()) ? 0 : dateObj.getTime()
      };
    })
    .filter(item => item.dateValue > 0) // Remove invalid dates
    .sort((a, b) => a.dateValue - b.dateValue)
    .slice(-7) // Last 7 days
    .map(({ dateValue, ...rest }) => rest); // Remove dateValue

  // Active Carriers
  const activeCarriers = (carriersData && typeof carriersData === 'object' && 'getAllCarriers' in carriersData && Array.isArray((carriersData as any).getAllCarriers)) 
    ? (carriersData as any).getAllCarriers.filter((c: any) => c.status === 'ACTIVE').length 
    : 0;

  const isLoading = todayLoading || activeLoading || gainLoading || carriersLoading || sendersLoading || accountsLoading;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-2 bg-white border rounded-md shadow-md text-sm">
          <p className="font-semibold">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={`item-${index}`} style={{ color: entry.color }}>
              {entry.name}: {typeof entry.value === 'number' ? entry.value.toFixed(2) : entry.value} TND
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-zinc-600 mt-1">Overview of your delivery business</p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today Deliveries</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayLoading ? "..." : todayCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Deliveries scheduled for today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Deliveries</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeLoading ? "..." : activeCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Currently in progress
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total App Gain</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {gainLoading ? "..." : `${appGain.toFixed(2)} TND`}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Total revenue generated
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Funds</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {gainLoading ? "..." : `${totalFunds.toFixed(2)} TND`}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Total transaction value
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Additional KPI Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Carriers</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{carriersLoading ? "..." : carriersCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {activeCarriers} active carriers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Senders</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sendersLoading ? "..." : sendersCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Registered senders
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Accounts</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{accountsLoading ? "..." : accountsCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              System accounts
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* App Gain & Funds Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
            <CardDescription>App gain and total funds over time</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-[300px] flex items-center justify-center text-zinc-500">
                Loading...
              </div>
            ) : gainChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={gainChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis tickFormatter={(value) => `${value} TND`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="appGain" 
                    stackId="1" 
                    stroke="#f97316" 
                    fill="#f97316" 
                    fillOpacity={0.6}
                    name="App Gain"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="totalPrice" 
                    stackId="2" 
                    stroke="#3b82f6" 
                    fill="#3b82f6" 
                    fillOpacity={0.6}
                    name="Total Price"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-zinc-500">
                {gainHistory.length === 0 ? "No revenue data available" : "No valid date data found"}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Delivery Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Delivery Status</CardTitle>
            <CardDescription>Distribution of delivery statuses</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-[300px] flex items-center justify-center text-zinc-500">
                Loading...
              </div>
            ) : statusChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-zinc-500">
                No data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Daily Deliveries */}
        <Card>
          <CardHeader>
            <CardTitle>Daily Deliveries</CardTitle>
            <CardDescription>Number of deliveries per day (last 7 days)</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-[300px] flex items-center justify-center text-zinc-500">
                Loading...
              </div>
            ) : dailyChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dailyChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="deliveries" fill="#f97316" name="Deliveries" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-zinc-500">
                {todayData && typeof todayData === 'object' && 'todaysDeliveries' in todayData && Array.isArray((todayData as any).todaysDeliveries) && (todayData as any).todaysDeliveries.length === 0 
                  ? "No deliveries found" 
                  : "No delivery date data available"}
              </div>
            )}
          </CardContent>
        </Card>

        {/* App Gain Line Chart */}
        <Card>
          <CardHeader>
            <CardTitle>App Gain Trend</CardTitle>
            <CardDescription>App gain over time</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-[300px] flex items-center justify-center text-zinc-500">
                Loading...
              </div>
            ) : gainChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={gainChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis tickFormatter={(value) => `${value} TND`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="appGain" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    name="App Gain"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-zinc-500">
                {gainHistory.length === 0 ? "No revenue data available" : "No valid date data found"}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
