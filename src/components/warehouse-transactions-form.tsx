import React from 'react';
import {
  Form,
  Input,
  Button,
  Card,
  Typography,
  FormInstance,
  Select,
  Space,
  InputNumber,
} from 'antd';
import { Warehouse } from '@/redux/slice/warehouse';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Product } from '@/redux/slice/product';
import { Partner } from '@/redux/slice/partner';
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
  dataPartner: Partner[];
  disabledProduct: { [key: number]: any };
  setDisabledProduct: React.Dispatch<
    React.SetStateAction<{ [key: number]: any }>
  >;
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
}

const WarehouseTransactionForm: React.FC<FormProps> = ({
  onSuccess,
  form,
  handleSubmitCreate,
  handleSubmitUpdate,
  isLoading,
  isEdit,
  dataWarehouses,
  dataProducts,

  disabledProduct,
  setDisabledProduct,
  value,
  setValue,
  dataPartner,
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
          label={`Loại phiếu`}
          name="type"
          rules={[
            {
              required: true,
              message: `Vui lòng chọn loại phiếu!`,
            },
          ]}>
          <Select
            onSelect={(value) => setValue(value)}
            placeholder="Chọn loại phiếu"
            options={[
              { value: 'Nhập kho', label: 'Nhập kho' },
              { value: 'Xuất kho', label: 'Xuất kho' },
            ]}
          />
        </Form.Item>

        {value !== '' && (
          <Form.Item
            label={`Kho chỉ định ${value === 'Xuất kho' ? 'xuất' : 'nhập'}`}
            name={'warehouse_id'}
            rules={[
              {
                required: true,
                message: `Chọn kho chỉ định ${
                  value === 'Xuất kho' ? 'xuất' : 'nhập'
                }!`,
              },
            ]}>
            <Select
              allowClear
              placeholder="Chọn kho"
              options={(dataWarehouses as { id: number; name: string }[]).map(
                (r) => ({
                  label: r.name,
                  value: r.id,
                }),
              )}
              style={{ width: '100%' }}
            />
          </Form.Item>
        )}

        <Form.Item
          label={`Đối tác`}
          name={'partner_id'}
          rules={[
            {
              required: true,
              message: `Chọn đối tác!`,
            },
          ]}>
          <Select
            allowClear
            placeholder="Chọn đối tác"
            options={(dataPartner as { id: number; name: string }[]).map(
              (r) => ({
                label: r.name,
                value: r.id,
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

export default WarehouseTransactionForm;
