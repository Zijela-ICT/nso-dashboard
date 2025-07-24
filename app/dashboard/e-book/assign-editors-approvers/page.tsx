"use client";
import React, { useMemo, useState } from "react";
import useEBooks, { IChprbnBook } from "../hooks/useEBooks";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { assignApprover, assignEditor } from "@/utils/book.services";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  Badge,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Icon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui";
import { Loader2 } from "lucide-react";
import { showToast } from "@/utils/toast";
import { useFetchSystemUsers } from "@/hooks/api/queries/users";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MultiSelect } from "../components/MultiSelect";

function ApprovalPage() {
  enum tabs {
    APPROVERS = "Approvers",
    EDITORS = "Editors",
  }
  const { data: ebooks, refetch, isLoading } = useEBooks();
  const { data: systemUsers } = useFetchSystemUsers();
  const [currentBookID, setCurrentBookID] = useState<number | null>(null);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [selection, setSelection] = useState<string[]>([]);
  const [currentTab, setCurrentTab] = useState<tabs>(tabs.EDITORS);

  const currentBook: IChprbnBook | undefined = useMemo(() => {
    return ebooks?.find((b) => b.id === currentBookID) || undefined;
  }, [currentBookID, ebooks]);

  const bookApprovers = useMemo(() => {
    const approvers = currentBook?.approvers || [];
    return approvers?.map((v) => {
      return systemUsers.data.data.find((u) => u.id === v.id);
    });
  }, [currentBook, currentBookID, systemUsers?.data?.data]);

  const bookEditors = useMemo(() => {
    const editors = currentBook?.editors || [];
    return editors?.map((v) => {
      return systemUsers.data.data.find((u) => u.id === v.id);
    });
  }, [currentBook, currentBookID, systemUsers?.data?.data]);

  const nonApprovers = useMemo(() => {
    const approverIDs = currentBook?.approvers?.map((u) => u.id) || [];
    return (
      systemUsers?.data?.data?.filter((u) => !approverIDs.includes(u.id)) || []
    );
  }, [systemUsers, currentBook]);

  const nonEditors = useMemo(() => {
    const editorIDs = currentBook?.editors?.map((u) => u.id) || [];
    return (
      systemUsers?.data?.data?.filter((u) => !editorIDs.includes(u.id)) || []
    );
  }, [systemUsers, currentBook]);

  const listToUse = useMemo(() => {
    return currentTab === tabs.APPROVERS ? bookApprovers : bookEditors;
  }, [currentTab, bookApprovers, bookEditors]);

  const assignUsers = async () => {
    setLoading(true);
    try {
      if (currentTab === tabs.APPROVERS) {
        await assignApprover(
          currentBook.id,
          { approverIds: selection.map((n) => Number(n)) },
          false
        );
      } else {
        await assignEditor(
          currentBook.id,
          { editorIds: selection.map((n) => Number(n)) },
          false
        );
      }
      refetch();
      setOpenModal(false);
      showToast("Users assigned successfully");
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const unAssignUser = async (userID: number) => {
    setLoading(true);
    try {
      if (currentTab === tabs.APPROVERS) {
        await assignApprover(currentBook.id, { approverIds: [userID] }, true);
      } else {
        await assignEditor(currentBook.id, { editorIds: [userID] }, true);
      }
      refetch();
      setOpenModal(false);
      showToast("User un-assigned successfully");
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full py-[50px] flex items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Select
            value={currentBookID?.toString()}
            onValueChange={(e) => {
              setCurrentBookID(Number(e));
            }}
          >
            <SelectTrigger value={null} className="w-[180px]">
              <SelectValue placeholder="Select book" />
            </SelectTrigger>
            <SelectContent>
              {ebooks?.map((version, i) => (
                <SelectItem value={version.id.toString()} key={i}>
                  {version.bookType}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      {!currentBookID ? (
        <div className="mt-[50px] p-6 text-center">
          <p>Select a book</p>
        </div>
      ) : (
        <div className="mt-4">
          <div className="flex justify-between">
            <Tabs
              defaultValue={currentTab}
              onValueChange={(e) => {
                setCurrentTab(e as tabs);
                setSelection([]);
              }}
              className="w-[400px] my-4"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value={tabs.EDITORS}>Editors</TabsTrigger>
                <TabsTrigger value={tabs.APPROVERS}>Approvers</TabsTrigger>
              </TabsList>
            </Tabs>

            <Button
              isLoading={loading}
              className="w-[200px]"
              onClick={() => setOpenModal(true)}
            >
              Assign new{" "}
              {currentTab === tabs.APPROVERS ? "Approvers" : "Editors"}
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>First Name</TableHead>
                <TableHead>Last Name</TableHead>
                <TableHead>Index Number</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {listToUse.map((user, index) => (
                <TableRow className="cursor-pointer" key={index}>
                  <TableCell className="capitalize">{user.firstName}</TableCell>
                  <TableCell className="capitalize">{user.lastName}</TableCell>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant="success">{user.roles[0].name}</Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <div className="w-4 h-4">
                          <Icon
                            name="menu-dots"
                            className="w-4 h-4 text-quaternary"
                            fill="none"
                          />
                        </div>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="text-sm text-[#212B36] font-medium rounded-[8px] px-1"
                      >
                        <DropdownMenuItem
                          onClick={() => unAssignUser(user.id)}
                          className="py-2 text-[#FF3B30] rounded-[8px]"
                        >
                          Un-assign
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <AlertDialog open={openModal} onOpenChange={() => setOpenModal(false)}>
        <AlertDialogContent className="max-w-md w-full md:max-w-[600px]">
          <div className="flex justify-between">
            <AlertDialogTitle className="text-[#212B36] text-2xl font-normal">
              Assign {currentTab === tabs.APPROVERS ? "Approvers" : "Editors"}
            </AlertDialogTitle>
            <div onClick={() => setOpenModal(false)} className="w-6 h-6">
              <Icon
                name="cancel"
                className="h-6 w-6 text-[#A4A7AE] cursor-pointer"
              />
            </div>
          </div>

          <AlertDialogHeader className="space-y-3 relative">
            <div className="flex items-start justify-between !mt-0">
              <div className="flex-1">
                <AlertDialogDescription className="text-[#637381] text-base font-normal">
                  You can manage ebook editors and approvers here
                </AlertDialogDescription>
              </div>
            </div>
          </AlertDialogHeader>

          <div>
            {currentTab === tabs.APPROVERS ? (
              <MultiSelect
                onValueChange={(e) => setSelection(e)}
                options={nonApprovers.map((user) => {
                  return {
                    label: `${user.firstName} ${user.lastName}`,
                    value: user.id.toString(),
                  };
                })}
                value={selection}
                className="w-full"
                placeholder="Select users"
              />
            ) : (
              <MultiSelect
                onValueChange={(e) => setSelection(e)}
                options={nonEditors.map((user) => {
                  return {
                    label: `${user.firstName} ${user.lastName}`,
                    value: user.id.toString(),
                  };
                })}
                value={selection}
                className="w-full"
                placeholder="Select users"
              />
            )}

            <Button isLoading={loading} onClick={assignUsers} className="mt-4">
              Assign
            </Button>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default ApprovalPage;
