# 根据目录生成 sidebar 侧边栏

本插件可以根据目录结构生成 sidebar 侧边栏，支持自定义排序和自动展开。

## 使用方法

```mjs
// config.mjs
import aotoSidebar from "vitepressautosidebar";
export default {
  // ...
  themeConfig: {
    // ...
    sidebar: {
        aotoSidebar(
            // 需要生成侧边栏的目录
            path.join(__dirname, "../"),
            // vitepress 网站的根目录，一般是 ../ 或者 ./
            path.join(__dirname, "../"),
            // 要排除的目录或文件（文件需要带后缀）
            ["测试目录", "临时笔记.md"]
      ),
    },
    // ...
  },
  // ...
};
```

## 生成规则

- `.` 开头的目录和文件不会被生成
- `README.md` 会被作为目录的 `index.html` 文件
- 其他 `.md` 文件会被作为目录的子页面
- `-` 结尾的文件夹不会自动打开
- `\d+.` 开头的目录和文件会按照数字顺序排序，并删除数字和`.`
- 没有文件的目录不会被生成

## 注意事项

- 请不将文件夹命名为 `README` 或 `readme`，否则会被视为 `README.md` 文件

## 配置文件

从 1.1.0 版本开始，为了解决`为了修改顺序而频繁修改文件名导致的相对链接使用麻烦和git文件增加的问题`。支持目录下配置文件，配置文件为 `sidebar.json`。放在某个目录下，当生成该目录的侧边栏时，会受到该配置文件的影响。

```json
{
  // 当前目录名称
  "title": "tital you whant to show",
  // 文件排名
  "arrange": ["doc1", "doc2", "path2"],
  // 是否折叠
  "collapsed": true
}
```

> - 配置文件的优先级高于用过修改文件名控制的侧边栏，因为我更希望你使用侧边栏解决问题，这在相对引用时能减少一些问题。
>
> - 排名的修改时基于之前生成的侧边栏项目的名称，即去掉前面的数字前缀，文件名和 `-` 后缀。
