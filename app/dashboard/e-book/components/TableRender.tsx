import React, { useState } from "react";
import { Item, TableData, TableHeader, TableRows } from "../booktypes";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../../components/ui/dialog";
import EditTableModal from "./EditTableModal";
import { Button } from "../../../../components/ui/button";
import { useBookContext } from "../context/bookContext";

const TableRenderer = ({
  tableData,
  handleMouseEnter,
  edit = false,
  onSave,
}: {
  tableData: TableData;
  handleMouseEnter?: (event: React.MouseEvent<HTMLElement>) => void;
  edit?: boolean;
  onSave?: (e: TableData) => void;
}) => {
  const { isEditting } = useBookContext();
  const [openModal, setOpenModal] = useState<boolean>(false);

  const renderCell = (
    cell: (TableHeader & Item) | (TableRows & Item),
    isHeader = false
  ) => {
    const CellComponent = isHeader ? "th" : "td";
    const cellProps = {
      style: {
        padding: "12px 16px",
        ...(tableData.showCellBorders && { border: "1px solid black" }),
        ...cell.cellStyle,
      },
      rowSpan: cell.rowSpan,
      colSpan: cell.colSpan,
    };

    return (
      <CellComponent {...cellProps}>
        {cell.type === "text" && (
          <span style={{ whiteSpace: "pre-wrap" }}>
            {cell.content as string}
          </span>
        )}
        {cell.type === "orderedList" && Array.isArray(cell.content) && (
          <ul className="list-decimal pl-2">
            {(cell.content as string[]).map((text, i) => (
              <li className="pl-2" key={i} style={{ whiteSpace: "pre-wrap" }}>
                {text}
              </li>
            ))}
          </ul>
        )}
      </CellComponent>
    );
  };

  return (
    <div onMouseEnter={handleMouseEnter} data-text_path={tableData.title}>
      <div className="flex justify-between mb-4">
        {tableData.title && (
          <h3 className="text-xl font-semibold mb-4">{tableData.title}</h3>
        )}
        {edit && isEditting && (
          <Button className="!w-[120px]" onClick={() => setOpenModal(true)}>
            Edit table
          </Button>
        )}
      </div>

      <table
        style={{
          ...tableData.tableStyle,
          padding: "8px",
        }}
      >
        {!tableData.headless && tableData.headers && (
          <thead>
            <tr>
              {tableData.headers[0].map((header, cellIndex) => (
                <React.Fragment key={`header-cell-${cellIndex}`}>
                  {renderCell(header, true)}
                </React.Fragment>
              ))}
            </tr>
          </thead>
        )}

        <tbody>
          {tableData.rows.map((row, rowIndex) => (
            <tr key={`body-row-${rowIndex}`}>
              {row.map((cell, cellIndex) => (
                <React.Fragment key={`body-cell-${rowIndex}-${cellIndex}`}>
                  {renderCell(cell)}
                </React.Fragment>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <Dialog
        open={openModal && !!tableData}
        onOpenChange={() => setOpenModal(false)}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto max-w-[80%]">
          <DialogHeader>
            <DialogTitle>Edit Table</DialogTitle>
          </DialogHeader>
          <div className="w-full">
            <EditTableModal
              onSave={(e) => {
                onSave?.(e);
                setOpenModal(false);
              }}
              onClose={() => setOpenModal(false)}
              tableData={tableData}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TableRenderer;
