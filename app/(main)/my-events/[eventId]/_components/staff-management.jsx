"use client";

import { useState } from "react";
import { useConvexMutation, useConvexQuery } from "@/hooks/use-convex-query";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, UserPlus, Shield, Scan } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function StaffManagement({ eventId }) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("scanner");

  const { data: staffList, isLoading } = useConvexQuery(api.events.getEventStaff, {
    eventId,
  });

  const { mutate: addStaff, isLoading: isAdding } = useConvexMutation(
    api.events.addStaff
  );
  const { mutate: removeStaff, isLoading: isRemoving } = useConvexMutation(
    api.events.removeStaff
  );

  const handleAddStaff = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    try {
      await addStaff({ eventId, email, role });
      toast.success("Staff member added successfully!");
      setEmail("");
    } catch (error) {
      toast.error(error.message || "Failed to add staff");
    }
  };

  const handleRemoveStaff = async (staffId) => {
    try {
      await removeStaff({ staffId });
      toast.success("Staff member removed");
    } catch (error) {
      toast.error(error.message || "Failed to remove staff");
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-purple-500" />
            Add Staff Member
          </CardTitle>
          <CardDescription>
            Invite team members to help manage your event.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddStaff} className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[200px] space-y-2">
              <Label htmlFor="staffEmail">Email Address</Label>
              <Input
                id="staffEmail"
                type="email"
                placeholder="colleague@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="w-[150px] space-y-2">
              <Label>Role</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="scanner">Scanner</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" disabled={isAdding} className="gap-2">
              {isAdding ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
              Add Staff
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Current Staff</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
            </div>
          ) : !staffList || staffList.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No staff members added yet.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Added On</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {staffList.map((staff) => (
                  <TableRow key={staff._id}>
                    <TableCell className="font-medium">{staff.email}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="gap-1">
                        {staff.role === "admin" ? (
                          <Shield className="w-3 h-3 text-blue-500" />
                        ) : (
                          <Scan className="w-3 h-3 text-green-500" />
                        )}
                        {staff.role.charAt(0).toUpperCase() + staff.role.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(staff.addedAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleRemoveStaff(staff._id)}
                        disabled={isRemoving}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
