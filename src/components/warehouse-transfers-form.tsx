import React, { useState } from 'react';
import {
  Form,
  Input,
  Button,
  Card,
  Typography,
  FormInstance,
  Row,
  Select,
  Space,
  InputNumber,
} from 'antd';
import { Warehouse } from '@/redux/slice/warehouse';
import {
  MinusCircleOutlined,
  PlusOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { Product } from '@/redux/slice/product';
const { Title } = Typography;

interface FormProps {
  onSuccess: () => void;
  form: FormInstance;
  handleSubmitCreate: ({}: any) => void;
  handleSubmitUpdate: ({}: any) => void;
  isLoading: boolean;
  isEdit: boolean;
  dataWarehouses: Warehouse[];
  dataProducts: Product[];
  disabled: { [key: string]: any };
  setDisabled: React.Dispatch<React.SetStateAction<{ [key: string]: any }>>;
  disabledProduct: { [key: number]: any };
  setDisabledProduct: React.Dispatch<
    React.SetStateAction<{ [key: number]: any }>
  >;
}

const WarehouseTransferForm: React.FC<FormProps> = ({
  onSuccess,
  form,
  handleSubmitCreate,
  handleSubmitUpdate,
  isLoading,
  isEdit,
  dataWarehouses,
  dataProducts,
  disabled,
  setDisabled,
  disabledProduct,
  setDisabledProduct,
}) => {
  const handleSubmit = (values: any) => {
    const valueEntry = Object.fromEntries(
      Object.entries(values).filter(([_, v]) => v !== undefined),
    );
    if (!isEdit) handleSubmitCreate(valueEntry);
    else handleSubmitUpdate(valueEntry);
  };

  return (
    <Card style={{ maxWidth: 700, margin: '0 auto' }}>
      <Title level={3}>{`${isEdit ? 'Cập nhật ' : 'Thêm '}`}</Title>
      <Form
        layout="vertical"
        form={form}
        onFinish={handleSubmit}
        initialValues={{ is_active: true }}>
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>

        <Form.Item
          label={`Kho chỉ định xuất`}
          name={'from_warehouse_id'}
          rules={[{ required: true, message: 'Chọn kho chỉ định xuất!' }]}>
          <Select
            allowClear
            onChange={(value) => {
              setDisabled((prev) => ({
                ...prev,
                ['from_warehouse_id']: value,
              }));
            }}
            placeholder="Chọn kho"
            options={(dataWarehouses as { id: number; name: string }[]).map(
              (r) => ({
                label: r.name,
                value: r.id,
                disabled: Object.entries(disabled).some(
                  ([k, v]) => String(k) !== 'from_warehouse_id' && v === r.id,
                ),
              }),
            )}
            style={{ width: '100%' }}
          />
        </Form.Item>

        <Form.Item
          label={`Kho chỉ định nhập`}
          name={'to_warehouse_id'}
          rules={[{ required: true, message: 'Chọn kho chỉ định nhập!' }]}>
          <Select
            allowClear
            onChange={(value) => {
              setDisabled((prev) => ({
                ...prev,
                ['to_warehouse_id']: value,
              }));
            }}
            placeholder="Chọn kho"
            options={(dataWarehouses as { id: number; name: string }[]).map(
              (r) => ({
                label: r.name,
                value: r.id,
                disabled: Object.entries(disabled).some(
                  ([k, v]) => String(k) !== 'to_warehouse_id' && v === r.id,
                ),
              }),
            )}
            style={{ width: '100%' }}
          />
        </Form.Item>

        <span>Sản phẩm chỉ định</span>
        <div style={{ marginTop: '10px' }}></div>
        <Form.List name="warehouse_products">
          {(fields, { add, remove }) => {
            return (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space
                    key={key}
                    align="baseline"
                    style={{ display: 'flex', marginBottom: 8 }}>
                    <Form.Item
                      {...restField}
                      name={[name, 'product_id']}
                      rules={[{ required: true, message: 'Chọn sản phẩm!' }]}>
                      <Select
                        showSearch
                        filterOption={(input, option) =>
                          (option?.label as string)
                            .toLowerCase()
                            .includes(input.toLowerCase())
                        }
                        onChange={(value) => {
                          setDisabledProduct((prev) => ({
                            ...prev,
                            [key]: value,
                          }));
                        }}
                        placeholder="Chọn sản phẩm"
                        options={(
                          dataProducts as { id: number; name: string }[]
                        ).map((r) => ({
                          label: r.name,
                          value: r.id,
                          disabled: Object.entries(disabledProduct).some(
                            ([k, v]) => Number(k) !== key && v === r.id,
                          ),
                        }))}
                        style={{ width: 300 }}
                      />
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      name={[name, 'quantity']}
                      rules={[{ required: true, message: 'Nhập số lượng!' }]}>
                      <InputNumber
                        placeholder="Số lượng"
                        min={0}
                        style={{ width: 120 }}
                      />
                    </Form.Item>

                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </Space>
                ))}

                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    icon={<PlusOutlined />}
                    block>
                    Thêm sản phẩm chỉ định
                  </Button>
                </Form.Item>
              </>
            );
          }}
        </Form.List>
        <Form.Item
          label={`Mô tả`}
          name="note"
          rules={[
            {
              required: true,
              message: `Vui lòng nhập mô tả!`,
            },
          ]}>
          <Input placeholder="Nhập mô tả" />
        </Form.Item>

        <Form.Item style={{ textAlign: 'center', marginTop: 30 }}>
          <Button htmlType="submit" type="primary" loading={isLoading}>
            Xác nhận
          </Button>{' '}
          <Button
            htmlType="reset"
            onClick={() => {
              onSuccess();
              form.resetFields();
            }}>
            Hủy bỏ
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default WarehouseTransferForm;
