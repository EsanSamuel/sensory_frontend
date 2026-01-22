"use client";

import * as React from "react";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  IconAlertTriangle,
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconCircleCheckFilled,
  IconCode,
  IconDotsVertical,
  IconFileCode,
  IconFilter,
  IconGripVertical,
  IconInfoCircle,
  IconLayoutColumns,
  IconSearch,
  IconX,
} from "@tabler/icons-react";
import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type Row,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table";
import { toast } from "sonner";

import { useIsMobile } from "@/hooks/use-mobile";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import axios from "axios";

export interface Project {
  _id: string;
  project_id: string;
  project_name: string;
  description: string;
  user_id: string;
  api_key: string;
  service: string;
  log_counts: number;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
}

// Use the ILog interface
export interface ILog {
  _id: string;
  level: "INFO" | "ERROR" | "WARN" | "DEBUG";
  timestamp: string;
  project: Project;
  project_id: string;
  service: string;
  message: string;
  runtime: {
    file: string;
    line: number;
    fn: string;
  };
}

// Create a separate component for the drag handle
function DragHandle({ id }: { id: string }) {
  const { attributes, listeners } = useSortable({
    id,
  });

  return (
    <Button
      {...attributes}
      {...listeners}
      variant="ghost"
      size="icon"
      className="text-muted-foreground size-7 hover:bg-transparent"
    >
      <IconGripVertical className="text-muted-foreground size-3" />
      <span className="sr-only">Drag to reorder</span>
    </Button>
  );
}

// Level badge component
function LevelBadge({ level }: { level: ILog["level"] }) {
  const variants = {
    INFO: "bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 border-blue-500/30",
    ERROR:
      "bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400 border-red-500/30",
    WARN: "bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400 border-amber-500/30",
    DEBUG:
      "bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400 border-purple-500/30",
  };

  const icons = {
    INFO: <IconInfoCircle className="size-3.5" />,
    ERROR: <IconAlertTriangle className="size-3.5" />,
    WARN: <IconAlertTriangle className="size-3.5" />,
    DEBUG: <IconCode className="size-3.5" />,
  };

  return (
    <Badge
      variant="outline"
      className={`${variants[level]} gap-1 px-2 py-0.5 font-mono text-xs font-semibold`}
    >
      {icons[level]}
      {level}
    </Badge>
  );
}

const columns: ColumnDef<ILog>[] = [
  {
    id: "drag",
    header: () => null,
    cell: ({ row }) => <DragHandle id={row.original._id} />,
    size: 40,
  },
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
    size: 40,
  },
  {
    accessorKey: "level",
    header: "Level",
    cell: ({ row }) => <LevelBadge level={row.original.level} />,
    size: 100,
  },
  {
    accessorKey: "timestamp",
    header: "Timestamp",
    cell: ({ row }) => {
      const date = new Date(row.original.timestamp);
      const formattedDate = date.toLocaleString("en-US", {
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });
      return (
        <div className="font-mono text-xs text-muted-foreground">
          {formattedDate}
        </div>
      );
    },
    size: 160,
  },
  {
    accessorKey: "project",
    header: "Project",
    cell: ({ row }) => (
      <div className="text-sm font-medium">
        {row.original.project.project_name}
      </div>
    ),
    size: 120,
  },
  {
    accessorKey: "service",
    header: "Service",
    cell: ({ row }) => (
      <div className="text-sm text-muted-foreground">
        {row.original.service || "—"}
      </div>
    ),
    size: 120,
  },
  {
    accessorKey: "message",
    header: "Message",
    cell: ({ row }) => {
      return <LogMessageCell log={row.original} />;
    },
    enableHiding: false,
    size: 400,
  },
  {
    accessorKey: "runtime.file",
    header: "File",
    cell: ({ row }) => {
      const filePath = row.original.runtime.file;
      const fileName = filePath.split(/[/\\]/).pop() || filePath;
      return (
        <div className="flex items-center gap-1.5">
          <IconFileCode className="size-3.5 text-muted-foreground" />
          <span
            className="font-mono text-xs text-muted-foreground"
            title={filePath}
          >
            {fileName}
          </span>
        </div>
      );
    },
    size: 200,
  },
  {
    accessorKey: "runtime.line",
    header: () => <div className="text-right">Line</div>,
    cell: ({ row }) => (
      <div className="text-right font-mono text-xs text-muted-foreground">
        {row.original.runtime.line}
      </div>
    ),
    size: 80,
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
            size="icon"
          >
            <IconDotsVertical />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuItem>View Details</DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              navigator.clipboard.writeText(row.original.message);
              toast.success("Message copied to clipboard");
            }}
          >
            Copy Message
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              const stackTrace = `File: ${row.original.runtime.file}\nLine: ${row.original.runtime.line}\nFunction: ${row.original.runtime.fn}`;
              navigator.clipboard.writeText(stackTrace);
              toast.success("Stack trace copied to clipboard");
            }}
          >
            Copy Stack Trace
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Mark as Resolved</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
    size: 60,
  },
];

function DraggableRow({ row }: { row: Row<ILog> }) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original._id,
  });

  return (
    <TableRow
      data-state={row.getIsSelected() && "selected"}
      data-dragging={isDragging}
      ref={setNodeRef}
      className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition,
      }}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  );
}

export function LogDataTable({ data: initialData }: { data: ILog[] }) {
  const [data, setData] = React.useState(() => initialData);
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "timestamp", desc: true },
  ]);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 25,
  });
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [levelFilter, setLevelFilter] = React.useState<string>("all");

  const sortableId = React.useId();
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {}),
  );

  // Update data when initialData changes
  React.useEffect(() => {
    setData(initialData);
  }, [initialData]);

  const dataIds = React.useMemo<UniqueIdentifier[]>(
    () => data?.map(({ _id }) => _id) || [],
    [data],
  );

  // Filter data by level
  const filteredData = React.useMemo(() => {
    if (!data) return [];
    if (levelFilter === "all") return data;
    return data.filter((log) => log.level === levelFilter);
  }, [data, levelFilter]);

  const projectName = async (projectId: string) => {
    const response = await axios.get(
      `http://localhost:8000/project/${projectId}`,
    );
    return response.data.project_name;
  };

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
      globalFilter,
    },
    getRowId: (row) => row._id,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    globalFilterFn: (row, columnId, filterValue) => {
      const search = filterValue.toLowerCase();
      const message = row.original.message.toLowerCase();
      const file = row.original.runtime.file.toLowerCase();
      const fn = row.original.runtime.fn.toLowerCase();
      const project = row.original.project.project_name.toLowerCase();
      const service = row.original.service?.toLowerCase() || "";
      return (
        message.includes(search) ||
        file.includes(search) ||
        fn.includes(search) ||
        project.includes(search) ||
        service.includes(search)
      );
    },
  });

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      setData((data) => {
        const oldIndex = dataIds.indexOf(active.id);
        const newIndex = dataIds.indexOf(over.id);
        return arrayMove(data, oldIndex, newIndex);
      });
    }
  }

  // Calculate log level counts
  const levelCounts = React.useMemo(() => {
    if (!data) return {} as Record<string, number>;
    return data.reduce(
      (acc, log) => {
        acc[log.level] = (acc[log.level] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );
  }, [data]);

  if (!data || data.length === 0) {
    return (
      <div className="flex min-h-[400px] w-full items-center justify-center rounded-lg border-2 border-dashed p-8">
        <div className="text-center">
          <IconInfoCircle className="mx-auto mb-4 size-12 text-muted-foreground" />
          <h3 className="mb-2 text-lg font-semibold">No logs available</h3>
          <p className="text-sm text-muted-foreground">
            Start sending logs to see them appear here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-4">
      {/* Header with search and filters */}
      <div className="flex flex-col gap-4 px-4 lg:px-6">
        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <IconSearch className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search logs by message, file, or function..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="pl-9"
            />
            {globalFilter && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 size-7 -translate-y-1/2"
                onClick={() => setGlobalFilter("")}
              >
                <IconX className="size-3.5" />
              </Button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <IconLayoutColumns />
                  <span className="hidden lg:inline">Columns</span>
                  <IconChevronDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {table
                  .getAllColumns()
                  .filter(
                    (column) =>
                      typeof column.accessorFn !== "undefined" &&
                      column.getCanHide(),
                  )
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Level filter badges */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
            <IconFilter className="size-4" />
            <span>Filter:</span>
          </div>
          <Button
            variant={levelFilter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setLevelFilter("all")}
            className="h-8"
          >
            All
            <Badge variant="secondary" className="ml-1.5 px-1.5 py-0">
              {data.length}
            </Badge>
          </Button>
          {(["ERROR", "WARN", "INFO", "DEBUG"] as const).map((level) => (
            <Button
              key={level}
              variant={levelFilter === level ? "default" : "outline"}
              size="sm"
              onClick={() => setLevelFilter(level)}
              className="h-8"
            >
              {level}
              <Badge variant="secondary" className="ml-1.5 px-1.5 py-0">
                {levelCounts[level] || 0}
              </Badge>
            </Button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6">
        <div className="overflow-hidden rounded-lg border">
          <DndContext
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis]}
            onDragEnd={handleDragEnd}
            sensors={sensors}
            id={sortableId}
          >
            <Table>
            
              <TableHeader className="bg-muted sticky top-0 z-10">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id} colSpan={header.colSpan}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  <SortableContext
                    items={dataIds}
                    strategy={verticalListSortingStrategy}
                  >
                    {table.getRowModel().rows.map((row) => (
                      <DraggableRow key={row.id} row={row} />
                    ))}
                  </SortableContext>
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No logs found matching your filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </DndContext>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4">
          <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="flex w-full items-center gap-8 lg:w-fit">
            <div className="hidden items-center gap-2 lg:flex">
              <Label htmlFor="rows-per-page" className="text-sm font-medium">
                Rows per page
              </Label>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => {
                  table.setPageSize(Number(value));
                }}
              >
                <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                  <SelectValue
                    placeholder={table.getState().pagination.pageSize}
                  />
                </SelectTrigger>
                <SelectContent side="top">
                  {[10, 25, 50, 100].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-fit items-center justify-center text-sm font-medium">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </div>
            <div className="ml-auto flex items-center gap-2 lg:ml-0">
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to first page</span>
                <IconChevronsLeft />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to previous page</span>
                <IconChevronLeft />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to next page</span>
                <IconChevronRight />
              </Button>
              <Button
                variant="outline"
                className="hidden size-8 lg:flex"
                size="icon"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to last page</span>
                <IconChevronsRight />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LogMessageCell({ log }: { log: ILog }) {
  const isMobile = useIsMobile();
  const projectName = async () => {
    const response = await axios.get(
      `http://localhost:8000/project/${log.project_id}`,
    );
    console.log(response.data.project_name);
    return response.data.project_name;
  };

  const messagePreview =
    log.message.length > 100 ? log.message.slice(0, 100) + "..." : log.message;

  return (
    <Drawer direction={isMobile ? "bottom" : "right"}>
      <DrawerTrigger asChild>
        <Button
          variant="link"
          className="text-foreground h-auto w-full justify-start px-0 text-left font-normal"
        >
          <div className="line-clamp-2 text-sm">{messagePreview}</div>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="max-h-[85vh]">
        <DrawerHeader className="gap-1">
          <DrawerTitle className="flex items-center gap-2">
            <LevelBadge level={log.level} />
            Log Details
          </DrawerTitle>
          <DrawerDescription className="font-mono text-xs">
            {new Date(log.timestamp).toLocaleString()}
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-4 overflow-y-auto px-4 pb-4">
          <div className="space-y-4">
            <div>
              <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Message
              </Label>
              <div className="mt-2 rounded-md border bg-muted/30 p-3">
                <p className="whitespace-pre-wrap text-sm leading-relaxed">
                  {log.message}
                </p>
              </div>
            </div>

            <Separator />

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Project
                </Label>
                <p className="mt-1.5 text-sm font-medium">
                  {log.project.project_name}
                </p>
              </div>
              <div>
                <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Service
                </Label>
                <p className="mt-1.5 text-sm font-medium">
                  {log.service || "—"}
                </p>
              </div>
            </div>

            <Separator />

            <div>
              <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Runtime Information
              </Label>
              <div className="mt-2 space-y-2 rounded-md border bg-muted/30 p-3">
                <div className="flex items-start gap-2">
                  <IconFileCode className="mt-0.5 size-4 text-muted-foreground" />
                  <div className="flex-1 overflow-hidden">
                    <p className="text-xs font-semibold text-muted-foreground">
                      File
                    </p>
                    <p className="break-all font-mono text-xs">
                      {log.runtime.file}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <IconCode className="mt-0.5 size-4 text-muted-foreground" />
                  <div className="flex-1 overflow-hidden">
                    <p className="text-xs font-semibold text-muted-foreground">
                      Function
                    </p>
                    <p className="break-all font-mono text-xs">
                      {log.runtime.fn}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <IconInfoCircle className="mt-0.5 size-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-muted-foreground">
                      Line Number
                    </p>
                    <p className="font-mono text-xs">{log.runtime.line}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <DrawerFooter>
          <Button
            onClick={() => {
              navigator.clipboard.writeText(log.message);
              toast.success("Message copied to clipboard");
            }}
          >
            Copy Message
          </Button>
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
