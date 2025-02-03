"use client";
import React, { useCallback, useState, useMemo } from "react";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, UserPlus, Trash2, Edit } from "lucide-react";
import { formatToLocalDate } from "@/utils/couponDateUtils";
import { getStatusBadge } from "@/utils/backgroundUtils";
import { User } from "@/types/user";
import AddCustomerDialog from "@/components/Dashboard/Customer/AddCustomer";
import Pagination from "@/components/Pagination";
import { toast } from "react-hot-toast";
import { useUser } from "@/features/user/useUser";

const CustomerManagement = () => {
  // States
  const [isCustomerDialogOpen, setIsCustomerDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  // Get user data and mutations from custom hook
  const { users, isLoadingUsers, deleteUser, isUpdating, isDeleting } =
    useUser();

  // Handlers
  const handleAddCustomer = () => {
    setSelectedCustomer(null);
    setIsCustomerDialogOpen(true);
  };

  const handleEditCustomer = (user: User) => {
    setSelectedCustomer(user);
    setIsCustomerDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsCustomerDialogOpen(false);
    setSelectedCustomer(null);
  };

  const handleDeleteCustomer = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      try {
        await deleteUser(id);
        toast.success("Customer deleted successfully");
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        toast.error("Failed to delete customer");
      }
    }
  };

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const filteredCustomers = useMemo(() => {
    if (!users?.users?.users) return [];

    return users.users.users.filter((customer) => {
      const matchesSearch =
        customer.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (customer.phone && customer.phone.includes(searchTerm));

      if (!selectedStatus || selectedStatus === "all") return matchesSearch;

      return matchesSearch && customer.status === selectedStatus;
    });
  }, [users?.users?.users, searchTerm, selectedStatus]);

  // Loading state
  if (isLoadingUsers) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full space-y-6 p-6 min-h-screen">
      <Card className="Filters *:border-none shadow-sm">
        <CardHeader className="p-6">
          <div className="flex justify-between items-center">
            <CardTitle>Customer Management</CardTitle>
            <Button
              onClick={handleAddCustomer}
              disabled={isLoadingUsers || isDeleting}
              className="flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              Add New Customer
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name, email..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Status Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="locked">Locked</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="rounded-xl overflow-hidden bg-white">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold">Avatar</TableHead>
                  <TableHead className="font-semibold">Customer Name</TableHead>
                  <TableHead className="font-semibold">Email</TableHead>
                  <TableHead className="font-semibold">Phone Number</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">Joined Date</TableHead>
                  <TableHead className="text-right font-semibold">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer) => (
                  <TableRow key={customer._id} className="hover:bg-gray-50">
                    <TableCell>
                      <Image
                        src={customer.avatar?.url || "/profile.jpg"}
                        alt={customer.fullName}
                        width={70}
                        height={70}
                        className="object-cover rounded-full"
                      />
                    </TableCell>
                    <TableCell>{customer.fullName}</TableCell>
                    <TableCell>{customer.email}</TableCell>
                    <TableCell>{customer.phone}</TableCell>
                    <TableCell>{getStatusBadge(customer.status)}</TableCell>
                    <TableCell>
                      {formatToLocalDate(customer.createdAt)}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2 justify-end">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleEditCustomer(customer)}
                          disabled={isUpdating}
                          className="h-8 w-8 hover:bg-gray-100"
                        >
                          <Edit className="h-4 w-4 text-blue-600" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleDeleteCustomer(customer._id)}
                          disabled={isDeleting}
                          className="h-8 w-8 hover:bg-gray-100"
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {users && (
            <Pagination
              currentPage={currentPage}
              totalPages={users.users.pagination.pages}
              onPageChange={handlePageChange}
              totalItems={users.users.pagination.total}
            />
          )}
        </CardContent>
      </Card>

      <AddCustomerDialog
        isOpen={isCustomerDialogOpen}
        onClose={handleDialogClose}
        initialData={selectedCustomer || undefined}
      />
    </div>
  );
};

export default CustomerManagement;
