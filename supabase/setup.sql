-- ═══════════════════════════════════════════════════════════
--  AURORA ACESSÓRIOS — Setup do banco de dados (Supabase)
--
--  Como usar:
--  1. Abra seu projeto no site supabase.com
--  2. Vá em "SQL Editor" no menu da esquerda
--  3. Clique em "New query"
--  4. Cole TODO o conteúdo deste arquivo
--  5. Clique em "Run" (ou Ctrl+Enter)
-- ═══════════════════════════════════════════════════════════

-- 1. Criar a tabela de produtos
create table if not exists products (
  id            text primary key,
  name          text not null,
  description   text default '',
  price         numeric not null,
  original_price numeric,
  image         text not null,
  category      text not null,
  material      text not null,
  material_type text not null,
  in_stock      boolean not null default true,
  badge         text,
  created_at    timestamptz default now()
);

-- 2. Habilitar Row Level Security (segurança por linha)
alter table products enable row level security;

-- 3. Política: QUALQUER PESSOA pode LER os produtos (catálogo público)
create policy "Produtos são públicos para leitura"
  on products for select
  using (true);

-- 4. Política: QUALQUER PESSOA pode INSERIR/EDITAR/EXCLUIR
--    (a proteção do /admin é feita por senha no próprio site,
--     então liberamos a "anon key" para o admin conseguir salvar)
create policy "Permitir inserção de produtos"
  on products for insert
  with check (true);

create policy "Permitir atualização de produtos"
  on products for update
  using (true);

create policy "Permitir exclusão de produtos"
  on products for delete
  using (true);

-- 5. Habilitar Realtime (alterações aparecem instantaneamente pra todo mundo)
alter publication supabase_realtime add table products;

-- 6. Inserir os produtos de exemplo (catálogo inicial)
insert into products (id, name, description, price, original_price, image, category, material, material_type, in_stock, badge) values
('b001', 'Brinco Arco Celeste', 'Brinco em arco delicado com zircônias lapidadas. Perfeito para o dia a dia ou ocasiões especiais.', 89.90, null, 'https://images.unsplash.com/photo-1635767798638-3e25273a8236?w=500&h=500&fit=crop&q=80', 'brincos', 'Semi-joia banhada a ouro 18k', 'ouro', true, 'Mais Vendido'),
('b002', 'Brinco Gota Aurora', 'Brinco gota alongado com acabamento polido. Elegante e atemporal.', 74.90, 99.90, 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500&h=500&fit=crop&q=80', 'brincos', 'Semi-joia banhada a ouro 18k', 'ouro', true, null),
('b003', 'Brinco Pérola Minimal', 'Brinco delicado com pérola de água doce. Sofisticação em cada detalhe.', 64.90, null, 'https://images.unsplash.com/photo-1573408301185-9519f94816b5?w=500&h=500&fit=crop&q=80', 'brincos', 'Semi-joia banhada a prata 925', 'prata', true, 'Novo'),
('c001', 'Colar Veneziana Gold', 'Corrente veneziana fina em banho de ouro 18k. Versátil e elegante para qualquer look.', 119.90, null, 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500&h=500&fit=crop&q=80', 'colares', 'Semi-joia banhada a ouro 18k', 'ouro', true, 'Mais Vendido'),
('c002', 'Colar Pingente Lua', 'Colar delicado com pingente em formato de lua crescente. Para quem acredita na magia.', 99.90, null, 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=500&h=500&fit=crop&q=80', 'colares', 'Semi-joia banhada a ouro 18k', 'ouro', true, 'Novo'),
('c003', 'Colar Choker Clássico', 'Choker com elos delicados. Moderno e versátil, ideal para looks contemporâneos.', 84.90, 109.90, 'https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?w=500&h=500&fit=crop&q=80', 'colares', 'Semi-joia banhada a prata 925', 'prata', true, null),
('p001', 'Pulseira Riviera Cristal', 'Pulseira com cristais coloridos lapidados. Adicione brilho ao seu pulso.', 94.90, null, 'https://images.unsplash.com/photo-1584811644165-33db88e00597?w=500&h=500&fit=crop&q=80', 'pulseiras', 'Semi-joia banhada a ouro 18k', 'ouro', true, 'Exclusivo'),
('p002', 'Pulseira Elos Flat', 'Pulseira de elos achatados com textura escovada. Minimalismo com personalidade.', 79.90, null, 'https://images.unsplash.com/photo-1610992015732-2449b76344bc?w=500&h=500&fit=crop&q=80', 'pulseiras', 'Aço inoxidável 316L', 'aco-inox', false, null),
('p003', 'Pulseira Bracelete Slim', 'Bracelete rígido ultra-fino. Elegância que cabe em qualquer ocasião.', 69.90, 89.90, 'https://images.unsplash.com/photo-1543294001-f7cd5d7fb516?w=500&h=500&fit=crop&q=80', 'pulseiras', 'Aço inoxidável 316L', 'aco-inox', false, 'Últimas unidades'),
('a001', 'Anel Solitário Gema', 'Anel solitário com zircônia oval. Sofisticado e atemporal.', 109.90, null, 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500&h=500&fit=crop&q=80', 'aneis', 'Semi-joia banhada a ouro 18k', 'ouro', true, 'Mais Vendido'),
('a002', 'Anel Falange Delicado', 'Anel de falange ajustável com detalhes em zircônia. Leve e moderno.', 54.90, null, 'https://images.unsplash.com/photo-1588444968012-1f0e1c4e3bbb?w=500&h=500&fit=crop&q=80', 'aneis', 'Semi-joia banhada a prata 925', 'prata', true, 'Novo'),
('a003', 'Anel Serpente', 'Anel aro aberto em formato de cobra. Ousado e único.', 89.90, null, 'https://images.unsplash.com/photo-1601121141461-9d6647bef0a1?w=500&h=500&fit=crop&q=80', 'aneis', 'Aço inoxidável 316L', 'aco-inox', true, 'Exclusivo'),
('cj001', 'Conjunto Trio Veneziana', 'Kit com colar, brinco e pulseira veneziana. Harmonia total do look.', 259.90, 299.90, 'https://images.unsplash.com/photo-1602652250015-52934bc45613?w=500&h=500&fit=crop&q=80', 'conjuntos', 'Semi-joias banhadas a ouro 18k', 'ouro', true, 'Mais Vendido'),
('cj002', 'Conjunto Aurora Deluxe', 'Kit exclusivo com colar choker, brincos gota e anel solitário. A coleção mais desejada.', 299.90, null, 'https://images.unsplash.com/photo-1614854262318-831574f15f1f?w=500&h=500&fit=crop&q=80', 'conjuntos', 'Semi-joias com cristais czk', 'ouro', true, 'Exclusivo')
on conflict (id) do nothing;

-- ═══════════════════════════════════════════════════════════
--  PRONTO! Agora vá em "Storage" no menu lateral e crie um
--  bucket chamado "product-images" marcado como PÚBLICO.
--  Veja o SETUP.md para o passo a passo com imagens.
-- ═══════════════════════════════════════════════════════════
