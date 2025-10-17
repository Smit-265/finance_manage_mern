import React from "react";
import { Table } from "antd";

interface SalaryTableProps {
  data: { id: number; month: string; amount: number }[];
}

const SalaryTable: React.FC<SalaryTableProps> = ({ data }) => {
  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Month", dataIndex: "month", key: "month" },
    { title: "Amount (₹)", dataIndex: "amount", key: "amount" }
  ];

  return <Table columns={columns} dataSource={data} rowKey="id" />;
};

export default SalaryTable;
