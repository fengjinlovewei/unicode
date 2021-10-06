import React from 'react';
import ascii from '@/static/images/ascii.jpeg';
import Style from './index.module.scss';

export default () => {
  return (
    <div className={Style['box']}>
      <img src={ascii} alt='ascii' />
    </div>
  );
};
