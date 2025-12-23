// src/pages/admin/AdminDashboard.tsx
import React, { useState } from "react";
import AdminTopBar from "./components/AdminTopBar";
import UsersTab from "./components/UsersTab";
import TransactionsTab from "./components/TransactionsTab";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AnalyticsTab from "./components/AnalyticsTab";
import { Helmet } from "react-helmet-async";
import OverviewTab from "./components/OverviewTab";

const AdminDashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState("overview");

    return (
        <>
            <Helmet>
                <title>{`Admin Panel | QuantProf`}</title>
                <meta
                    name="description"
                    content="QuantProf"
                />
            </Helmet>
            <div className="p-6 container mx-auto">
                <AdminTopBar />

                <Card className="mt-6">
                    <CardContent>
                        <Tabs className="mt-4" value={activeTab} onValueChange={setActiveTab}>
                            <TabsList className="mb-4">
                                <TabsTrigger value="overview">Overview</TabsTrigger>
                                <TabsTrigger value="users">Users</TabsTrigger>
                                <TabsTrigger value="transactions">Transactions</TabsTrigger>
                                {/* <TabsTrigger value="analytics">Analytics</TabsTrigger> */}
                            </TabsList>

                            <TabsContent value="overview">
                                <OverviewTab />
                            </TabsContent>

                            <TabsContent value="users">
                                <UsersTab />
                            </TabsContent>

                            <TabsContent value="transactions">
                                <TransactionsTab />
                            </TabsContent>

                            {/* <TabsContent value="analytics">
                                <AnalyticsTab />
                            </TabsContent> */}
                        </Tabs>
                    </CardContent>
                </Card>
            </div>
        </>
    );
};

export default AdminDashboard;
