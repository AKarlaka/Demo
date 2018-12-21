import React, { PropTypes } from 'react';
import { connect } from 'dva';
import LoginInfo from '../components/Login/page';

const Login = ({ cloudState, dispatch }) => {
  const { username, password } = cloudState.login;
  const loading = cloudState.loading.effects;
  const loginInfo = {
    loading: loading['login/login'],
    username,
    password,
    onLogin(value) {
      dispatch({
        type: 'login/login',
        payload: {
          username: value.username,
          password: value.password,
        },
      });
    },
  };
  return (
    <div>
      <LoginInfo {...loginInfo} />
    </div>
  );
};

Login.propTypes = {
  cloudState: PropTypes.object,
  dispatch: PropTypes.func,
};

function mapStateToProps(cloudState) {
  return { cloudState };
}

export default connect(mapStateToProps)(Login);

