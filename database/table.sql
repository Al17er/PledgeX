CREATE TABLE IF NOT EXISTS `web3_core` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL COMMENT '项目/实体名称',
  `category` VARCHAR(50) NOT NULL COMMENT '一级分类（如技术基础设施层）',
  `sub_category` VARCHAR(50) NOT NULL COMMENT '二级分类（如节点运营商）',
  `tags` JSON DEFAULT NULL COMMENT '动态标签（JSON数组）',
  `description` TEXT COMMENT '简介与功能描述',
  `official_url` VARCHAR(255) DEFAULT NULL COMMENT '官网链接',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_category_sub` (`category`, `sub_category`),
  INDEX `idx_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `web3_attributes` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `core_id` INT UNSIGNED NOT NULL COMMENT '关联核心表ID',
  `attribute_key` VARCHAR(50) NOT NULL COMMENT '扩展属性名（如节点类型）',
  `attribute_val` JSON NOT NULL COMMENT '属性值（JSON格式）',
  PRIMARY KEY (`id`),
  FOREIGN KEY (`core_id`) REFERENCES `web3_core`(`id`) ON DELETE CASCADE,
  INDEX `idx_core_key` (`core_id`, `attribute_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE IF NOT EXISTS `web3_content` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(200) NOT NULL COMMENT '文章标题',
    `content` TEXT NOT NULL COMMENT '文章内容',
    `author_id` VARCHAR(64) NOT NULL COMMENT '作者',
    `publish_time` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `update_time` DATETIME ON UPDATE CURRENT_TIMESTAMP, -- 自动更新时间
    `content_type` VARCHAR(20) NOT NULL DEFAULT 'article' COMMENT '内容类型',
    `category` VARCHAR(50) COMMENT '内容分类',
    `tags` VARCHAR(255) COMMENT '内容标签',
    `related_project` VARCHAR(100) COMMENT '关联的 Web3 项目',
    `chain` VARCHAR(50) COMMENT '区块链名称', -- 增大长度
    `source_type` VARCHAR(20) NOT NULL DEFAULT 'original' COMMENT '来源类型',
    `original_url` VARCHAR(2048) COMMENT '原文链接', -- 增大长度
    `source_platform` VARCHAR(50) COMMENT '来源平台',
    `view_count` INT DEFAULT 0 COMMENT '浏览量',
    `upvote_count` INT DEFAULT 0 COMMENT '点赞数',
    `status` VARCHAR(20) NOT NULL DEFAULT 'draft' COMMENT '状态',
    `cover_image` VARCHAR(512) COMMENT '封面图链接', -- 可选增大长度
    `language` VARCHAR(10) DEFAULT 'en' COMMENT '内容语言',
    PRIMARY KEY (`id`) -- 显式定义主键
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- 技术基础设施层
INSERT INTO `web3_core` (`name`, `category`, `sub_category`, `tags`, `description`, `official_url`) VALUES
('Infura', '技术基础设施层', '节点运营商', '["RPC","API","Ethereum"]', '为以太坊和IPFS提供企业级节点服务', 'https://infura.io'),
('Alchemy', '技术基础设施层', '节点运营商', '["Web3 API","多链支持","开发者工具"]', '面向开发者的区块链节点和API平台', 'https://alchemy.com'),
('QuickNode', '技术基础设施层', '节点运营商', '["多链节点","数据分析","Web3工具"]', '高速区块链节点基础设施服务商', 'https://quicknode.com'),
('Chainstack', '技术基础设施层', '节点运营商', '["企业级节点","私有链部署","监控工具"]', '企业级区块链节点托管平台', 'https://chainstack.com'),
('Pocket Network', '技术基础设施层', '节点运营商', '["去中心化节点","代币激励","多链"]', '去中心化的中继协议网络', 'https://pokt.network');

INSERT INTO `web3_core` (`name`, `category`, `sub_category`, `tags`, `description`, `official_url`) VALUES
('Celestia', '技术基础设施层', '数据可用性层', '["模块化区块链","数据可用性","Rollup"]', '模块化区块链网络，专注数据可用性', 'https://celestia.org'),
('Avail', '技术基础设施层', '数据可用性层', '["数据验证","轻客户端","多链"]', 'Polygon推出的数据可用性解决方案', 'https://availproject.org'),
('EigenDA', '技术基础设施层', '数据可用性层', '["以太坊扩容","Rollup","DA层"]', '基于EigenLayer的DA服务', 'https://eigenda.xyz'),
('Arweave', '技术基础设施层', '数据可用性层', '["永久存储","去中心化存储","数据共识"]', '永久存储数据的区块链协议', 'https://arweave.org'),
('StarkEx', '技术基础设施层', '数据可用性层', '["ZK-Rollup","数据压缩","扩容"]', 'StarkWare的扩容引擎，支持Validium模式', 'https://starkware.co/starkex');

-- 中间件与工具层
INSERT INTO `web3_core` (`name`, `category`, `sub_category`, `tags`, `description`, `official_url`) VALUES
('Chainlink', '中间件与工具层', '预言机', '["去中心化预言机","价格馈送","VRF"]', '去中心化预言机网络', 'https://chain.link'),
('Pyth Network', '中间件与工具层', '预言机', '["低延迟","金融数据","Solana"]', '高性能金融数据预言机', 'https://pyth.network'),
('Band Protocol', '中间件与工具层', '预言机', '["跨链数据","DeFi","API集成"]', '跨链去中心化预言机', 'https://bandprotocol.com'),
('API3', '中间件与工具层', '预言机', '["第一方预言机","DAO治理","Airnode"]', '基于第一方数据的预言机网络', 'https://api3.org'),
('UMA', '中间件与工具层', '预言机', '["Optimistic预言机","争议解决","合成资产"]', 'Optimistic预言机协议', 'https://uma.xyz');


-- 应用层
INSERT INTO `web3_core` (`name`, `category`, `sub_category`, `tags`, `description`, `official_url`) VALUES
('Uniswap', '应用层', 'DeFi', '["DEX","AMM","流动性挖矿"]', '以太坊上最大的去中心化交易所', 'https://uniswap.org'),
('Aave', '应用层', 'DeFi', '["借贷","闪电贷","抵押"]', '开源流动性协议支持借贷与收益', 'https://aave.com'),
('Compound', '应用层', 'DeFi', '["借贷","利率市场","治理"]', '算法驱动的货币市场协议', 'https://compound.finance'),
('Curve Finance', '应用层', 'DeFi', '["稳定币交易","低滑点","DAO治理"]', '专注稳定币兑换的AMM协议', 'https://curve.fi'),
('dYdX', '应用层', 'DeFi', '["永续合约","杠杆交易","StarkEx"]', '去中心化衍生品交易平台', 'https://dydx.exchange');


INSERT INTO `web3_core` (`name`, `category`, `sub_category`, `tags`, `description`, `official_url`) VALUES
('OpenSea', '应用层', 'NFT', '["NFT市场","多链支持","ERC-721"]', '全球最大的NFT交易市场', 'https://opensea.io'),
('Rarible', '应用层', 'NFT', '["创作者经济","DAO治理","版税"]', '社区驱动的NFT交易平台', 'https://rarible.com'),
('Art Blocks', '应用层', 'NFT', '["生成艺术","链上生成","策展"]', '链上生成艺术NFT平台', 'https://artblocks.io'),
('Bored Ape Yacht Club', '应用层', 'NFT', '["PFP","社区","IP授权"]', '标志性猿猴头像NFT系列', 'https://boredapeyachtclub.com'),
('Blur', '应用层', 'NFT', '["专业交易","聚合器","空投"]', '面向专业交易者的NFT市场', 'https://blur.io');


INSERT INTO `web3_core` (`name`, `category`, `sub_category`, `tags`, `description`, `official_url`) VALUES
('Axie Infinity', '应用层', 'GameFi', '["P2E","NFT宠物","SLP代币"]', '边玩边赚的区块链游戏', 'https://axieinfinity.com'),
('The Sandbox', '应用层', 'GameFi', '["虚拟地产","UGC","SAND代币"]', '元宇宙土地与游戏创作平台', 'https://sandbox.game'),
('STEPN', '应用层', 'GameFi', '["Move2Earn","运动激励","Solana"]', '通过运动赚取代币的Web3应用', 'https://stepn.com'),
('Illuvium', '应用层', 'GameFi', '["AAA游戏","NFT收藏","自动战斗"]', '高画质开放世界链游', 'https://illuvium.io'),
('DeFi Kingdoms', '应用层', 'GameFi', '["DEX","RPG","跨链"]', '结合DeFi与像素RPG的游戏', 'https://defikingdoms.com');


INSERT INTO `web3_core` (`name`, `category`, `sub_category`, `tags`, `description`, `official_url`) VALUES
('Lens Protocol', '应用层', 'SocialFi', '["去中心化社交","NFT身份","内容货币化"]', '由Aave团队构建的社交图谱协议', 'https://lens.xyz'),
('Farcaster', '应用层', 'SocialFi', '["去中心化推特","身份主权","链上社交"]', '基于以太坊的社交协议', 'https://farcaster.xyz'),
('Galxe', '应用层', 'SocialFi', '["凭证网络","忠诚度计划","OAT"]', 'Web3凭证数据网络', 'https://galxe.com'),
('Matters Lab', '应用层', 'SocialFi', '["去中心化写作","IPFS存储","LikeCoin"]', '基于区块链的内容创作社区', 'https://matters.town'),
('Friend.tech', '应用层', 'SocialFi', '["社交代币化","Base链","Keys交易"]', '通过代币化社交关系的平台', 'https://friend.tech');

-- 生态支持与治理层
INSERT INTO `web3_core` (`name`, `category`, `sub_category`, `tags`, `description`, `official_url`) VALUES
('Aragon', '生态支持与治理层', 'DAO平台', '["去中心化治理","模板化DAO","ANT代币"]', '开箱即用的DAO创建与管理平台', 'https://aragon.org'),
('Snapshot', '生态支持与治理层', 'DAO平台', '["链下投票","多链支持","Gas免费"]', '去中心化治理的链下投票工具', 'https://snapshot.org'),
('DAOhaus', '生态支持与治理层', 'DAO平台', '["Moloch框架","社区金库","提案管理"]', '基于Moloch框架的DAO协作平台', 'https://daohaus.club'),
('Colony', '生态支持与治理层', 'DAO平台', '["任务管理","声誉系统","代币化"]', '模块化DAO协作与任务分配平台', 'https://colony.io'),
('Tally', '生态支持与治理层', 'DAO平台', '["治理仪表盘","提案追踪","多协议支持"]', 'DAO治理分析与执行平台', 'https://tally.xyz');

INSERT INTO `web3_core` (`name`, `category`, `sub_category`, `tags`, `description`, `official_url`) VALUES
('Boardroom', '生态支持与治理层', '治理工具', '["治理聚合","提案通知","投票分析"]', '多协议治理信息聚合平台', 'https://boardroom.info'),
('Sybil', '生态支持与治理层', '治理工具', '["治理委托","投票权映射","DAO工具"]', '治理委托与投票权管理工具', 'https://sybil.org'),
('Kleros', '生态支持与治理层', '治理工具', '["争议解决","去中心化仲裁","陪审员激励"]', '基于区块链的争议解决协议', 'https://kleros.io'),
('Commonwealth', '生态支持与治理层', '治理工具', '["论坛集成","提案讨论","链上执行"]', '链上治理讨论与执行平台', 'https://commonwealth.im'),
('Vocdoni', '生态支持与治理层', '治理工具', '["匿名投票","ZK证明","抗审查"]', '注重隐私的链上投票协议', 'https://vocdoni.io');

INSERT INTO `web3_core` (`name`, `category`, `sub_category`, `tags`, `description`, `official_url`) VALUES
('Gitcoin Grants', '生态支持与治理层', '资助计划', '["二次方融资","社区资助","匹配池"]', '通过二次方融资支持公共物品', 'https://gitcoin.co/grants'),
('MolochDAO', '生态支持与治理层', '资助计划', '["以太坊生态","Grants","会员制"]', '以太坊生态项目的早期资助DAO', 'https://molochdao.com'),
('Uniswap Grants', '生态支持与治理层', '资助计划', '["开发者资助","社区提案","UNI代币"]', 'Uniswap生态开发者资助计划', 'https://uniswap.org/grants'),
('Optimism RetroPGF', '生态支持与治理层', '资助计划', '["追溯性资助","公共物品","OP代币"]', 'Optimism生态的追溯性公共物品资助', 'https://optimism.io/retropgf'),
('Seed Club', '生态支持与治理层', '资助计划', '["社区加速器","社交代币","DAO孵化"]', 'Web3社区项目的加速器计划', 'https://seedclub.xyz');

INSERT INTO `web3_core` (`name`, `category`, `sub_category`, `tags`, `description`, `official_url`) VALUES
('Collab.Land', '生态支持与治理层', '社区管理工具', '["代币门控","Discord集成","NFT验证"]', '基于代币持有权的社区管理工具', 'https://collab.land'),
('Guild', '生态支持与治理层', '社区管理工具', '["角色管理","多链支持","任务奖励"]', 'Web3社区角色与权限管理平台', 'https://guild.xyz'),
('Coordinape', '生态支持与治理层', '社区管理工具', '["贡献者奖励","同伴评价","DAO薪酬"]', '去中心化团队薪酬分配工具', 'https://coordinape.com'),
('SourceCred', '生态支持与治理层', '社区管理工具', '["贡献量化","信誉积分","激励分配"]', '基于贡献量化的社区激励协议', 'https://sourcecred.io'),
('Discord', '生态支持与治理层', '社区管理工具', '["社区聊天","机器人集成","Web3插件"]', 'Web3社区广泛使用的聊天平台', 'https://discord.com');

-- 市场与传播层
INSERT INTO `web3_core` (`name`, `category`, `sub_category`, `tags`, `description`, `official_url`) VALUES
('CryptoInfluencer Capital', '市场与传播层', 'KOL机构', '["NFT","DeFi","AMA"]', '聚合头部加密 KOL 的 MCN 机构，旗下签约分析师覆盖 10 种语言市场', 'https://crypto-influencer.capital'),
('AlphaLeak Network', '市场与传播层', 'KOL机构', '["Alpha","社区驱动","空投"]', '以提前泄露项目方未公开信息为特色的 KOL 联盟，擅长制造市场 FOMO 情绪', 'https://alphaleak.xyz'),
('Metaverse Voices', '市场与传播层', 'KOL机构', '["元宇宙","虚拟形象","VR"]', '专注元宇宙领域的内容创作者联盟，为虚拟土地和数字商品提供流量支持', NULL),
('Asia Whale Club', '市场与传播层', 'KOL机构', '["亚太市场","交易所合作","AMA"]', '面向亚洲市场的加密意见领袖网络，与三大交易所保持战略合作关系', 'https://asia-whale.club'),
('DeFi Thought Leaders', '市场与传播层', 'KOL机构', '["DeFi 2.0","治理代币","流动性挖矿"]', '聚焦去中心化金融领域的专业分析师团体，定期发布协议深度研报', 'https://defi-tl.org');

INSERT INTO `web3_core` (`name`, `category`, `sub_category`, `tags`, `description`, `official_url`) VALUES
('Blockchain Daily', '市场与传播层', '行业媒体', '["新闻快讯","项目评测","监管动态"]', '提供 24/7 区块链行业即时新闻的多语种媒体平台', 'https://blockchaindaily.io'),
('The DAO Times', '市场与传播层', '行业媒体', '["DAO治理","社区投票","国库管理"]', '专注去中心化自治组织生态的垂直媒体，跟踪主要 DAO 的治理提案', 'https://daotimes.news'),
('MemeWatch', '市场与传播层', '行业媒体', '["Meme币","文化现象","社交趋势"]', '追踪加密市场 Meme 文化传播的另类媒体，设有社区情绪指数', NULL),
('ZK Journal', '市场与传播层', '行业媒体', '["零知识证明","隐私技术","学术研究"]', '聚焦隐私保护技术的专业媒体，定期发布 zk-SNARKs 等协议进展', 'https://zkjournal.tech'),
('APAC Crypto Pulse', '市场与传播层', '行业媒体', '["亚洲监管","本地化内容","交易所动态"]', '专注亚太地区区块链政策与市场动向的区域性媒体', 'https://apacryptopulse.com');

INSERT INTO `web3_core` (`name`, `category`, `sub_category`, `tags`, `description`, `official_url`) VALUES
('Digital Asset Ventures', '市场与传播层', '投资机构', '["早期投资","协议层","基础设施"]', '管理规模超 2 亿美元的风投基金，重点布局 Layer1/Layer2 赛道', 'https://dav.fund'),
('SocialFi Growth Fund', '市场与传播层', '投资机构', '["社交图谱","创作者经济","代币化"]', '专项投资 SocialFi 应用的基金，已投项目包括去中心化社交协议', 'https://socialfi.growth'),
('Metaverse Capital Group', '市场与传播层', '投资机构', '["虚拟土地","数字身份","VR/AR"]', '元宇宙主题投资基金，同时运营虚拟地产开发工作室', NULL),
('Liquidity Mining Partners', '市场与传播层', '投资机构', '["流动性即服务","做市策略","代币经济学"]', '提供流动性引导服务的特殊基金，采用动态对冲策略', 'https://lmp.capital'),
('RegTech Investors Alliance', '市场与传播层', '投资机构', '["合规技术","链上分析","监管科技"]', '专注区块链合规解决方案的投资联盟，成员包括传统金融机构', 'https://rtia.org');

-- AI与Web3融合的参与者
INSERT INTO `web3_core` (`name`, `category`, `sub_category`, `tags`, `description`, `official_url`) VALUES
('AegisAI', 'AI与Web3融合的参与者', 'AI模型协议', '["机器学习", "智能合约"]', 'AegisAI 提供基于区块链的分布式机器学习模型训练与推理服务，支持智能合约直接调用AI预测结果。', 'https://aegis.ai'),
('NeuroChain', 'AI与Web3融合的参与者', 'AI模型协议', '["联邦学习", "去中心化AI"]', 'NeuroChain 是专为隐私保护设计的AI模型协议，通过联邦学习实现多节点协作训练。', 'https://neurochain.ai'),
('Cognetrix', 'AI与Web3融合的参与者', 'AI模型协议', '["自然语言处理", "DAO治理"]', 'Cognetrix 提供开源的自然语言处理模型库，并通过DAO社区进行模型迭代优化。', 'https://cognetrix.org'),
('DeepLedger', 'AI与Web3融合的参与者', 'AI模型协议', '["深度学习", "模型验证"]', 'DeepLedger 将深度学习模型训练过程上链，确保模型版本的可追溯性和审计透明性。', 'https://deepledger.tech'),
('OracleMind', 'AI与Web3融合的参与者', 'AI模型协议', '["预测市场", "动态定价"]', 'OracleMind 为DeFi协议提供AI驱动的动态定价预言机服务，优化市场流动性。', 'https://oraclemind.io');

INSERT INTO `web3_core` (`name`, `category`, `sub_category`, `tags`, `description`, `official_url`) VALUES
('DataSphere', 'AI与Web3融合的参与者', 'AI数据服务', '["数据市场", "去中心化存储"]', 'DataSphere 构建基于IPFS的AI训练数据交易市场，支持数据贡献者获得代币激励。', 'https://datasphere.net'),
('VeriData', 'AI与Web3融合的参与者', 'AI数据服务', '["数据标注", "质量验证"]', 'VeriData 通过共识机制验证AI训练数据的质量，确保数据集真实可靠。', 'https://veridata.xyz'),
('ChainMetrics', 'AI与Web3融合的参与者', 'AI数据服务', '["链上分析", "行为预测"]', 'ChainMetrics 提供区块链交易数据的AI分析服务，帮助识别市场趋势。', 'https://chainmetrics.ai'),
('AIStream', 'AI与Web3融合的参与者', 'AI数据服务', '["实时数据", "流处理"]', 'AIStream 为机器学习模型提供实时链上数据流处理基础设施。', 'https://aistream.io'),
('TrustOracle', 'AI与Web3融合的参与者', 'AI数据服务', '["数据溯源", "零知识证明"]', 'TrustOracle 使用zk-SNARKs技术实现AI训练数据的可验证来源追溯。', 'https://trustoracle.net');

INSERT INTO `web3_core` (`name`, `category`, `sub_category`, `tags`, `description`, `official_url`) VALUES
('DeFiCortex', 'AI与Web3融合的参与者', 'AI+DeFi应用', '["风险管理", "收益优化"]', 'DeFiCortex 利用强化学习算法为流动性提供者动态优化资金分配策略。', 'https://cortexdefi.com'),
('AlgoFi', 'AI与Web3融合的参与者', 'AI+DeFi应用', '["算法交易", "套利检测"]', 'AlgoFi 提供AI驱动的自动化DeFi套利机器人，支持多链DEX聚合。', 'https://algofi.org'),
('HedgeAI', 'AI与Web3融合的参与者', 'AI+DeFi应用', '["衍生品定价", "波动率预测"]', 'HedgeAI 通过深度学习模型为去中心化衍生品市场提供动态定价方案。', 'https://hedgeai.finance'),
('Predictron', 'AI与Web3融合的参与者', 'AI+DeFi应用', '["预测市场", "社会情绪分析"]', 'Predictron 结合社交媒体数据和链上行为预测加密货币价格走势。', 'https://predictron.ai'),
('YieldMind', 'AI与Web3融合的参与者', 'AI+DeFi应用', '["收益聚合", "风险评估"]', 'YieldMind 使用图神经网络分析DeFi协议间的关联风险，优化收益组合。', 'https://yieldmind.com');

-- 跨领域整合者
INSERT INTO `web3_core` (`name`, `category`, `sub_category`, `tags`, `description`, `official_url`) VALUES 
('EntWeb3 Hub', '跨领域整合者', '娱乐+Web3', '["NFTs", "Metaverse"]', 'A platform that integrates entertainment with Web3 technologies through NFTs and virtual worlds.', 'http://entweb3hub.com'),
('GameFi Studios', '跨领域整合者', '娱乐+Web3', '["GameFi", "Blockchain Gaming"]', 'Studio focusing on creating blockchain-based games that offer real-world value to players.', 'http://gamefistudios.com'),
('MusicChain', '跨领域整合者', '娱乐+Web3', '["Music Streaming", "Smart Contracts"]', 'Decentralized music streaming platform empowering artists through smart contracts.', 'http://musicchain.net'),
('FanToken Alliance', '跨领域整合者', '娱乐+Web3', '["Fan Tokens", "Sports"]', 'Enabling sports teams and clubs to create their own fan tokens for enhanced engagement.', 'http://fantokenalliance.org'),
('ArtistryDAO', '跨领域整合者', '娱乐+Web3', '["Digital Art", "DAO"]', 'A decentralized autonomous organization dedicated to supporting digital artists in the Web3 space.', 'http://artistrydao.art');

INSERT INTO `web3_core` (`name`, `category`, `sub_category`, `tags`, `description`, `official_url`) VALUES 
('EcoEnergy Network', '跨领域整合者', '能源+Web3', '["Renewable Energy", "Carbon Credits"]', 'Network focused on integrating renewable energy sources with blockchain technology for trading carbon credits.', 'http://ecoenergynetwork.green'),
('GridPlus', '跨领域整合者', '能源+Web3', '["Smart Grids", "Decentralization"]', 'Building decentralized smart grids to optimize energy distribution and consumption.', 'http://gridplus.energy'),
('PowerLedger', '跨领域整合者', '能源+Web3', '["Peer-to-Peer Energy Trading", "Transparency"]', 'Platform enabling peer-to-peer energy trading using blockchain for transparency and efficiency.', 'http://powerledger.io'),
('GreenToken Initiative', '跨领域整合者', '能源+Web3', '["Sustainability", "Tokens"]', 'Initiative to promote sustainability through the issuance of green tokens representing renewable energy investments.', 'http://greentokeninitiative.com'),
('SolarDAO', '跨领域整合者', '能源+Web3', '["Solar Power", "Community Funding"]', 'A DAO aimed at funding solar power projects around the world using community contributions.', 'http://solardao.world');

INSERT INTO `web3_core` (`name`, `category`, `sub_category`, `tags`, `description`, `official_url`) VALUES 
('PlayToEarn Universe', '跨领域整合者', '游戏+Web3', '["Play-to-Earn", "Gaming Economy"]', 'An ecosystem where gamers can earn cryptocurrency by playing games and contributing to the gaming economy.', 'http://playtoearnuniverse.games'),
('MetaQuests', '跨领域整合者', '游戏+Web3', '["MMORPG", "Virtual Economies"]', 'A massive multiplayer online role-playing game built on blockchain, featuring a complex virtual economy.', 'http://metaquests.online'),
('BlockBattle Arena', '跨领域整合者', '游戏+Web3', '["Competitive Gaming", "Blockchain"]', 'Arena where competitive gamers can battle it out, earning rewards based on their performance.', 'http://blockbattlearena.com'),
('CryptoCrafters', '跨领域整合者', '游戏+Web3', '["Crafting", "Digital Assets"]', 'Platform allowing users to craft and trade digital assets within a blockchain-powered crafting universe.', 'http://cryptocrafters.net'),
('GameGuilds', '跨领域整合者', '游戏+Web3', '["Guilds", "Collaborative Gaming"]', 'Facilitating collaborative gaming experiences through guilds that operate across various blockchain games.', 'http://gameguilds.org');

-- 区域生态共建者
INSERT INTO `web3_core` (`name`, `category`, `sub_category`, `tags`, `description`, `official_url`) VALUES 
('AsiaWeb3Union', '区域生态共建者', '亚洲联盟', '["区块链", "合作"]', '促进亚洲地区Web3项目的合作与发展。', 'https://asiaweb3union.com'),
('ChinaWeb3Bridge', '区域生态共建者', '亚洲联盟', '["中国", "桥梁"]', '连接中国与亚洲其他地区的Web3资源。', 'https://chinaweb3bridge.net'),
('JapanWeb3Hub', '区域生态共建者', '亚洲联盟', '["日本", "中心"]', '日本Web3创新和交流的核心平台。', 'https://japanweb3hub.org'),
('KoreaChainAlliance', '区域生态共建者', '亚洲联盟', '["韩国", "链盟"]', '推动韩国区块链技术发展的联盟组织。', 'https://koreachainalliance.io'),
('SoutheastAsiaWeb3', '区域生态共建者', '亚洲联盟', '["东南亚", "发展"]', '支持东南亚国家Web3项目的发展。', 'https://southeastasiaweb3.asia');

INSERT INTO `web3_core` (`name`, `category`, `sub_category`, `tags`, `description`, `official_url`) VALUES 
('EuroBlockchainNet', '区域生态共建者', '欧洲联盟', '["欧洲", "区块链"]', '连接欧洲各国区块链项目的网络。', 'https://euroblockchainnet.eu'),
('FranceWeb3Initiative', '区域生态共建者', '欧洲联盟', '["法国", "倡议"]', '法国Web3生态系统的发展倡议。', 'https://franceweb3initiative.fr'),
('GermanyCryptoAlliance', '区域生态共建者', '欧洲联盟', '["德国", "加密"]', '德国加密货币和区块链技术联盟。', 'https://germanycryptoalliance.de'),
('UKWeb3Community', '区域生态共建者', '欧洲联盟', '["英国", "社区"]', '英国Web3开发者和技术爱好者的社区。', 'https://ukweb3community.uk'),
('NordicWeb3Federation', '区域生态共建者', '欧洲联盟', '["北欧", "联邦"]', '北欧国家间Web3项目的联合体。', 'https://nordicweb3federation.nordic');

INSERT INTO `web3_core` (`name`, `category`, `sub_category`, `tags`, `description`, `official_url`) VALUES 
('USWeb3Council', '区域生态共建者', '北美联盟', '["美国", "委员会"]', '美国Web3行业的主要监管和倡导机构。', 'https://usweb3council.us'),
('CanadaBlockchainOrg', '区域生态共建者', '北美联盟', '["加拿大", "区块链"]', '加拿大的区块链技术和应用推广组织。', 'https://canadablockchain.org'),
('MexicoWeb3Alliance', '区域生态共建者', '北美联盟', '["墨西哥", "联盟"]', '促进墨西哥及其周边国家Web3技术的应用和发展。', 'https://mexicoweb3alliance.mx'),
('NorthAmericaWeb3Summit', '区域生态共建者', '北美联盟', '["北美", "峰会"]', '年度会议，汇集了北美Web3领域的领导者。', 'https://northamericaweb3summit.com'),
('SiliconValleyWeb3Lab', '区域生态共建者', '北美联盟', '["硅谷", "实验室"]', '专注于Web3技术创新的研究实验室。', 'https://siliconvalleyweb3lab.tech');



INSERT INTO `web3_attributes` (`core_id`, `attribute_key`, `attribute_val`) VALUES
-- 技术基础设施层/节点运营商
(1, 'node_specs', '{"supported_chains": ["Ethereum", "IPFS"], "node_type": "全节点", "api_endpoint": "JSON-RPC", "auth_method": "API Key", "sla": "99.9% uptime", "pricing_model": {"free_tier": true, "pay_as_you_go": true}}'),
(2, 'node_specs', '{"supported_chains": ["Ethereum", "Polygon", "Arbitrum"], "node_type": "存档节点", "api_endpoint": "GraphQL", "auth_method": "OAuth", "sla": "99.95% uptime", "pricing_model": {"starter": "$0/月", "growth": "$49/月"}}'),
(3, 'node_specs', '{"supported_chains": ["Bitcoin", "Solana", "Avalanche"], "node_type": "验证节点", "api_endpoint": "REST API", "auth_method": "JWT", "sla": "99.99% uptime", "throughput": "10k RPS"}'),

-- 数据可用性层
(6, 'da_properties', '{"data_layers": ["共识层", "存储层"], "throughput": "1.5 MB/s", "erasure_coding": true, "sampling_support": true, "data_commitment": "多项式承诺"}'),
(9, 'storage_specs', '{"storage_type": "永久存储", "data_replication": 100, "incentive_model": "AR代币奖励", "data_retrieval_speed": "1s/100KB"}'),

-- 中间件/预言机
(11, 'oracle_specs', '{"data_sources": ["300+交易所"], "update_frequency": "按区块更新", "price_feeds": ["BTC/USD", "ETH/USD"], "offchain_workers": 1200, "onchain_aggregator": "AggregatorV3Interface"}'),
(12, 'oracle_specs', '{"latency": "200ms", "data_providers": ["高盛", "Jump Trading"], "coverage": ["美股", "加密货币", "大宗商品"], "verification_method": "多方签名"}'),

-- DeFi应用
(16, 'dex_properties', '{"amm_type": "恒定乘积", "swap_fee": "0.3%", "liquidity_pools": 15000, "factory_contract": "0x5C69...b374"}'),
(17, 'lending_specs', '{"collateral_factors": {"ETH": 0.8, "WBTC": 0.7}, "flash_loan_fee": "0.09%", "interest_model": "动态利率", "reserve_factor": "0.15"}'),

-- NFT市场
(21, 'nft_specs', '{"supported_standards": ["ERC721", "ERC1155"], "royalty_support": true, "curation_method": "社区投票", "gas_optimization": "批量交易"}'),
(24, 'nft_properties', '{"collection_size": 10000, "mint_price": "0.08 ETH", "metadata_storage": "IPFS", "rarity_traits": 7}'),

-- GameFi
(26, 'gamefi_properties', '{"game_engine": "Unity", "tokenomics": {"SLP": "效用代币", "AXS": "治理代币"}, "land_sale": {"total_parcels": 90000, "avg_price": "3 ETH"}, "breeding_mechanics": true}'),
(28, 'move2earn', '{"step_validation": "GPS+运动传感器", "shoe_nft": {"types": ["Walker", "Runner"], "mint_cost": "5 SOL"}, "energy_system": "每天20能量"}'),

-- SocialFi
(31, 'social_graph', '{"profile_nft": true, "follow_module": "代币门控", "mirror_mechanism": "收藏分成", "content_storage": "Arweave"}'),
(34, 'content_platform', '{"article_format": "Markdown", "tipping_token": "LIKE", "censorship_resistance": "IPFS+ENS", "cross_posting": ["Mirror", "Medium"]}'),

-- DAO平台
(36, 'dao_framework', '{"voting_types": ["代币加权", "二次方投票"], "treasury_management": ["Gnosis Safe", "多签"], "proposal_system": "流式投票", "module_store": true}'),
(38, 'governance_params', '{"voting_period": "7天", "quorum": "4%", "ragequit_enabled": true, "guild_kick": "社区仲裁"}'),

-- 治理工具
(41, 'voting_analytics', '{"voter_turnout": "35%", "delegation_ratio": "42%", "proposal_success_rate": "68%", "cross_dao_analysis": ["Uniswap", "Compound"]}'),
(44, 'dispute_resolution', '{"jury_selection": "随机抽签", "staking_requirements": "500 PNK", "appeal_process": "3轮仲裁", "case_duration": "平均14天"}'),

-- 资助计划
(46, 'funding_mechanics', '{"matching_pool": "$2M/季度", "quadratic_funding": true, "retroactive_funding": false, "grant_stages": ["提案", "社区投票", "里程碑审核"]}'),
(49, 'accelerator_program', '{"duration": "12周", "mentorship": ["a16z", "Coinbase Ventures"], "demo_day": "链上直播", "funding_range": "$50k-$200k"}'),

-- 社区工具
(51, 'community_features', '{"discord_bot": true, "token_gating": ["ERC20", "ERC721"], "quest_engine": "自动奖励分发", "analytics_dashboard": ["成员活跃度", "代币分布"]}'),
(54, 'reputation_system', '{"score_calculation": ["贡献频率", "同行评价"], "soulbound_token": true, "rewards_multiplier": "最高3倍", "decay_rate": "每月2%"}'),

-- KOL机构
(56, 'kol_metrics', '{"total_reach": "850万", "top_channels": ["YouTube", "Twitter Spaces"], "campaign_pricing": {"AMA": "1-3 ETH", "项目评测": "5-15 ETH"}, "engagement_rate": "4.7%"}'),
(58, 'alpha_groups', '{"membership_fee": "0.5 ETH/月", "exclusive_signals": "每天3-5条", "wallet_tracking": "聪明钱地址", "sniping_tool": "预售机器人"}'),

-- 行业媒体
(61, 'media_stats', '{"monthly_uv": "120万", "newsletter_subscribers": "28万", "content_types": ["深度报道", "项目AMA", "监管动态"], "syndication_partners": ["CoinDesk", "Decrypt"]}'),
(63, 'zk_research', '{"academic_partners": ["ETH Zurich", "Stanford"], "zkp_types": ["Groth16", "Plonk"], "benchmarks": {"proof_gen": "15s", "verification": "200ms"}}'),

-- 投资机构
(66, 'investment_focus', '{"stage": ["种子轮", "A轮"], "check_size": "$500k-$5M", "portfolio_size": 75, "sectors": ["L1/L2", "DeFi", "ZK基础设施"]}'),
(69, 'liquidity_provision', '{"strategies": ["动态做市", "无常损失对冲"], "managed_pools": 23, "performance_fee": "20%", "risk_parameters": {"max_drawdown": "15%"}}'),

-- AI协议
(71, 'ai_model', '{"framework": "TensorFlow", "privacy_preserving": ["联邦学习", "同态加密"], "onchain_inference": true, "model_governance": "DAO投票"}'),
(74, 'data_marketplace', '{"data_types": ["图像数据集", "金融时序数据"], "pricing_model": "按需付费", "quality_control": ["数据验证节点", "信誉评分"], "volume_stats": {"daily_transactions": "1.2万"}}'),

-- DeFi+AI应用
(76, 'defi_ai', '{"strategy_parameters": {"risk_tolerance": 0.3, "slippage_control": "动态阈值"}, "performance_metrics": {"APY": "18-24%", "sharpe_ratio": 2.1}, "rebalancing_frequency": "每小时"}'),
(79, 'prediction_engine', '{"data_sources": ["链上交易", "社交媒体情绪", "宏观指标"], "model_accuracy": "73.5%", "ensemble_methods": ["LSTM", "Transformer"]}'),

-- 跨领域整合者
(81, 'entertainment_features', '{"virtual_events": ["演唱会", "艺术展览"], "nft_tickets": true, "royalty_split": "智能合约自动分配", "interoperability": ["Decentraland", "Sandbox"]}'),
(84, 'energy_trading', '{"p2p_marketplace": true, "smart_meter_integration": ["LoRaWAN", "5G"], "carbon_credits": {"issuance": "ERC1155", "retirement_tracking": "链上证明"}}'),

-- 区域生态
(86, 'regional_focus', '{"key_markets": ["日本", "韩国"], "localization": ["多语言支持", "法币通道"], "regulatory_compliance": ["FSA注册", "旅行规则"]}'),
(94, 'na_ecosystem', '{"incubation_programs": 3, "hackathon_sponsorships": ["ETHDenver", "Consensus"], "policy_advocacy": ["数字资产法案", "稳定币监管"]}');