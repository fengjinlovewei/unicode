import React from 'react';
import { useHistory } from 'react-router-dom';
import { routerList } from './router';
import './App.scss';

import { Layout, Radio } from 'antd';

const { Header, Content } = Layout;

function App(props) {
  let { location, push } = useHistory();
  const page =
    location.pathname == '/' ? routerList[0].path : location.pathname;
  const change = e => {
    push(e.target.value);
  };
  return (
    <div className='App'>
      <div className='center'>
        <Radio.Group defaultValue={page} buttonStyle='solid' onChange={change}>
          {routerList.map(item => (
            <Radio.Button value={item.path} key={item.path}>
              {item.title}
            </Radio.Button>
          ))}
        </Radio.Group>
      </div>
      <Layout className='layout'>
        <Content style={{ padding: '20px' }}>{props.children}</Content>
      </Layout>
    </div>
  );
}

export default App;
