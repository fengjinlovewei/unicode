// export function unicodeToUTF8(unicode) {
//   unicode = +unicode;
//   if (unicode >= 0x00000000 && unicode <= 0x0000007f) {
//     return unicode.toString(2).padStart(8, '0');
//   } else if (unicode >= 0x00000080 && unicode <= 0x000007ff) {
//     /**
//      * 0x00000080 = 128, 0x000007ff = 2047
//      * 2进制的编码格式为 110xxxxx 10xxxxxx （高5位x + 低6位x）
//      * 以 unicode 300 为例，它在这个区间
//      * 300 = 2进制 100101100
//      *
//      * 取高5位步骤
//      *
//      * 第一步：100101100 & 11111000000 (0x7c0)
//      * 是取 100 101100 的大于6位的2进制的值，因为这部分的值要放在 高5位 110xxxxx
//      * 得 100 000000，
//      * 第二步：然后 >>6 ，目的是去掉后面的低6位，得 100，
//      * 第三步：然后 | 0xc0啥意思？
//      * 0xc0 = 11000000（110xxxxx）相当于高5位的 的字节，
//      * 100 | 11000000 相当于把100放在高5位的占位符中，得 110000100，高位字节确定
//      * 第四步：<< 8，是为了给第六位留出占位空间 得 110000100 00000000
//      *
//      * 取低6位步骤
//      *
//      * 第一步：100101100 & 111111 (0x03f)
//      * 取出后6为的值，得 101100
//      * 第二步：| 10000000（0x80），目的补全低6位字节，得 10101100
//      *
//      * 最后 r1 | r2，目的合并两个字节，
//      * 110000100 00000000 ｜ 10101100 = 110000100 10101100
//      * 所以，unicode 300 对应的utf8的2进制为
//      *
//      * 110000100 10101100
//      *
//      *
//      */
//     const r1 = (((unicode & 0x7c0) >> 6) | 0xc0) << 8;
//     const r2 = (unicode & 0x03f) | 0x80;
//     const s = r1 | r2;
//     return s.toString(2);
//   } else if (unicode >= 0x00000800 && unicode <= 0x0000ffff) {
//     const r1 = (((unicode & 0xf000) >> 12) | 0xe0) << 16;
//     const r2 = (((unicode & 0x0fc0) >> 6) | 0x80) << 8;
//     const r3 = (unicode & 0x003f) | 0x80;
//     const s = r1 | r2 | r3;
//     return s.toString(2);
//   } else if (unicode >= 0x00010000 && unicode <= 0x0010ffff) {
//     // 由于位运算的结果值是32位有符号整数，8位2进制 在<< 24位超过了31位，
//     // 32位一定为1，所以结果就是负值了，故此行代码在js中行不通。
//     // const r1 = (((unicode & 0x1c0000) >> 18) | 0xf0) << 24;
//     const r1 = ((unicode & 0x1c0000) >> 18) | 0xf0;
//     const r2 = (((unicode & 0x03f000) >> 12) | 0x80) << 16;
//     const r3 = (((unicode & 0x000fc0) >> 6) | 0x80) << 8;
//     const r4 = (unicode & 0x00003f) | 0x80;
//     const s = r2 | r3 | r4;
//     return r1.toString(2) + s.toString(2);
//   } else {
//     return false;
//   }
// }

export function unicodeToUTF8(unicode) {
  unicode = +unicode;
  if (unicode >= 0x0000d800 && unicode <= 0x0000dfff) {
    return ['代理区域'];
  }
  if (unicode >= 0x00000000 && unicode <= 0x0000007f) {
    return [unicode.toString(2).padStart(8, '0')];
  } else if (unicode >= 0x00000080 && unicode <= 0x000007ff) {
    /**
     * 0x00000080 = 128, 0x000007ff = 2047
     * 2进制的编码格式为 110xxxxx 10xxxxxx （高5位x + 低6位x）
     * 以 unicode 300 为例，它在这个区间
     * 300 = 2进制 100101100
     *
     * 取高5位步骤
     *
     * 第一步：100101100 & 11111000000 (0x7c0)
     * 是取 100 101100 的大于6位的2进制的值，因为这部分的值要放在 高5位 110xxxxx
     * 得 100 000000，
     * 第二步：然后 >>6 ，目的是去掉后面的低6位，得 100，
     * 第三步：然后 | 0xc0啥意思？
     * 0xc0 = 11000000（110xxxxx）相当于高5位的 的字节，
     * 100 | 11000000 相当于把100放在高5位的占位符中，得 110000100，高位字节确定
     * 第四步：<< 8，是为了给第六位留出占位空间 得 110000100 00000000
     *
     * 取低6位步骤
     *
     * 第一步：100101100 & 111111 (0x03f)
     * 取出后6为的值，得 101100
     * 第二步：| 10000000（0x80），目的补全低6位字节，得 10101100
     *
     * 最后 r1 | r2，目的合并两个字节，
     * 110000100 00000000 ｜ 10101100 = 110000100 10101100
     * 所以，unicode 300 对应的utf8的2进制为
     *
     * 110000100 10101100
     *
     *
     */
    const r1 = ((unicode & 0x7c0) >> 6) | 0xc0; //<< 8;
    const r2 = (unicode & 0x03f) | 0x80;
    return [r1.toString(2), r2.toString(2)];
  } else if (unicode >= 0x00000800 && unicode <= 0x0000ffff) {
    const r1 = ((unicode & 0xf000) >> 12) | 0xe0; // << 16;
    const r2 = ((unicode & 0x0fc0) >> 6) | 0x80; // << 8;
    const r3 = (unicode & 0x003f) | 0x80;
    return [r1.toString(2), r2.toString(2), r3.toString(2)];
  } else if (unicode >= 0x00010000 && unicode <= 0x0010ffff) {
    // 由于位运算的结果值是32位有符号整数，8位2进制 在<< 24位超过了31位，
    // 32位一定为1，所以结果就是负值了，故此行代码在js中行不通。
    // const r1 = (((unicode & 0x1c0000) >> 18) | 0xf0) << 24;
    const r1 = ((unicode & 0x1c0000) >> 18) | 0xf0;
    const r2 = ((unicode & 0x03f000) >> 12) | 0x80; // << 16;
    const r3 = ((unicode & 0x000fc0) >> 6) | 0x80; // << 8;
    const r4 = (unicode & 0x00003f) | 0x80;
    return [r1.toString(2), r2.toString(2), r3.toString(2), r4.toString(2)];
  } else {
    return [];
  }
}

function spliceByte(str) {
  let i = str.length - 1;
  let s = '';
  const arr = [];
  while (i >= 0) {
    s = str[i--] + s;
    // 如果为8位，或者没有字符了，添加数组头部
    if (s.length === 8 || i < 0) {
      arr.unshift(s);
      s = '';
    }
  }
  return arr;
}

export function unicodeToUTF16(unicode) {
  unicode = +unicode;
  // 如果在代理区域
  if (unicode >= 0x0000d800 && unicode <= 0x0000dfff) {
    return ['代理区域'];
  }
  // 如果在第一平面
  if (unicode >= 0x00000000 && unicode <= 0x0000ffff) {
    const r = unicode.toString(2).padStart(16, '0');
    return spliceByte(r);
  }
  // 如果在辅助平面
  if (unicode >= 0x00010000 && unicode <= 0x0010ffff) {
    const Vx = unicode - 0x10000;
    /**
     * 0xffc00 = 1111111111 0000000000
     * 0x3ff = 1111111111
     *
     */
    const Vh = (Vx & 0xffc00) >> 10;
    const Vl = Vx & 0x3ff;

    const w1 = Vh | 0xd800;
    const w2 = Vl | 0xdc00;

    const w = w1.toString(2) + w2.toString(2);

    return spliceByte(w);
  }
  return [];
}

export function unicodeToUTF32(unicode) {
  unicode = +unicode;
  // 如果在代理区域
  if (unicode >= 0x0000d800 && unicode <= 0x0000dfff) {
    return ['代理区域'];
  }
  if (unicode >= 0x00000000 && unicode <= 0x0010ffff) {
    const r = unicode.toString(2).padStart(32, '0');
    return spliceByte(r);
  }
  return [];
}
