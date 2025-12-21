// src/pages/admin/AdminDashboard.tsx
import React, { useState } from "react";
import AdminTopBar from "./components/AdminTopBar";
import UsersTab from "./components/UsersTab";
import TransactionsTab from "./components/TransactionsTab";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AnalyticsTab from "./components/AnalyticsTab";

const AdminDashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState("users");

    return (
        <div className="p-6 container mx-auto">
            <AdminTopBar />

            <Card className="mt-6">
                <CardContent>
                    <Tabs className="mt-4" value={activeTab} onValueChange={setActiveTab}>
                        <TabsList className="mb-4">
                            <TabsTrigger value="users">Users</TabsTrigger>
                            <TabsTrigger value="transactions">Transactions</TabsTrigger>
                            {/* <TabsTrigger value="analytics">Analytics</TabsTrigger> */}
                        </TabsList>

                        <TabsContent value="users">
                            <UsersTab />
                        </TabsContent>

                        <TabsContent value="transactions">
                            <TransactionsTab />
                        </TabsContent>

                        <TabsContent value="analytics">
                            <AnalyticsTab />
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminDashboard;
