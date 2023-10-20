import { DefaultTheme } from "vitepress";
import fs from "fs";
import path from "path";

/**
 * 默认忽略的文件夹和文件
 */
const ban_ = ["node_modules", ".vitepress"];

/**
 * 根据文件目录生成侧边栏
 * @param path 需要生成侧边栏的文件目录
 * @param basePath 项目根目录
 * @param ban 忽略的文件夹和文件（文件需要带后缀）
 */
export default function getSidebar(
  path_: string,
  basePath: string,
  ban: string[] = []
): DefaultTheme.SidebarItem[] {
  // 添加默认忽略的文件夹和文件
  ban.push(...ban_);
  // console.log("当前文件夹:", path_)
  let sidebarnode: DefaultTheme.SidebarItem[] = [];
  // 获取文件夹下的所有文件以及文件夹
  let files: string[] = fs.readdirSync(path_);

  files
    // 过滤文件夹和文件
    .filter((file: string) => {
      if (file.indexOf(".") === 0) return false;
      if (ban.some((item: string) => file.indexOf(item) != -1)) return false;
      return true;
    })
    // 排序
    .sort((a, b) => {
      // 数字开头优先
      if (/^\d+/.test(a) && !/^\d+/.test(b)) return -1;
      else if (!/^\d+/.test(a) && /^\d+/.test(b)) return 1;
      else if (/^\d+/.test(a) && /^\d+/.test(b)) {
        // 数字开头的按数字排序
        return parseInt(a) - parseInt(b);
      } else {
        // 其他按字母排序
        return a.localeCompare(b);
      }
    })
    // 遍历文件夹
    .forEach((file: string) => {
      // console.log("当前文件:", file);
      // 获取文件夹或文件的路径
      let filePath = path.join(path_, file);
      // 获取文件信息
      let stat = fs.statSync(filePath);
      // 判断是否为文件夹
      if (stat.isDirectory()) {
        // 获取子文件夹和文件
        let sidebar__ = getSidebar(filePath, basePath, ban);
        // 如果子文件夹和文件为空,则不添加
        if (sidebar__.length === 0) return;
        // 生成sidebar对象
        let obj: DefaultTheme.SidebarItem = {
          items: sidebar__,
          // 如果文件夹名以-结尾,则折叠
          collapsed: /\-$/.test(file),
        };
        //
        obj.text = file.replace(/\-$/, "").replace(/^\d+\./, "");
        // 查询是否有READMD.md
        let readmd = obj.items?.find((item: DefaultTheme.SidebarItem) => {
          return item.text === "README" || item.text === "readme";
        });
        // 如果有
        if (readmd) {
          // 将文件夹名和文件夹路径添加到sidebarnode中
          obj.link = readmd.link;
          obj.text += "(README)";
          // 删除README
          obj.items?.splice(obj.items?.indexOf(readmd), 1);
        }

        // 查询目录下是否有sidebar.json
        let flist = fs.readdirSync(filePath);
        // console.log("flist", flist)
        // 如果有sidebar.json
        if (flist.indexOf("sidebar.json") != -1) {
          //   console.log("有sidebar.json");
          try {
            // 读取sidebar.json
            let sidebarjson = fs.readFileSync(
              path.join(filePath, "sidebar.json"),
              "utf-8"
            );
            // 将sidebar.json转为对象
            let sidebarjson_ = JSON.parse(sidebarjson);
            // 如果有配置的title,则使用配置的title
            obj.text = sidebarjson_.title || obj.text;
            if (Array.isArray(sidebarjson_.arrange)) {
              // 按照配置的顺序排序
              obj.items?.sort((a, b) => {
                let indexa = sidebarjson_.arrange?.indexOf(a.text);
                let indexb = sidebarjson_.arrange?.indexOf(b.text);
                if (indexa === -1) indexa = 999;
                if (indexb === -1) indexb = 999;
                return indexa - indexb;
              });
            }
            // console.log("sidebarjson_", sidebarjson_);
            // 如果有配置的collapsed,则使用配置的collapsed
            obj.collapsed =
              (sidebarjson_.collapsed === true ? true : false) || obj.collapsed;
          } catch (e) {
            console.log(e);
          }
            // console.log("obj", obj);
        }

        // 将文件夹名和文件夹路径添加到sidebarnode中
        // sidebarnode.push(obj);
      } else {
        // 获取文件后缀
        let extname = path.extname(filePath);
        // 判断是否为md文件
        if (extname === ".md") {
          // 获取文件名
          let filename = path.basename(filePath, extname);
          // 将文件名和文件路径添加到sidebar中
          sidebarnode.push({
            text: filename.replace(/^\d+\./, ""),
            link: filePath.replace(basePath, "").replace(".md", ""),
          });
        }
      }
    });
  return sidebarnode;
}
