import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { motion } from "framer-motion";
import { 
  BarChart3, 
  DollarSign, 
  FileText, 
  Plus, 
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { useNavigate } from "react-router";

export default function Dashboard() {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const analytics = useQuery(api.analytics.getDashboardData);
  const invoices = useQuery(api.invoices.list);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    navigate("/auth");
    return null;
  }

  const recentInvoices = invoices?.slice(0, 5) || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100"
    >
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user.name || user.email}</p>
            </div>
            <div className="flex gap-3">
              <Button onClick={() => navigate("/proforma/new")} size="lg" variant="outline">
                <Plus className="h-5 w-5 mr-2" />
                Proforma Invoice
              </Button>
              <Button onClick={() => navigate("/invoice/new")} size="lg">
                <Plus className="h-5 w-5 mr-2" />
                New Invoice
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${analytics?.summary.totalRevenue.toFixed(2) || "0.00"}
                </div>
                <p className="text-xs text-muted-foreground">
                  From {analytics?.summary.totalInvoices || 0} invoices
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Paid Invoices</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${analytics?.summary.paidRevenue.toFixed(2) || "0.00"}
                </div>
                <p className="text-xs text-muted-foreground">
                  {analytics?.summary.paidInvoices || 0} invoices paid
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
                <Clock className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${analytics?.summary.pendingRevenue.toFixed(2) || "0.00"}
                </div>
                <p className="text-xs text-muted-foreground">
                  {analytics?.summary.pendingInvoices || 0} invoices pending
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Overdue</CardTitle>
                <AlertCircle className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${analytics?.summary.overdueRevenue.toFixed(2) || "0.00"}
                </div>
                <p className="text-xs text-muted-foreground">
                  {analytics?.summary.overdueInvoices || 0} invoices overdue
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Invoices */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Recent Invoices</CardTitle>
                  <CardDescription>Your latest invoice activity</CardDescription>
                </div>
                <Button variant="outline" onClick={() => navigate("/invoices")}>
                  View All
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentInvoices.length > 0 ? (
                    recentInvoices.map((invoice) => (
                      <div
                        key={invoice._id}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                        onClick={() => navigate(`/invoice/${invoice._id}`)}
                      >
                        <div>
                          <p className="font-medium">{invoice.invoiceNumber}</p>
                          <p className="text-sm text-muted-foreground">{invoice.clientName}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${invoice.total.toFixed(2)}</p>
                          <span
                            className={`inline-block px-2 py-1 rounded-full text-xs ${
                              invoice.status === "paid"
                                ? "bg-green-100 text-green-800"
                                : invoice.status === "sent"
                                ? "bg-blue-100 text-blue-800"
                                : invoice.status === "overdue"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {invoice.status}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No invoices yet</p>
                      <Button
                        variant="outline"
                        className="mt-4"
                        onClick={() => navigate("/invoice/new")}
                      >
                        Create your first invoice
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Invoice Status Overview
                </CardTitle>
                <CardDescription>Breakdown of your invoices by status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics?.invoicesByStatus && (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Draft</span>
                        <span className="font-medium">{analytics.invoicesByStatus.draft}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Sent</span>
                        <span className="font-medium">{analytics.invoicesByStatus.sent}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Paid</span>
                        <span className="font-medium text-green-600">{analytics.invoicesByStatus.paid}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Overdue</span>
                        <span className="font-medium text-red-600">{analytics.invoicesByStatus.overdue}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Cancelled</span>
                        <span className="font-medium text-gray-600">{analytics.invoicesByStatus.cancelled}</span>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-8"
        >
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks to help you get started</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center"
                  onClick={() => navigate("/invoice/new")}
                >
                  <Plus className="h-6 w-6 mb-2" />
                  Create Invoice
                </Button>
                <Button
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center"
                  onClick={() => navigate("/invoices")}
                >
                  <FileText className="h-6 w-6 mb-2" />
                  View All Invoices
                </Button>
                <Button
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center"
                  onClick={() => navigate("/analytics")}
                >
                  <TrendingUp className="h-6 w-6 mb-2" />
                  View Analytics
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}