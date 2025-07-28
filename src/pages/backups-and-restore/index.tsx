import React, { useState } from 'react';
import { Button, Upload, message, Card, Space } from 'antd';
import { CloudDownloadOutlined, CloudUploadOutlined } from '@ant-design/icons';
import axios from 'axios';

const BackupRestorePage = ({ data }: { data: any[] }) => {
  const [loading, setLoading] = useState(false);
  const [restoring, setRestoring] = useState(false);

  const handleBackup = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BACKEND_URL}/database/backup`,
        {},
        { withCredentials: true },
      );
      const fileName = res.data;

      const downloadRes = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BACKEND_URL}/database/download/${fileName}`,
        {
          responseType: 'blob',
        },
      );

      const url = window.URL.createObjectURL(new Blob([downloadRes.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      message.success('Backup thành công!');
    } catch (err) {
      message.error('Backup thất bại');
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (file: File) => {
    setRestoring(true);

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_BACKEND_URL}/database/restore`,
        { fileName: file.name },
      );
      message.success('Restore thành công!');
    } catch (err) {
      console.error(err);
      message.error('Restore thất bại');
    } finally {
      setRestoring(false);
    }
  };

  return (
    <Card
      title="Sao lưu và phục hồi cơ sở dữ liệu"
      style={{ maxWidth: 600, margin: 'auto' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Button
          loading={loading}
          type="primary"
          icon={<CloudDownloadOutlined />}
          onClick={handleBackup}>
          Sao lưu cơ sở dữ liệu
        </Button>

        <Upload
          beforeUpload={(file) => {
            handleRestore(file);
            return false;
          }}
          showUploadList={false}>
          <Button
            type="dashed"
            icon={<CloudUploadOutlined />}
            loading={restoring}>
            Phục hồi cơ sở dữ liệu
          </Button>
        </Upload>
      </Space>
    </Card>
  );
};

export default BackupRestorePage;
