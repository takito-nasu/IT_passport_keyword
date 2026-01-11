-- 1. Create the table
create table keywords (
  id uuid default gen_random_uuid() primary key,
  term text not null,
  meaning text not null,
  description text not null,
  category text not null,
  created_at timestamptz default now()
);

-- 2. Enable Row Level Security (RLS)
alter table keywords enable row level security;

-- 3. Create a policy to allow anyone to read (SELECT) the data
create policy "Allow public read access"
  on keywords
  for select
  using (true);

-- 4. (Optional) Insert sample data
insert into keywords (term, meaning, description, category) values
('BPR', 'Business Process Reengineering', '企業改革のために、既存の組織やビジネスルールを抜本的に見直し、職務、業務フロー、管理機構、情報システムを再設計すること。', 'Strategy'),
('CRM', 'Customer Relationship Management', '顧客満足度とロイヤルティの向上を通して、売上の拡大と収益性の向上を目指す経営手法（顧客関係管理）。', 'Strategy'),
('SCM', 'Supply Chain Management', '原材料の調達から製造、物流、販売に至るまでの一連のプロセス（供給連鎖）を最適化し、コスト削減や納期短縮を図る経営管理手法。', 'Strategy'),
('SLA', 'Service Level Agreement', 'サービス提供者と利用者の間で結ばれる、サービスの品質（稼働率、応答時間など）に関する合意。', 'Management'),
('RFP', 'Request For Proposal', '発注先となるベンダー企業に対し、具体的なシステム提案を行うよう要求・依頼する文書（提案依頼書）。', 'Management'),
('VPN', 'Virtual Private Network', 'インターネットなどの公衆回線を、あたかも専用回線であるかのように利用できる仮想的なプライベートネットワーク技術。', 'Technology'),
('NFC', 'Near Field Communication', '至近距離（数cm〜10cm程度）での無線通信を行う技術。交通系ICカードやスマートフォン決済などで利用される。', 'Technology'),
('IoT', 'Internet of Things', '「モノのインターネット」と呼ばれ、家電や自動車などあらゆるモノがインターネットにつながり、情報をやり取りする仕組み。', 'Technology'),
('BCP', 'Business Continuity Plan', '災害や事故などの予期せぬ事態が発生した場合に、中核となる事業を継続、または早期復旧させるための計画（事業継続計画）。', 'Strategy'),
('CSR', 'Corporate Social Responsibility', '企業が利益を追求するだけでなく、環境保護や社会貢献など、社会に対して果たすべき責任。', 'Strategy');
