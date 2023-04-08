import { CloseOutlined } from '@ant-design/icons';
import { Button, Image, Space } from 'antd';

const ImagePreviewSection = (props: {
  base64ImageUrl: string | null;
  onRemove: () => void;
}) => {
  const { base64ImageUrl, onRemove } = props;

  if (!base64ImageUrl) {
    return null;
  }

  return (
    <Space align="end" style={{ justifyContent: 'end' }}>
      <Image src={base64ImageUrl} width={50} preview />
      <Button
        size="small"
        type="primary"
        danger
        icon={<CloseOutlined />}
        onClick={onRemove}
        shape="circle"
      />
    </Space>
  );
};

export default ImagePreviewSection;
