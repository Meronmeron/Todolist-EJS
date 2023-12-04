import React from 'react'
import { Spin } from 'antd'

type LoadingProps = {
  size: any
};

const Loading: React.FC<LoadingProps> = ({ size }) => {
  return (
    <Spin tip="" size={size}>
      <div className="" />
    </Spin>
  )
}

export default Loading