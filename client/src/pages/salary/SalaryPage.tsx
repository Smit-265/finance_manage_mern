import React, { useState } from "react";
import { Button, Card } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import SalaryTable from "./SalaryTable";
import SalaryFormModal from "./SalaryFormModal";

const SalaryPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [salaries, setSalaries] = useState([
    { id: 1, month: "October 2025", amount: 20000 },
    { id: 2, month: "September 2025", amount: 20000 }
  ]);

  const handleAddSalary = (newSalary: { month: string; amount: number }) => {
    const id = salaries.length + 1;
    setSalaries([...salaries, { id, ...newSalary }]);
    setIsModalOpen(false);
  };

  return (
    <Card
      title="Salary Records"
      extra={
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsModalOpen(true)}
        >
          Add Salary
        </Button>
      }
    >
      <SalaryTable data={salaries} />
      <SalaryFormModal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onSubmit={handleAddSalary}
      />
    </Card>
  );
};

export default SalaryPage;
