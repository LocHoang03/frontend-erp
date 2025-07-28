import React, { useState } from 'react';
import {
  Form,
  Input,
  Button,
  Card,
  Typography,
  FormInstance,
  Upload,
  Select,
  InputNumber,
  Space,
} from 'antd';
import {
  MinusCircleOutlined,
  PlusOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { Category } from '@/redux/slice/category';
import { Warehouse } from '@/redux/slice/warehouse';

const { Title } = Typography;

interface FormProps {
  onSuccess: () => void;
  form: FormInstance;
  handleSubmitCreate: ({}: any) => void;
  handleSubmitUpdate: ({}: any) => void;
  isLoading: boolean;
  isEdit: boolean;
  dataCategories: Category[];
  dataWarehouses: Warehouse[];
}

const ProductForm: React.FC<FormProps> = ({
  onSuccess,
  form,
  handleSubmitCreate,
  handleSubmitUpdate,
  isLoading,
  isEdit,
  dataCategories,
  dataWarehouses,
}) => {
  const [disabled, setDisabled] = useState<{ [key: number]: any }>({});
  const handleSubmit = (values: any) => {
    const formData = new FormData();

    for (const [key, value] of Object.entries(values)) {
      if (value === undefined || value === null) continue;
      if (key === 'avatar_url') {
        const file = (value as any)?.file?.originFileObj;
        if (file instanceof Blob) {
          formData.append('avatar_url', file);
        }
      } else {
        if (
          typeof value === 'string' ||
          typeof value === 'number' ||
          typeof value === 'boolean'
        ) {
          formData.append(key, value.toString());
        } else {
          formData.append(key, JSON.stringify(value));
        }
      }
    }

    if (!isEdit) handleSubmitCreate(formData);
    else handleSubmitUpdate(formData);
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
          label={`Tên sản phẩm`}
          name="name"
          rules={[
            {
              required: true,
              message: `Vui lòng nhập sản phẩm!`,
            },
          ]}>
          <Input placeholder="Nhập sản phẩm" />
        </Form.Item>

        <Form.Item
          label={`Mô tả`}
          name="description"
          rules={[
            {
              required: true,
              message: `Vui lòng nhập mô tả`,
            },
          ]}>
          <Input placeholder="Nhập mô tả" />
        </Form.Item>

        <Form.Item
          label="Giá sản phẩm"
          name="unit_price"
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập giá',
            },
          ]}>
          <InputNumber
            placeholder="Nhập giá"
            style={{ width: '100%' }}
            min={0}
          />
        </Form.Item>
        <Form.Item
          label="Giá sản phẩm (giá nhập)"
          name="original_price"
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập giá',
            },
          ]}>
          <InputNumber
            placeholder="Nhập giá"
            style={{ width: '100%' }}
            min={0}
          />
        </Form.Item>
        <Form.Item
          label="Đơn vị"
          name="unit"
          rules={[
            { required: true, message: 'Vui lòng chọn đơn vị sản phẩm!' },
          ]}>
          <Select
            placeholder="Chọn đơn vị"
            options={[
              { value: 'cái', label: 'Cái' },
              { value: 'bộ', label: 'Bộ' },
              { value: 'chiếc', label: 'Chiếc' },
              { value: 'cặp', label: 'Cặp' },
              { value: 'hộp', label: 'Hộp' },
              { value: 'túi', label: 'Túi' },
              { value: 'thùng', label: 'Thùng' },
            ]}
          />
        </Form.Item>

        <Form.Item
          label="Ảnh sản phẩm"
          name="avatar_url"
          rules={[
            {
              required: !isEdit ? true : false,
              message: 'Vui lòng chọn file ảnh!',
            },
          ]}>
          <Upload style={{ width: '100%' }}>
            <Button icon={<UploadOutlined />} style={{ width: '100% ' }}>
              Bấm để tải lên
            </Button>
          </Upload>
        </Form.Item>

        <Form.Item
          label="Trạng thái sản phẩm"
          name="status"
          rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}>
          <Select
            placeholder="Chọn trạng thái"
            options={[
              { value: 'Hoạt động', label: 'Hoạt động' },
              { value: 'Không hoạt động', label: 'Không hoạt động' },
            ]}
          />
        </Form.Item>

        <Form.Item
          label="Loại sản phẩm (danh mục)"
          name="category_id"
          rules={[{ required: true, message: 'Vui lòng chọn loại sản phẩm!' }]}>
          <Select
            placeholder="Chọn loại sản phẩm"
            options={(dataCategories as { id: number; name: string }[]).map(
              (r) => ({
                label: r.name,
                value: r.id,
              }),
            )}
          />
        </Form.Item>
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
                      name={[name, 'warehouse_id']}
                      rules={[{ required: true, message: 'Chọn kho!' }]}>
                      <Select
                        onChange={(value) => {
                          setDisabled((prev) => ({
                            ...prev,
                            [key]: value,
                          }));
                        }}
                        placeholder="Chọn kho"
                        options={(
                          dataWarehouses as { id: number; name: string }[]
                        ).map((r) => ({
                          label: r.name,
                          value: r.id,
                          disabled: Object.entries(disabled).some(
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
                    Thêm kho & số lượng
                  </Button>
                </Form.Item>
              </>
            );
          }}
        </Form.List>
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

export default ProductForm;
