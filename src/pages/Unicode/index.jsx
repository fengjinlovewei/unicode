import React, { useState, useEffect } from 'react';
import { Select, Modal, List } from 'antd';
import _ from 'underscore';
import axios from 'axios';
import { unicodeToUTF8, unicodeToUTF16, unicodeToUTF32 } from '@/utils';

import Style from './index.module.scss';

const { Option } = Select;
let allItem = [];

export default () => {
  const [page, setPage] = useState(1);
  const [trLine, setTrLine] = useState([]);
  const [font, setFont] = useState([
    'Arial',
    'Microsoft YaHei',
    'STFangsong',
    'SimHei',
    'Microsoft JhengHei',
    'STBaoliSC-Regular',
    'PMingLiu',
    'MingLiu',
    'DFKai-SB',
    'FangSong',
    'KaiTi',
  ]);
  const [fontFamily, setFontFamily] = useState('Arial');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [code, setCode] = useState(0);

  const getclass = (index) => {
    if (index < 128) return 'c1';
    if (index < 2048) return 'c2';
    if (index >= 55296 && index <= 57343) return 'c4';
    if (index >= 57344 && index <= 63743) return 'c5';
    if (index < 65536) return 'c3';
    return 'c6';
  };

  const setItem = (reset) => {
    const currentLine = allItem.splice(0, 100);

    if (currentLine.length > 0) {
      if (reset) {
        setTrLine(currentLine);
      } else {
        setTrLine((item) => [...item, ...currentLine]);
      }
    }
  };

  useEffect(() => {
    axios.defaults.baseURL = 'http://localhost:1991';
    axios
      .get('/font')
      .then(function (response) {
        console.log(response.data);
        if (response.status === 200 || response.status === 304) {
          const data = response.data;
          if (data.code === 0) {
            setFont((item) => [...item, ...data.data]);
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
    const showList = _.throttle(() => {
      //函数体
      const wh = document.body.offsetHeight;
      const dh = document.body.scrollHeight;
      const scrollTop =
        document.documentElement.scrollTop ||
        window.pageYOffset ||
        document.body.scrollTop;

      if (scrollTop + wh + 1000 > dh) {
        setItem();
      }
    }, 100);
    const showLayer = (e) => {
      //console.log(e.target);
    };
    // const getGlobalVerifyFliter = (target) => {
    //   let globalVerify = false;
    //   while (target) {
    //     globalVerify = (target.dataset || {}).globalVerify === 'true';
    //     const tagName = target.tagName || '';
    //     if (globalVerify || tagName.toLowerCase() === 'html') break;
    //     target = target.parentNode;
    //   }
    //   return globalVerify;
    // };
    window.addEventListener('scroll', showList);
    window.addEventListener('click', showLayer);
    return () => {
      allItem = [];
      window.removeEventListener('scroll', showList);
      window.removeEventListener('click', showLayer);
    };
  }, []);

  useEffect(() => {
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
    getPage();
    setItem(true);
  }, [page]);

  const showModal = (code) => {
    console.log(code);
    setCode(code);
    setIsModalVisible(true);
  };

  const contentModal = () => {
    console.log(code);
    const data = [
      <span className={Style['utf-box']}>
        <em>utf-8:</em> <i>{unicodeToUTF8(code).join(',')}</i>
      </span>,
      <span className={Style['utf-box']}>
        <em>utf-16(ucs-2):</em> <i>{unicodeToUTF16(code).join(',')}</i>
      </span>,
      <span className={Style['utf-box']}>
        <em>utf-32(ucs-4):</em> <i>{unicodeToUTF32(code).join(',')}</i>
      </span>,
    ];
    return (
      <List
        size="small"
        bordered
        dataSource={data}
        renderItem={(item) => <List.Item>{item}</List.Item>}
      />
    );
  };
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
            {font.map((item) => (
              <Option value={item} key={item}>
                {item}
              </Option>
            ))}
          </Select>
        </div>
      </div>
      <table
        cellSpacing="0"
        className={Style['box']}
        border="1"
        style={{ fontFamily }}
      >
        <tbody>
          {trLine.map((item, index) => {
            const tdLine = item.map((i) => {
              return (
                <td
                  className={Style[getclass(i)]}
                  key={i}
                  onClick={() => showModal(i)}
                >
                  <i
                    className={Style['char']}
                    dangerouslySetInnerHTML={{ __html: `&#${i}` }}
                  ></i>
                  <em className={Style['char-code']}>{i}</em>
                </td>
              );
            });
            return <tr key={index}>{tdLine}</tr>;
          })}
        </tbody>
      </table>
      <Modal
        title="编码对照表"
        visible={isModalVisible}
        onOk={() => setIsModalVisible(false)}
        onCancel={() => setIsModalVisible(false)}
      >
        <div className={Style['modal-code']} style={{ fontFamily }}>
          <i dangerouslySetInnerHTML={{ __html: `字符：&#${code}` }}></i>
          <em>unicode编码：{code}</em>
        </div>
        {contentModal()}
      </Modal>
    </div>
  );
};
