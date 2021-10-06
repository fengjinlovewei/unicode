import React from 'react';

import iso_8859_1 from '@/static/images/iso_8859_1.jpeg';

import Style from './index.module.scss';

export default () => {
  return (
    <div className={Style['box']}>
      <img src={iso_8859_1} alt='iso-8859-1' />
    </div>
  );
};
