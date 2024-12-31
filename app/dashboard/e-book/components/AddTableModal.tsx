import { Item, TableData, TableHeader, TableRows } from "../booktypes";
import React, { useState } from "react";
import TableRenderer from "./TableRender";
import { generateRandomString } from "../helpers";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../../components/ui/dialog";

const TableGenerator = ({
  addNewElement,
  onClose,
  showTableModal,
}: {
  addNewElement: (e: string, f: Item) => void;
  showTableModal: boolean;
  onClose: () => void;
}) => {
  const [tableConfig, setTableConfig] = useState<TableData>({
    type: "table",
    headers: [],
    rows: [],
    tableStyle: {
      width: "100%",
      borderCollapse: "collapse",
      padding: "12px",
    },
    headless: false,
    showCellBorders: true,
    itemsPerPage: 0,
  });
  const [step, setStep] = useState(1);
  const [columnCount, setColumnCount] = useState<number | null>(null);
  const [rowsCount, setRowsCount] = useState<number | null>(null);
  const handleConfigChange = (field: keyof TableData, value: unknown) => {
    setTableConfig((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const generateEmptyHeaders = (rows: number, cols: number) => {
    return Array(rows)
      .fill(0)
      .map(() =>
        Array(cols)
          .fill(0)
          .map(() => ({
            content: generateRandomString(10),
            type: "text",
            cellStyle: { padding: "12px" },
            rowSpan: 2,
          }))
      );
  };

  const handleStructureGeneration = () => {
    const emptyHeaders = generateEmptyHeaders(1, columnCount) as (TableHeader &
      Item)[][];

    // Generate random content for rows
    const randomRows = Array.from({ length: rowsCount }, () =>
      // Adjust the number of rows as needed
      Array.from({ length: columnCount }, () => ({
        content: generateRandomString(10), // Random row content
        type: "text",
      }))
    ) as (TableRows & Item)[][];

    setTableConfig((prev) => ({
      ...prev,
      headers: !prev.headless ? emptyHeaders : undefined,
      columnCount,
      rows: randomRows,
      type: "table",
      itemsPerPage: 1,
    }));
  };

  const renderConfigurationStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Configuration</h3>
            <div>
              <label className="block mb-2">Table Title</label>
              <input
                type="text"
                value={tableConfig.title || ""}
                onChange={(e) => handleConfigChange("title", e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Enter table title"
              />
            </div>
            <div>
              <label className="block mb-2">Number of Columns</label>
              <input
                type="number"
                value={columnCount}
                onChange={(e) => setColumnCount(parseInt(e.target.value))}
                className="w-full p-2 border rounded"
                min="1"
              />
            </div>
            <div>
              <label className="block mb-2">Number of rows</label>
              <input
                type="number"
                value={rowsCount}
                onChange={(e) => setRowsCount(parseInt(e.target.value))}
                className="w-full p-2 border rounded"
                min="1"
              />
            </div>

            <div className="flex items-center gap-2 mb-4">
              <input
                type="checkbox"
                checked={tableConfig.headless}
                onChange={(e) =>
                  handleConfigChange("headless", e.target.checked)
                }
              />
              <label>Headless Table</label>
            </div>

            <div>
              <label className="block mb-2">Table Width</label>
              <input
                type="text"
                value={(tableConfig.tableStyle as Record<string, string>).width}
                onChange={(e) =>
                  handleConfigChange("tableStyle", {
                    ...tableConfig.tableStyle,
                    width: e.target.value,
                  })
                }
                className="w-full p-2 border rounded"
                placeholder="100%, 500px, etc."
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={tableConfig.showCellBorders}
                onChange={(e) =>
                  handleConfigChange("showCellBorders", e.target.checked)
                }
              />
              <label>Show Cell Borders</label>
            </div>

            <button
              onClick={() => {
                handleStructureGeneration();
                setStep(2);
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Next
            </button>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Generated Table Structure</h3>
            <div className="w-full overflow-x-auto">
              <TableRenderer tableData={tableConfig as TableData} />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setStep(1)}
                className="px-4 py-2 bg-gray-500 text-white rounded"
              >
                Start Over
              </button>
              <button
                onClick={() => {
                  // Handle saving or passing the configuration
                  console.log("Final table structure:", tableConfig);
                  addNewElement("table", tableConfig as Item);
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Create table
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={showTableModal} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Table</DialogTitle>
        </DialogHeader>
        <div className="w-full">{renderConfigurationStep()}</div>
      </DialogContent>
    </Dialog>
  );
};

export default TableGenerator;
