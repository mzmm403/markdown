# monorepo

## 传统架构的痛点

- 独立的项目结构，所有项目都是分开的github仓库
- 技术栈独立
- 规范化、自动化相关处理是项目间的隔离
- 依赖管理，版本很难统一管理
- 部署，docker、docker-compose，自动化脚本很难形成统一

## monorepo架构的优点

- 混合项目结构，所有相关的工程形成子包进行管理
- 技术栈高度统一
- 规范化、自动化、流程化项目间共享
- 依赖管理，版本统一管理
- 部署，docker、docker-compose，自动化脚本统一部署流程

## monorepo架构方案

- 包管理：**pnpm workspace**、yarn workspace、lerna
- 构建缓存： 
- 增量构建： nx、**turbo**


### pnpm的优势

> 相比于npm、yarn、cnpm

- 软连接机制
- 缓存机制，寻址
- 并行安装
- 拍平结构，不依赖地域(flat)
- 原生支持workspaces
- 磁盘占用少

**其实就是用中心化思想解决依赖复用问题**


## 传统架构到monorepo架构的演进

### 整体思路

- 阶段1：传统架构基础痛点(主要矛盾)
    - 代码先集中化，将多个关联项目统一到一个github仓库
    - 工具引入, pnpm workspace
    - CI/CD 重构
- 阶段2：具体monorepo架构
    - 公共模块抽离
    - pnpm、trubo 解决子包和主包的关系
- 阶段3：自动化构建流程优化
    - 打包方案, **vite**、webapck、**rollup**、esbuild、tsup、swc
    - 构建流程优化，依赖关系(循环依赖引用)、那些包需要前置构建
    - 发布，npm publish、docker镜像
    - 监控和测试

### 关键性卡点(步骤)

1. 项目统一
2. pnpm 配置
3. 依赖管理
4. 统一脚本
    - 工程化脚本：package.json 中的 scripts
    - scripts 文件夹