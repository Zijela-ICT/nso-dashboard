import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { UploadCloudIcon } from "lucide-react";
import { ReactNode, useState } from "react";

export function UploadFileModal({
  onChange,
  children,
}: {
  onChange: (e: File | undefined) => void;
  children?: ReactNode;
}) {
  const [file, setFile] = useState<File | null>(null);

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children || <Button variant="outline">Upload Book</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Select a book</DialogTitle>
          <DialogDescription>
            Select a json file to render the book
          </DialogDescription>
        </DialogHeader>
        <UploadCloudIcon size={40} className="mx-auto" />
        <div className="cursor-pointer">
          <Input
            id="file"
            type="file"
            className="col-span-3"
            onChange={(e) => setFile(e?.target?.files?.[0])}
            name="file"
          />
        </div>

        <Button
          onClick={() => {
            onChange(file);
          }}
        >
          Upload
        </Button>
      </DialogContent>
    </Dialog>
  );
}
