/**
 * Create by xiaochenghua on 2018/02/01
 * */

import React, { PropTypes } from 'react';
import Editor from 'react-umeditor';
import { Button, Row, Modal, Spin, message } from 'antd';


const detail = ({
  viewPath,
  loading,
  onCancel,
  onSubmit,
  onChange,
                }) => {
  const NUMBER = 800; // 编辑器输入的最大字符数

  const icons = [
    'source | undo redo | bold italic underline strikethrough fontborder emphasis | ',
    'paragraph fontfamily fontsize | superscript subscript | ',
    'forecolor backcolor | removeformat | insertorderedlist insertunorderedlist | selectall | ',
    'cleardoc  | indent outdent | justifyleft justifycenter justifyright | touppercase tolowercase | ',
    'horizontal date time  | image emotion spechars | inserttable',
  ];
  const uploader = {
    url: '/api/tenant/uploads',
    type: 'local',
    name: 'files',
    request: 'image_src',
  };
  const editorProps = {
    value: viewPath,
    icons,
    plugins: {
      image: {
        uploader,
      },
    },
  };
  // 确定
  const handleOkClick = () => {
    if (viewPath !== '') {
      if (viewPath.length <= NUMBER) {
        onSubmit(viewPath);
      } else {
        message.warning(`内容不能超过${NUMBER}字符！`);
      }
    } else {
      message.warning('内容不能为空');
    }
  };
  // 取消
  const handleCancelClick = () => {
    Modal.confirm({
      content: '即将离开本页面,内容不会被保存，是否继续？',
      okText: '继续',
      cancelText: '取消',
      onOk: onCancel,
    });
  };
  return (
    <div>
      <Spin spinning={loading} >
        <Row className="editor" >
          <Editor {...editorProps} onChange={e => onChange(e)} />
          {
            NUMBER >= viewPath.length ?
              (<div style={{ textAlign: 'right' }}>
                {`最多只能输入${NUMBER}个字符， 剩余${NUMBER - viewPath.length}个`}
              </div>) : (<div style={{ textAlign: 'right' }}>
                {`最多只能输入${NUMBER}个字符， 超出${viewPath.length - NUMBER}个`}
              </div>)
          }
        </Row>
        <Row style={{ marginTop: 8 }}>
          <Button onClick={handleOkClick}>保存</Button>
          <Button style={{ marginLeft: 16 }} onClick={handleCancelClick}>取消</Button>
        </Row>
      </Spin>
    </div>
  );
};

detail.propTypes = {
  viewPath: PropTypes.string,
  loading: PropTypes.bool,
  onChange: PropTypes.func,
  onSubmit: PropTypes.func,
  onCancel: PropTypes.func,
};

export default detail;
