import React, { useState, useEffect, useRef } from 'react';
import { Input, Table, Layout, Select } from 'antd';
import _ from 'underscore';
import axios from 'axios';
import Style from './index.module.scss';

const { Option } = Select;
let allItem = [];

export default () => {
  const [page, setPage] = useState(1);
  const [trLine, setTrLine] = useState([]);
  const [font, setFont] = useState([]);
  const [fontFamily, setFontFamily] = useState('Arial');

  const getclass = index => {
    if (index < 128) return 'c1';
    if (index < 2048) return 'c2';
    if (index >= 55296 && index <= 57343) return 'c4';
    if (index >= 57344 && index <= 63743) return 'c5';
    if (index < 65536) return 'c3';
    return 'c6';
  };

  const setItem = reset => {
    const currentLine = allItem.splice(0, 50);

    if (currentLine.length > 0) {
      if (reset) {
        setTrLine(currentLine);
      } else {
        setTrLine(item => [...item, ...currentLine]);
      }
    }
  };

  useEffect(() => {
    axios.defaults.baseURL = 'http://localhost:1991';
    axios.get('/font').then(function (response) {
      console.log(response.data);
      if (response.status == 200 || response.status == 304) {
        const data = response.data;
        if (data.code === 0) {
          setFont(data.data);
        }
      }
      console.log(response.status);
      console.log(response.statusText);
      console.log(response.headers);
      console.log(response.config);
    });
    const showList = _.throttle(() => {
      //函数体
      const wh = document.body.offsetHeight;
      const dh = document.body.scrollHeight;
      const scrollTop =
        document.documentElement.scrollTop ||
        window.pageYOffset ||
        document.body.scrollTop;

      if (scrollTop + wh + 200 > dh) {
        setItem();
      }
    }, 100);
    window.addEventListener('scroll', showList);
    return () => {
      allItem = [];
      window.removeEventListener('scroll', showList);
    };
  }, []);

  const getPage = () => {
    const tip = 65536;
    let i = (page - 1) * tip;
    const len = page * tip;
    let all = [];
    let line = [];
    for (; i < len; i++) {
      line.push(i);
      if (line.length === 32) {
        all.push(line);
        line = [];
      }
    }
    allItem = all;
  };

  useEffect(() => {
    getPage();
    setItem(true);
  }, [page]);

  return (
    <div>
      <div className={Style['select-box']}>
        <div className={Style['select-box-item']}>
          <span>选择平面：</span>
          <Select defaultValue={page} onChange={setPage}>
            {Array(17)
              .fill()
              .map((item, i) => (
                <Option value={i + 1} key={i}>
                  第{i + 1}平面
                </Option>
              ))}
          </Select>
        </div>
        <div className={Style['select-box-item']}>
          <span>选择font-family：</span>
          <Select
            showSearch
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            defaultValue={fontFamily}
            onChange={setFontFamily}
            style={{ width: 200 }}
          >
            {font.map(item => (
              <Option value={item} key={item}>
                {item}
              </Option>
            ))}
          </Select>
        </div>
      </div>

      <table
        cellSpacing='0'
        className={Style['box']}
        border='1'
        style={{ fontFamily }}
      >
        <tbody>
          {trLine.map((item, index) => {
            const tdLine = item.map(i => {
              return (
                <td className={Style[getclass(i)]} key={i}>
                  <div dangerouslySetInnerHTML={{ __html: `&#${i}` }}></div>
                  <p>{i}</p>
                </td>
              );
            });
            return <tr key={index}>{tdLine}</tr>;
          })}
        </tbody>
      </table>
    </div>
  );
};
