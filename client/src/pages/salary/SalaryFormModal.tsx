import React from "react";
import { Modal, Form, Input, InputNumber, Button } from "antd";

interface SalaryFormModalProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: (values: { month: string; amount: number }) => void;
}

const SalaryFormModal: React.FC<SalaryFormModalProps> = ({
  open,
  onCancel,
  onSubmit
}) => {
  const [form] = Form.useForm();

  const handleFinish = (values: { month: string; amount: number }) => {
    onSubmit(values);
    form.resetFields();
  };

  return (
    <Modal
      title="Add Salary"
      open={open}
      onCancel={onCancel}
      footer={null}
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item
          name="month"
          label="Month"
          rules={[{ required: true, message: "Please enter month" }]}
        >
          <Input placeholder="e.g. October 2025" />
        </Form.Item>

        <Form.Item
          name="amount"
          label="Amount"
          rules={[{ required: true, message: "Please enter amount" }]}
        >
          <InputNumber className="w-full" placeholder="Enter amount in ₹" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Add
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default SalaryFormModal;
