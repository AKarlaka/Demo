/* CREATE BY yunbaoyuan 2018/02/06 下午13:26:16*/
import React, { PropTypes } from 'react';
import { Form, Modal, Alert, Tree, Spin } from 'antd';

const TreeNode = Tree.TreeNode;

const modal = ({
   visible,
   title,
   modalErr,
   modalWarn,
   modalErrValue,
   shopModalKey,
   loading,
   treeShopData,
   treeShopOption,
   onOk,
   onCancel,
   onCheckShop,
 }) => {
  const loopTree = data => data.map((item) => {
    if (item.children && item.children.length > 0) {
      // 如果还有子树
      return (<TreeNode
        key={item.id}
        title={`${item.name}(${item.childrenNum}家)`}
      >
        {loopTree(item.children)}
      </TreeNode>);
    }
    // 如果没有子树
    return (<TreeNode
      key={`${item.id}&${item.shopid}`}
      title={`${item.name}`}
    />);
  });
  const modalOpts = {
    width: 600,
    title,
    visible,
    onOk,
    onCancel,
    wrapClassName: 'vertical-center-modal',
    confirmLoading: loading,
    key: shopModalKey,
    maskClosable: false,
  };
  return (
    <Modal {...modalOpts}>
      <div style={{ minHeight: 300 }}>
        {modalErr && <Alert message={modalErrValue} type="error" showIcon banner />}
        {modalWarn && <Alert message={modalErrValue} type="warning" showIcon banner />}
        {
          treeShopData.length > 0 ? <Tree
            checkable
            defaultExpandedKeys={[treeShopData[0].id]}
            checkedKeys={treeShopOption.checkedKeys}
            onCheck={onCheckShop}
          >
            {loopTree(treeShopData)}
          </Tree>
            : <div style={{ textAlign: 'center', paddingTop: '25%' }}>
              {!modalWarn && <Spin />}
            </div>
        }
      </div>
    </Modal>
  );
};

modal.propTypes = {
  loading: PropTypes.bool,
  visible: PropTypes.bool,
  modalWarn: PropTypes.bool,
  modalErr: PropTypes.bool,
  title: PropTypes.string,
  modalErrValue: PropTypes.string,
  shopModalKey: PropTypes.string,
  treeShopData: PropTypes.array,
  treeShopOption: PropTypes.object,
  onCheckShop: PropTypes.func,
  onOk: PropTypes.func,
  onCancel: PropTypes.func,
};

export default Form.create()(modal);
