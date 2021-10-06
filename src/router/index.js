import React, { Component } from 'react';
import { HashRouter as Router, Route, Redirect } from 'react-router-dom';
import CacheRoute, { CacheSwitch } from 'react-router-cache-route';

import App from '../App';
import ASCII from '@/pages/ASCII';
import ISO_8859_1 from '@/pages/ISO_8859_1';
import GB2312 from '@/pages/GB2312';
import Unicode from '@/pages/Unicode';

//import IEEEdoc from '@/pages/IEEEdoc';

export const routerList = [
  {
    path: '/ASCII',
    title: 'ASCII',
    component: ASCII,
    cache: true,
  },
  {
    path: '/ISO_8859_1',
    title: 'ISO_8859_1',
    component: ISO_8859_1,
    cache: true,
  },
  {
    path: '/GB2312',
    title: 'GB2312',
    component: GB2312,
    cache: true,
  },
  {
    path: '/Unicode',
    title: 'Unicode',
    component: Unicode,
    cache: false,
  },
  // {
  //   path: '/IEEEdoc',
  //   title: 'IEEE754-2008文档',
  //   component: IEEEdoc,
  //   cache: false,
  // },
];
export default class IRouter extends Component {
  render() {
    return (
      <Router>
        <App>
          <CacheSwitch>
            {routerList.map(item => {
              const R = item.cache ? CacheRoute : Route;
              return (
                <R
                  path={item.path}
                  key={item.path}
                  component={item.component}
                />
              );
            })}
            <Redirect from='/*' to={routerList[0].path} />
          </CacheSwitch>
        </App>
      </Router>
    );
  }
}
