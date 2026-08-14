export type ProjectStatus = 'maintained' | 'community' | 'archived';

export interface Project {
  slug: string;
  name: string;
  eyebrow: string;
  summary: string;
  description: string;
  category: string;
  status: ProjectStatus;
  statusLabel: string;
  accent: string;
  glow: string;
  icon: string;
  image: string;
  upstream: string;
  sourcePath: string;
  guidePath: string;
  architectures: string[];
  tags: string[];
  ports: string[];
  volumes: string[];
  quickStart: string;
  compose?: string;
  notes: string[];
}

export const projects: Project[] = [
  {
    slug: 'maddy',
    name: 'Maddy Mail Server',
    eyebrow: 'Communication stack',
    summary: '一体化、低维护的个人邮件服务器。',
    description: '用一个轻量守护进程替代 Postfix、Dovecot、OpenDKIM 等传统组合，并提供清晰的持久化、TLS 与 DNS 部署路径。',
    category: '通信服务',
    status: 'maintained',
    statusLabel: 'Maintained',
    accent: '#66e3ff',
    glow: 'rgba(62, 207, 255, .24)',
    icon: 'M',
    image: 'enwaiax/maddy',
    upstream: 'https://github.com/foxcpp/maddy',
    sourcePath: 'images/maddy',
    guidePath: 'images/maddy/README.md',
    architectures: ['AMD64', 'ARM64'],
    tags: ['Mail', 'TLS', 'Self-hosted'],
    ports: ['25', '143', '465', '587', '993'],
    volumes: ['maddydata:/data'],
    quickStart: `docker run -d --name maddy \\
  -e MADDY_HOSTNAME=mx1.example.org \\
  -e MADDY_DOMAIN=example.org \\
  -v maddydata:/data \\
  -p 25:25 -p 143:143 -p 465:465 \\
  -p 587:587 -p 993:993 \\
  enwaiax/maddy:latest`,
    compose: 'images/maddy/docker-compose.yml',
    notes: ['部署前确认 25 端口可用', '生产环境必须配置 TLS、SPF、DKIM 与 DMARC', '数据集中保存在 maddydata volume'],
  },
  {
    slug: 'download-bot',
    name: 'Download Bot',
    eyebrow: 'Automation',
    summary: '通过 Telegram 管理下载任务。',
    description: '将 DownloadBot 与可选的 aria2 服务组合起来，适合轻量化远程下载和消息驱动的自动化场景。',
    category: '自动化',
    status: 'community',
    statusLabel: 'Community',
    accent: '#a78bfa',
    glow: 'rgba(167, 139, 250, .24)',
    icon: 'D',
    image: 'enwaiax/download-bot',
    upstream: 'https://github.com/gaowanliang/DownloadBot',
    sourcePath: 'images/download-bot',
    guidePath: 'images/download-bot/README.md',
    architectures: ['AMD64', 'ARM64'],
    tags: ['Telegram', 'aria2', 'Bot'],
    ports: [],
    volumes: ['./config.json:/root/config.json'],
    quickStart: `docker run -itd --restart=on-failure \\
  -v $PWD/config.json:/root/config.json \\
  --name download-bot \\
  enwaiax/download-bot:latest`,
    compose: 'images/download-bot/docker-compose.yml',
    notes: ['启动前需准备 config.json', 'Token 等凭据不要提交到 Git', '可通过 Compose 与 aria2 联合部署'],
  },
  {
    slug: 'netease-cloud-music-tasks',
    name: 'Netease Music Tasks',
    eyebrow: 'Scheduled jobs',
    summary: '面向多账号的网易云音乐定时任务容器。',
    description: '支持签到、云贝任务、定时执行和多种消息推送，并为 AMD64 与 ARM64 环境提供一致的容器运行方式。',
    category: '定时任务',
    status: 'community',
    statusLabel: 'Community',
    accent: '#fb7185',
    glow: 'rgba(251, 113, 133, .22)',
    icon: 'N',
    image: 'enwaiax/netease-cloud-music-tasks',
    upstream: 'https://github.com/chen310/NeteaseCloudMusicTasks',
    sourcePath: 'images/netease-cloud-music-tasks',
    guidePath: 'images/netease-cloud-music-tasks/README.md',
    architectures: ['AMD64', 'ARM64'],
    tags: ['Scheduler', 'Multi-account', 'Notifications'],
    ports: [],
    volumes: ['./config.json:/root/config.json'],
    quickStart: `docker run -itd --restart=on-failure \\
  -v $(pwd)/config.json:/root/config.json \\
  -e SCHEDULER_HOUR=8 \\
  -e SCHEDULER_MINUTE=30 \\
  --name netease-cloud-music-tasks \\
  enwaiax/netease-cloud-music-tasks:latest`,
    notes: ['配置文件可能包含账号凭据', '定时参数按容器时区解释', '请遵守上游服务条款'],
  },
  {
    slug: 'x-ui',
    name: 'X-UI',
    eyebrow: 'Network console',
    summary: '多架构网络面板的容器化部署入口。',
    description: '保留历史部署方案和数据持久化说明。该项目已有独立仓库继续维护，新部署应优先核对独立项目的最新文档。',
    category: '网络工具',
    status: 'archived',
    statusLabel: 'Moved',
    accent: '#fbbf24',
    glow: 'rgba(251, 191, 36, .20)',
    icon: 'X',
    image: 'enwaiax/x-ui',
    upstream: 'https://github.com/vaxilu/x-ui',
    sourcePath: 'images/x-ui',
    guidePath: 'images/x-ui/README.md',
    architectures: ['AMD64', 'ARM64', 'ARMv7', 'ARMv6', 'S390X'],
    tags: ['Panel', 'Network', 'Legacy'],
    ports: ['54321'],
    volumes: ['./db:/etc/x-ui', './cert:/root/cert'],
    quickStart: `docker run -itd --network=host \\
  -v $PWD/db:/etc/x-ui \\
  -v $PWD/cert:/root/cert \\
  --name x-ui --restart=unless-stopped \\
  enwaiax/x-ui:latest`,
    compose: 'images/x-ui/docker-compose.yml',
    notes: ['历史入口，项目已迁往独立仓库', '首次登录后立即修改默认凭据', '开放端口前先配置防火墙'],
  },
  {
    slug: 'firefox-send',
    name: 'Firefox Send',
    eyebrow: 'File sharing',
    summary: 'Mozilla Send 的历史自托管 Compose 配置。',
    description: '用于保留早期自托管文件分享方案和迁移参考。上游项目已归档，不建议在未完成安全评估的情况下用于新生产环境。',
    category: '文件分享',
    status: 'archived',
    statusLabel: 'Archived',
    accent: '#f97316',
    glow: 'rgba(249, 115, 22, .20)',
    icon: 'F',
    image: 'mozilla/send',
    upstream: 'https://github.com/mozilla/send',
    sourcePath: 'images/firefox-send',
    guidePath: 'images/firefox-send/docker-compose.yml',
    architectures: ['AMD64'],
    tags: ['File sharing', 'Legacy', 'Compose'],
    ports: ['1443'],
    volumes: [],
    quickStart: `cd firefox-send
docker compose up -d`,
    compose: 'images/firefox-send/docker-compose.yml',
    notes: ['上游已归档', '仅作为历史方案与迁移参考', '公开部署前必须自行进行安全审计'],
  },
];

export const categories = ['全部', ...new Set(projects.map((project) => project.category))];
