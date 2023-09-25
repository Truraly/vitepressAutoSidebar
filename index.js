import fs from 'fs';
import path from 'path';
/**
 * 默认忽略的文件夹和文件
 */
const ban_ = [
    "node_modules",
    ".vitepress",
];
/**
 * 根据文件目录生成侧边栏
 * @param path 需要生成侧边栏的文件目录
 * @param basePath 项目根目录
 * @param ban 忽略的文件夹和文件
 */
export default function getSidebar(path_, basePath, ban = ban_) {
    // console.log("当前文件夹:", path_)
    let sidebarnode = [];
    // 获取文件夹下的所有文件以及文件夹
    let files = fs.readdirSync(path_);
    // 排序
    files.sort((a, b) => {
        // 数字开头优先
        if (/^\d+/.test(a) && !/^\d+/.test(b))
            return -1;
        else if (!/^\d+/.test(a) && /^\d+/.test(b))
            return 1;
        else if (/^\d+/.test(a) && /^\d+/.test(b)) {
            // 数字开头的按数字排序
            return parseInt(a) - parseInt(b);
        }
        else {
            // 其他按字母排序
            return a.localeCompare(b);
        }
    });
    // console.log("排序后:", files)
    // 遍历文件夹
    files.forEach((file) => {
        var _a, _b, _c, _d;
        // 获取文件夹或文件的路径
        let filePath = path.join(path_, file);
        // 获取文件信息
        let stat = fs.statSync(filePath);
        // 判断是否为文件夹
        if (stat.isDirectory()) {
            // 是否hidden开头
            if (file.indexOf(".") == 0) {
                return;
            }
            // 判断是否为忽略的文件夹
            if (ban.indexOf(file) == -1) {
                // 获取子文件夹和文件
                let sidebar__ = getSidebar(filePath, basePath, ban);
                // 如果子文件夹和文件为空,则不添加
                if (sidebar__.length == 0)
                    return;
                // console.log("sidebar__", sidebar__)
                // 生成sidebar对象
                let obj = {
                    items: sidebar__,
                    // 如果文件夹名以-结尾,则折叠
                    collapsed: /\-$/.test(file)
                };
                obj.text = file.replace(/\-$/, "").replace(/^\d+\./, "");
                // console.log("obj", obj)
                // console.log("obj.items", obj.items)
                // 查询是否有READMD.md
                let readmd = (_a = obj.items) === null || _a === void 0 ? void 0 : _a.find((item) => { return item.text == "README" || item.text == "readme"; });
                // console.log("readmd", readmd)
                // 如果有
                if (readmd) {
                    // console.log(readmd)
                    // 将文件夹名和文件夹路径添加到sidebarnode中
                    obj.link = readmd.link;
                    obj.text += "(README)";
                    // 如果只有一个README
                    if (((_b = obj.items) === null || _b === void 0 ? void 0 : _b.length) == 1) {
                        // 删除items
                        delete obj.items;
                    }
                    else {
                        // 删除README
                        (_c = obj.items) === null || _c === void 0 ? void 0 : _c.splice((_d = obj.items) === null || _d === void 0 ? void 0 : _d.indexOf(readmd), 1);
                    }
                }
                // 将文件夹名和文件夹路径添加到sidebarnode中
                sidebarnode.push(obj);
            }
        }
        else {
            // 判断是否为忽略的文件
            if (ban.indexOf(file) == -1) {
                // 获取文件后缀
                let extname = path.extname(filePath);
                // 是否为hidden开头
                if (file.indexOf(".") == 0) {
                    return;
                }
                // 判断是否为md文件
                if (extname == ".md") {
                    // 获取文件名
                    let filename = path.basename(filePath, extname);
                    // 将文件名和文件路径添加到sidebar中
                    sidebarnode.push({
                        text: filename.replace(/^\d+\./, ""),
                        link: filePath.replace(basePath, "").replace(".md", "")
                    });
                }
            }
        }
    });
    return sidebarnode;
}
