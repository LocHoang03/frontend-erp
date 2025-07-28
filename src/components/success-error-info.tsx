import { MessageInstance } from 'antd/es/message/interface';

export const success = (msg: string, messageApi: MessageInstance) => {
  messageApi.open({
    type: 'success',
    content: msg,
    duration: 2.5,
  });
};

export const errors = (msg: string, messageApi: MessageInstance) => {
  messageApi.open({
    type: 'error',
    content: msg,
    duration: 2.5,
  });
};
