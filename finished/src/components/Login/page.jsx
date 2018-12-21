import React, { PropTypes } from 'react';
import { Button, Row, Form, Input } from 'antd';
import { config } from '../../utils';
import styles from '../../common/login.less';

const FormItem = Form.Item;

const page = ({
                loading,
                username,
                password,
                onLogin,
                form: {
                  getFieldDecorator,
                  validateFields,
                },
              }) => {
  const handleSubmit = () => {
    validateFields({ force: true }, (err, values) => {
      if (!err) {
        onLogin(values);
      }
    });
  };
  return (
    <div className={styles.form}>
      <div className={styles.logo}>
        <span className={styles.imgs} />
        <span>{config.name}</span>
      </div>
      <Form>
        <FormItem hasFeedback>
          {getFieldDecorator('username', {
            initialValue: username,
            rules: [
              {
                required: true,
                message: '请输入用户名',
              },
            ],
          })(<Input onPressEnter={handleSubmit} size="large" placeholder="用户名" />)}
        </FormItem>
        <FormItem hasFeedback>
          {getFieldDecorator('password', {
            initialValue: password,
            rules: [
              {
                required: true,
                message: '请输入密码',
              },
            ],
          })(<Input onPressEnter={handleSubmit} size="large" type="password" placeholder="密码" />)}
        </FormItem>
        <Row>
          <FormItem>
            <Button type="primary" size="large" onClick={handleSubmit} loading={loading}>
            登录
          </Button>
          </FormItem>
          <p>
            <span>{config.footerText}</span>
          </p>
        </Row>

      </Form>
    </div>
  );
};

page.propTypes = {
  loading: PropTypes.bool,
  username: PropTypes.string,
  password: PropTypes.string,
  form: PropTypes.object,
  onLogin: PropTypes.func,
};

export default Form.create()(page);
