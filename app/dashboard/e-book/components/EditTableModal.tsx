import { Item, TableData, TableHeader, TableRows } from "../booktypes";
import React from "react";
import { Button } from "../../../../components/ui/button";

interface ModalProps {
  tableData: TableData;
  onSave: (updatedData: TableData) => void;
  onClose: () => void;
}

const EditTableModal: React.FC<ModalProps> = ({
  tableData,
  onSave,
  onClose,
}) => {
  const [updatedData, setUpdatedData] = React.useState<TableData>(tableData);

  const handleChange = (rowIndex: number, colIndex: number, value: string) => {
    const newData = { ...updatedData };
    if (rowIndex === 0) {
      // Update header
      newData.headers![0][colIndex].content = value;
    } else {
      // Update row
      newData.rows[rowIndex - 1][colIndex].content = value; // Adjust index for rows
    }
    setUpdatedData(newData);
  };

  const handleAddRow = () => {
    const newRow: (TableRows & Item)[] = Array.from(
      { length: updatedData.headers[0].length },
      () => ({
        content: "New Row Content",
        type: "text",
      })
    );
    setUpdatedData((prev) => ({
      ...prev,
      rows: [...prev.rows, newRow],
    }));
  };

  const handleAddColumn = () => {
    const newHeader: TableHeader = { content: "New Column", type: "text" }; // Dummy header content
    const newColumnContent = "New Column Content"; // Dummy content for new column

    setUpdatedData((prev) => ({
      ...prev,
      headers: [[...prev.headers[0], newHeader]], // Add new header
      rows: prev.rows.map((row) => [
        ...row,
        { content: newColumnContent, type: "text" },
      ]), // Add new column to each row
    }));
  };

  const handleSave = () => {
    onSave(updatedData);
  };

  const handleRemoveRow = (rowIndex: number) => {
    setUpdatedData((prev) => ({
      ...prev,
      rows: prev.rows.filter((_, index) => index !== rowIndex),
    }));
  };

  const handleRemoveColumn = (colIndex: number) => {
    setUpdatedData((prev) => ({
      ...prev,
      headers: [prev.headers[0].filter((_, index) => index !== colIndex)], // Remove header
      rows: prev.rows.map((row) =>
        row.filter((_, index) => index !== colIndex)
      ), // Remove column from each row
    }));
  };

  return (
    <div className="">
      <div className="w-full overflow-x-auto mb-4">
        <table className="min-w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              {updatedData &&
                updatedData?.headers?.[0]?.map((header, colIndex) => (
                  <th
                    key={colIndex}
                    className="border border-gray-300 px-4 py-2"
                  >
                    <div className="flex">
                      <input
                        type="text"
                        value={header.content as string}
                        onChange={(e) =>
                          handleChange(0, colIndex, e.target.value)
                        }
                        className="bg-transparent"
                      />

                      <Button
                        variant="outline"
                        onClick={() => handleRemoveColumn(colIndex)}
                        className="h-6"
                      >
                        Remove column
                      </Button>
                    </div>
                  </th>
                ))}
            </tr>
          </thead>
          <tbody>
            {updatedData &&
              updatedData?.rows?.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, colIndex) => (
                    <td
                      key={colIndex}
                      className="border border-gray-300 px-4 py-2"
                    >
                      <textarea
                        value={cell.content as string}
                        onChange={(e) =>
                          handleChange(rowIndex + 1, colIndex, e.target.value)
                        } // Adjust index for rows
                        className="bg-transparent min-h-[70px] w-full"
                      />
                    </td>
                  ))}
                  <td>
                    <Button
                      variant="outline"
                      onClick={() => handleRemoveRow(rowIndex)}
                    >
                      Remove Row
                    </Button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between gap-3">
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleAddRow}>
            Add Row
          </Button>
          <Button variant="outline" onClick={handleAddColumn}>
            Add Column
          </Button>
        </div>
        <div className="flex">
          <Button onClick={onClose} variant="secondary">
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </div>
      </div>
    </div>
  );
};

export default EditTableModal;
