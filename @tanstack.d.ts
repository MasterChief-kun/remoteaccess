import { RowData } from "@tanstack/react-table"

declare module '@tanstack/table-core' {
  interface TableMeta<TData extends RowData> {
    loading: boolean;
    onLoading: () => void;
  }
}
