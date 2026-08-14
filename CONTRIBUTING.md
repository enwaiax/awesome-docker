# Contributing to Awesome Docker

感谢你帮助维护这个多架构 Docker 项目集合。目标不是收录尽可能多的镜像，而是提供**可理解、可验证、可恢复**的部署方案。

## 推荐新项目

提交 Issue，并至少说明：

- 上游仓库及其许可证；
- 项目解决的问题和适合的使用场景；
- 计划支持的架构；
- 为什么上游现有镜像不能满足需求；
- 持久化数据、端口及主要安全边界。

## 提交镜像

每个项目目录应包含：

```text
images/<project>/
├── Dockerfile
├── docker-compose.yml   # 如果适合 Compose 部署
├── README.md
└── config/              # 仅放不含凭据的示例配置
```

README 至少说明：

1. 上游项目和许可证；
2. 镜像地址、Tag 与支持架构；
3. 快速启动和 Compose 示例；
4. 端口、Volume、环境变量；
5. 默认凭据和首次启动后的安全操作；
6. 备份、恢复和升级方式；
7. 已知限制及维护状态。

## 本地验证

```bash
# 验证 Compose 文件
docker compose -f <project>/docker-compose.yml config

# 构建当前架构镜像
docker build -t awesome-docker/<project>:test <project>

# 验证网站
cd site
npm ci
npm run check
npm run build
```

不要在提交中包含 Token、Cookie、私钥、真实域名凭据或账号配置。

## 生命周期

网站使用三种状态：

- **Maintained**：持续验证，适合新部署；
- **Community**：仍可使用，但依赖社区和上游维护；
- **Archived / Moved**：仅保留迁移或历史参考，不建议新部署。

上游停止维护、存在未解决的高风险漏洞，或镜像长期无法构建时，应降级状态而不是静默保留。
