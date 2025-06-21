import { Tag } from 'antd';

export default function StatusTag({
  status,
  colorMap,
  defaultColor,
}: {
  status: string;
  colorMap: Record<string, string>;
  defaultColor: string;
}) {
  return <Tag color={colorMap[status] || defaultColor}>{status}</Tag>;
}
