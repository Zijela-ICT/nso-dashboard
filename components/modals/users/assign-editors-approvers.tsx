import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  Button,
  Icon,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Tabs,
  TabsList,
  TabsTrigger
} from "@/components/ui";
import { SystemUsersDataResponse } from "@/hooks/api/queries/users";
import React, { useMemo, useState } from "react";
import useEBooks, { BookAdmin } from "@/app/dashboard/e-book/hooks/useEBooks";
import { assignApprover, assignEditor } from "@/utils/book.services";
import { showToast } from "@/utils/toast";

interface EditUserModal {
  openModal: boolean;
  setOpenModal: (open: boolean) => void;
  user: SystemUsersDataResponse;
}

const AssignEditorAndApprovers = ({
  openModal,
  setOpenModal,
  user
}: EditUserModal) => {
  enum tabs {
    APPROVERS = "Approvers",
    EDITORS = "Editors"
  }
  const { data: ebooks, refetch } = useEBooks();
  const [loading, setLoading] = useState(false);
  const [bookID, setBookID] = useState(null);
  const [currentTab, setCurrentTab] = useState<tabs>(tabs.EDITORS);

  const currentBook = useMemo(
    () => ebooks?.find((b) => b.id === Number(bookID)),
    [ebooks, bookID]
  );
  const isAnEditor = useMemo(() => {
    return !!currentBook?.editors.find((u: BookAdmin) => u.id === user.id);
  }, [currentBook, user]);

  const isAnApprover = useMemo(() => {
    return !!currentBook?.approvers.find((u: BookAdmin) => u.id === user.id);
  }, [currentBook, user]);

  const buttonText: string = useMemo(() => {
    let text = "";
    if (
      (isAnApprover && currentTab === tabs.APPROVERS) ||
      (isAnEditor && currentTab === tabs.EDITORS)
    ) {
      text = "Un-assign";
    } else {
      text = "Assign";
    }
    return text;
  }, [isAnApprover, isAnEditor, currentTab]);

  const assignUser = async () => {
    setLoading(true);
    try {
      if (currentTab === tabs.EDITORS) {
        await assignEditor(bookID, { editorId: user.id }, isAnEditor);
      } else {
        await assignApprover(bookID, { approverId: user.id }, isAnApprover);
      }
      showToast("User assigned successfully");
      setBookID(null);
      refetch();
      setOpenModal(false);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={openModal} onOpenChange={() => setOpenModal(false)}>
      <AlertDialogContent className="max-w-md w-full md:max-w-[600px]">
        <AlertDialogHeader className="space-y-3 relative">
          <div className="flex items-start justify-between !mt-0">
            <div className="flex-1">
              <AlertDialogTitle className="text-[#212B36] text-2xl font-normal">
                Assign {user?.firstName} {user?.lastName}
              </AlertDialogTitle>
              <AlertDialogDescription className="text-[#637381] text-base font-normal">
                You can manage ebook editors and approvers here
              </AlertDialogDescription>
            </div>
            <div onClick={() => setOpenModal(false)} className="w-6 h-6">
              <Icon
                name="cancel"
                className="h-6 w-6 text-[#A4A7AE] cursor-pointer"
              />
            </div>
          </div>
        </AlertDialogHeader>

        <Tabs
          defaultValue={currentTab}
          onValueChange={(e) => {
            setCurrentTab(e as tabs);
          }}
          className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value={tabs.EDITORS}>Set as Editor</TabsTrigger>
            <TabsTrigger value={tabs.APPROVERS}>Set as Approver</TabsTrigger>
          </TabsList>

          <div className="w-full">
            <Select onValueChange={(e) => setBookID(e)}>
              <SelectTrigger className="w-full mt-4">
                <SelectValue placeholder="Select book" />
              </SelectTrigger>
              <SelectContent>
                {ebooks?.map((book, i) => (
                  <SelectItem value={book.id.toString()} key={i}>
                    {book.bookType.toUpperCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="w-full flex justify-end">
            <Button
              className="self-end mt-4 w-fit"
              type="submit"
              disabled={!bookID}
              isLoading={loading}
              onClick={assignUser}>
              {buttonText}
            </Button>
          </div>
        </Tabs>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export { AssignEditorAndApprovers };
