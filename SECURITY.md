# Security Policy

## Supported projects

安全支持范围以网站和项目 README 中的生命周期状态为准：

- **Maintained**：接受镜像构建、配置与部署文档相关的安全报告；
- **Community**：尽力处理，但不承诺响应时间；
- **Archived / Moved**：不再提供安全保证，应迁移到活跃上游或替代方案。

第三方应用本身的漏洞应同时报告给对应上游。本仓库主要负责容器封装、默认配置、构建流程和部署说明。

## Reporting a vulnerability

请通过 GitHub 的 **Security → Report a vulnerability** 私下报告，不要在公开 Issue 中提交漏洞细节、凭据或可直接利用的 PoC。

报告建议包含：

- 受影响的项目、镜像 Tag 和架构；
- Docker / Compose 版本和最小复现步骤；
- 影响范围及是否需要特殊配置；
- 建议修复或缓解措施（如有）。

如果仓库尚未启用 Private vulnerability reporting，请联系仓库维护者并只提供摘要，等待安全沟通渠道确认。

## Deployment responsibility

这些镜像按“原样”提供。公开部署前请自行完成：

- 修改默认密码和 Token；
- 配置最小化端口与防火墙；
- 使用 TLS；
- 备份并验证恢复流程；
- 对 Archived 项目执行额外安全评估。
