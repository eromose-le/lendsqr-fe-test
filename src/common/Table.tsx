import React, { useState, useMemo, useCallback } from "react";
import { assets } from "@/assets/constants";
import moment from "moment";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
} from "@tanstack/react-table";
import { UserDetailMenuPop } from "./UserDetailMenuPop";
import { UserDetailFilterPop } from "./UserDetailFilterPop";
import TablePagination2 from "./TablePagination";
import "../pages/user/pagination.scss";

interface User {
  id: string;
  orgName: string;
  userName: string;
  email: string;
  phoneNumber: string;
  createdAt: string;
  status: string;
}

type Props = {
  data: User[];
};

export const Table2: React.FC<Props> = ({ data }) => {
  const [isFilterModal, setIsFilterModal] = useState(false);
  const [openMenuRowId, setOpenMenuRowId] = useState<string | null>(null);

  const columns: ColumnDef<User>[] = useMemo(
    () => [
      {
        accessorKey: "orgName",
        header: "Organization",
        cell: (props) => <p>{props.getValue<string>()}</p>,
      },
      {
        accessorKey: "userName",
        header: "Username",
        cell: (props) => <p>{props.getValue<string>()}</p>,
      },
      {
        accessorKey: "email",
        header: "Email",
        size: 500,
        cell: (props) => <p>{props?.getValue<string>()}</p>,
      },
      {
        accessorKey: "phoneNumber",
        header: "Phone number",
        cell: (props) => (
          <p>
            {moment(props.getValue<string>()).format("MMMM Do YYYY, h:mm:ss a")}
          </p>
        ),
      },
      {
        accessorKey: "createdAt",
        header: "Date joined",
        cell: (props) => {
          console.log(
            moment(props.getValue<string>()).format("MMMM Do YYYY, h:mm:ss a")
          );
          return (
            <p>
              {moment(props.getValue<string>()).format(
                "MMMM Do YYYY, h:mm:ss a"
              )}
            </p>
          );
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <p className={`${row.original.status?.toLowerCase()}`}>
            {row.original.status}
          </p>
        ),
      },
      {
        accessorKey: "action",
        header: () => null,
        cell: ({ row }) => {
          const isMenuOpen = openMenuRowId === row.original.id;
          return (
            <div className="menuContainer">
              <button
                onClick={() =>
                  setOpenMenuRowId(isMenuOpen ? null : row.original.id)
                }
              >
                <img src={assets.dot} alt="filter" />
              </button>
              {isMenuOpen && <UserDetailMenuPop userId={row.original.id} />}
            </div>
          );
        },
      },
    ],
    [openMenuRowId]
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const handleFilterIconClick = useCallback(() => {
    setIsFilterModal((prev) => !prev);
  }, []);

  return (
    <>
      <div className="tableWrapper">
        {isFilterModal && <UserDetailFilterPop />}
        <div className="table-container">
          <table className="table">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id}>
                      {header.isPlaceholder ? null : (
                        <div>
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {header.id !== "action" && (
                            <img
                              onClick={handleFilterIconClick}
                              className="filterIcon"
                              src={assets.filter}
                              alt="filter"
                            />
                          )}
                        </div>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="paginateContainer">
        <div className="top">
          <p className="paginateText">Showing</p>
          <div className="paginateSelectContainer">
            <select
              className="paginateSelect"
              value={table.getState().pagination.pageSize}
              onChange={(e) => {
                table.setPageSize(Number(e.target.value));
              }}
            >
              {[100, 200, 300, 400, 500].map((pageSize) => (
                <option
                  key={pageSize}
                  className="paginateOption"
                  value={pageSize}
                >
                  {pageSize}
                </option>
              ))}
            </select>
          </div>
          <p className="paginateText">out of {data.length}</p>
        </div>
        <TablePagination2
          currentPage={table.getState().pagination.pageIndex + 1}
          totalPages={table.getPageCount()}
          onPageChange={(page: any) => table.setPageIndex(page - 1)}
        />
      </div>
    </>
  );
};
