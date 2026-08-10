export interface Project {
  name: string;
  description: string;
  url: string;
  tags: string[];
  featured: boolean;
}

export const PROJECTS: Project[] = [
  {
    name: 'video-to-live-photo',
    description: '将视频转化为动图的PC程序。',
    url: 'https://github.com/yangzhen-23/video-to-live-photo.git',
    tags: ['Python', '个人开发', ],
    featured: true,
  }
  {
    name: 'Academic-Detective',
    description: '基于公开信息构建证据链、生成学术背景核查报告的开源工具。',
    url: 'https://github.com/yangzhen-23/Academic-Detective',
    tags: ['Python', '学术工具', '数据分析'],
    featured: false,
  },
  {
    name: 'AutoEmailSender',
    description: '面向导师联系场景，覆盖信息抓取、匹配分析、草稿审核与发送跟踪的本地应用。',
    url: 'https://github.com/yangzhen-23/AutoEmailSender',
    tags: ['FastAPI', 'React', 'Agent'],
    featured: false,
  },
  {
    name: 'nature-skills',
    description: '面向科研工作流的可复用 AI Skills 集合，强调可验证过程与可直接使用的产物。',
    url: 'https://github.com/yangzhen-23/nature-skills',
    tags: ['AI Agent', '科研工具', '开源'],
    featured: false,
  },
  {
    name: 'Mineradio',
    description: '融合天气电台、歌词舞台、粒子视觉和 3D 歌单架的 Windows 沉浸式音乐播放器。',
    url: 'https://github.com/yangzhen-23/Mineradio',
    tags: ['Electron', '音乐播放器', '桌面应用'],
    featured: false,
  },
  {
    name: 'MoireDet',
    description: '围绕数字照片摩尔纹检测与 MoireScape 数据集整理的视觉研究代码。',
    url: 'https://github.com/yangzhen-23/MoireDet',
    tags: ['PyTorch', '计算机视觉', '数据集'],
    featured: false,
  },
  {
    name: 'RL_SuperMario',
    description: '基于 Stable-Baselines3 的超级马里奥强化学习入门项目与复现材料。',
    url: 'https://github.com/yangzhen-23/RL_SuperMario',
    tags: ['强化学习', 'Python', 'Stable-Baselines3'],
    featured: false,
  },
];
