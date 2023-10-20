import { DefaultTheme } from "vitepress";
/**
 * 根据文件目录生成侧边栏
 * @param path 需要生成侧边栏的文件目录
 * @param basePath 项目根目录
 * @param ban 忽略的文件夹和文件（文件需要带后缀）
 */
export default function getSidebar(path_: string, basePath: string, ban?: string[]): DefaultTheme.SidebarItem[];
