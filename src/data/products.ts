import type { Product } from '../types';

// ─────────────────────────────────────────────────────────
//  IMAGENS DOS PRODUTOS
//
//  Como adicionar fotos:
//  1. Coloque o arquivo de imagem dentro da pasta /public/produtos/
//  2. Nomeie o arquivo igual ao que está aqui (ex: brinco-arco-celeste.jpg)
//  3. Salve — a foto aparece automaticamente no catálogo!
//
//  Formatos aceitos: .jpg  .jpeg  .png  .webp
//  Tamanho recomendado: 800x800px (quadrado) até 1MB por foto
// ─────────────────────────────────────────────────────────

const img = (filename: string) =>
  `${import.meta.env.BASE_URL}produtos/${filename}`;

const produtoFotos = [
  img('brinco gotas.jpeg'),       // 0
  img('brinco meio aro.jpeg'),        // 1
  img('brinco duplo coracao.jpeg'),     // 2
  img('brinco martelado.jpeg'),      // 3
  img('colar-pingente-lua.jpg'),        // 4
  img('colar-choker-classico.jpg'),     // 5
  img('pulseira-riviera-cristal.jpg'),  // 6
  img('pulseira-elos-flat.jpg'),        // 7
  img('pulseira-bracelete-slim.jpg'),   // 8
  img('anel-solitario-gema.jpg'),       // 9
  img('anel-falange-delicado.jpg'),     // 10
  img('anel-serpente.jpg'),             // 11
  img('conjunto-trio-veneziana.jpg'),   // 12
  img('conjunto-aurora-deluxe.jpg'),    // 13
  img('placeholder.jpg'),               // 14 — fallback genérico
];

export const products: Product[] = [
  {
    id: 'b001',
    name: 'Brinco Gotas',
    description: 'Brinco em arco delicado com zircônias lapidadas. Perfeito para o dia a dia ou ocasiões especiais.',
    price: 89.90,
    image: produtoFotos[0],
    category: 'brincos',
    material: 'banhado a ouro 18k',
    materialType: 'ouro',
    inStock: true,
    badge: 'Mais Vendido',
  },
  {
    id: 'b002',
    name: 'Brinco Meio Aro',
    description: 'Brinco gota alongado com acabamento polido. Elegante e atemporal.',
    price: 74.90,
    originalPrice: 99.90,
    image: produtoFotos[1],
    category: 'brincos',
    material: 'banhado a ouro 18k',
    materialType: 'ouro',
    inStock: true,
  },
  {
    id: 'b003',
    name: 'Brinco Coração Duplo',
    description: 'Brinco delicado com pérola de água doce. Sofisticação em cada detalhe.',
    price: 64.90,
    image: produtoFotos[2],
    category: 'brincos',
    material: 'banhado a ouro 18k',
    materialType: 'prata',
    inStock: true,
    badge: 'Novo',
  },
  {
    id: 'b004',
    name: 'Brinco Círculo Martelado',
    description: 'Brinco delicado com pérola de água doce. Sofisticação em cada detalhe.',
    price: 64.90,
    image: produtoFotos[2],
    category: 'brincos',
    material: 'banhado a ouro 18k',
    materialType: 'ouro',
    inStock: true,
    badge: 'Novo',
  },
  {
    id: 'b005',
    name: 'Brinco Aro',
    description: 'Brinco delicado com pérola de água doce. Sofisticação em cada detalhe.',
    price: 64.90,
    image: produtoFotos[2],
    category: 'brincos',
    material: 'banhado a ouro 18k',
    materialType: 'ouro',
    inStock: true,
    badge: 'Novo',
  },
  {
    id: 'b006',
    name: 'Brinco Haste',
    description: 'Brinco delicado com pérola de água doce. Sofisticação em cada detalhe.',
    price: 64.90,
    image: produtoFotos[2],
    category: 'brincos',
    material: 'banhado a ouro 18k',
    materialType: 'ouro',
    inStock: true,
    badge: 'Novo',
  },
  {
    id: 'b007',
    name: 'Brinco Ôrganico',
    description: 'Brinco delicado com pérola de água doce. Sofisticação em cada detalhe.',
    price: 64.90,
    image: produtoFotos[2],
    category: 'brincos',
    material: 'banhado a ouro 18k',
    materialType: 'ouro',
    inStock: true,
    badge: 'Novo',
  },
  {
    id: 'b008',
    name: 'Brinco Argola Heart',
    description: 'Brinco delicado com pérola de água doce. Sofisticação em cada detalhe.',
    price: 64.90,
    image: produtoFotos[2],
    category: 'brincos',
    material: 'banhado a ouro 18k',
    materialType: 'ouro',
    inStock: true,
    badge: 'Novo',
  },
  {
    id: 'b009',
    name: 'Brinco Oval',
    description: 'Brinco delicado com pérola de água doce. Sofisticação em cada detalhe.',
    price: 64.90,
    image: produtoFotos[2],
    category: 'brincos',
    material: 'banhado a ouro 18k',
    materialType: 'ouro',
    inStock: true,
    badge: 'Novo',
  },
  {
    id: 'b010',
    name: 'Brinco Coração Trançado',
    description: 'Brinco delicado com pérola de água doce. Sofisticação em cada detalhe.',
    price: 64.90,
    image: produtoFotos[2],
    category: 'brincos',
    material: 'banhado a ouro 18k',
    materialType: 'ouro',
    inStock: true,
    badge: 'Novo',
  },
  {
    id: 'b011',
    name: 'Brinco Argola Ondulação',
    description: 'Brinco delicado com pérola de água doce. Sofisticação em cada detalhe.',
    price: 64.90,
    image: produtoFotos[2],
    category: 'brincos',
    material: 'banhado a ouro 18k',
    materialType: 'ouro',
    inStock: true,
    badge: 'Novo',
  },
  {
    id: 'b012',
    name: 'Brinco Órbita',
    description: 'Brinco delicado com pérola de água doce. Sofisticação em cada detalhe.',
    price: 64.90,
    image: produtoFotos[2],
    category: 'brincos',
    material: 'banhado a ouro 18k',
    materialType: 'ouro',
    inStock: true,
    badge: 'Novo',
  },
  {
    id: 'c001',
    name: 'Colar Veneziana Gold',
    description: 'Corrente veneziana fina em banho de ouro 18k. Versátil e elegante para qualquer look.',
    price: 119.90,
    image: produtoFotos[3],
    category: 'colares',
    material: 'Semi-joia banhada a ouro 18k',
    materialType: 'ouro',
    inStock: true,
    badge: 'Mais Vendido',
  },
  {
    id: 'c002',
    name: 'Colar Pingente Lua',
    description: 'Colar delicado com pingente em formato de lua crescente. Para quem acredita na magia.',
    price: 99.90,
    image: produtoFotos[4],
    category: 'colares',
    material: 'Semi-joia banhada a ouro 18k',
    materialType: 'ouro',
    inStock: true,
    badge: 'Novo',
  },
  {
    id: 'c003',
    name: 'Colar Choker Clássico',
    description: 'Choker com elos delicados. Moderno e versátil, ideal para looks contemporâneos.',
    price: 84.90,
    originalPrice: 109.90,
    image: produtoFotos[5],
    category: 'colares',
    material: 'Semi-joia banhada a prata 925',
    materialType: 'prata',
    inStock: true,
  },
  {
    id: 'p001',
    name: 'Pulseira Riviera Cristal',
    description: 'Pulseira com cristais coloridos lapidados. Adicione brilho ao seu pulso.',
    price: 94.90,
    image: produtoFotos[6],
    category: 'pulseiras',
    material: 'Semi-joia banhada a ouro 18k',
    materialType: 'ouro',
    inStock: true,
    badge: 'Exclusivo',
  },
  {
    id: 'p002',
    name: 'Pulseira Elos Flat',
    description: 'Pulseira de elos achatados com textura escovada. Minimalismo com personalidade.',
    price: 79.90,
    image: produtoFotos[7],
    category: 'pulseiras',
    material: 'Aço inoxidável 316L',
    materialType: 'aco-inox',
    inStock: false,
  },
  {
    id: 'p003',
    name: 'Pulseira Bracelete Slim',
    description: 'Bracelete rígido ultra-fino. Elegância que cabe em qualquer ocasião.',
    price: 69.90,
    originalPrice: 89.90,
    image: produtoFotos[8],
    category: 'pulseiras',
    material: 'Aço inoxidável 316L',
    materialType: 'aco-inox',
    inStock: false,
    badge: 'Últimas unidades',
  },
  {
    id: 'a001',
    name: 'Anel Solitário Gema',
    description: 'Anel solitário com zircônia oval. Sofisticado e atemporal.',
    price: 109.90,
    image: produtoFotos[9],
    category: 'aneis',
    material: 'Semi-joia banhada a ouro 18k',
    materialType: 'ouro',
    inStock: true,
    badge: 'Mais Vendido',
  },
  {
    id: 'a002',
    name: 'Anel Falange Delicado',
    description: 'Anel de falange ajustável com detalhes em zircônia. Leve e moderno.',
    price: 54.90,
    image: produtoFotos[10],
    category: 'aneis',
    material: 'Semi-joia banhada a prata 925',
    materialType: 'prata',
    inStock: true,
    badge: 'Novo',
  },
  {
    id: 'a003',
    name: 'Anel Serpente',
    description: 'Anel aro aberto em formato de cobra. Ousado e único.',
    price: 89.90,
    image: produtoFotos[11],
    category: 'aneis',
    material: 'Aço inoxidável 316L',
    materialType: 'aco-inox',
    inStock: true,
    badge: 'Exclusivo',
  },
  {
    id: 'cj001',
    name: 'Conjunto Trio Veneziana',
    description: 'Kit com colar, brinco e pulseira veneziana. Harmonia total do look.',
    price: 259.90,
    originalPrice: 299.90,
    image: produtoFotos[12],
    category: 'conjuntos',
    material: 'Semi-joias banhadas a ouro 18k',
    materialType: 'ouro',
    inStock: true,
    badge: 'Mais Vendido',
  },
  {
    id: 'cj002',
    name: 'Conjunto Aurora Deluxe',
    description: 'Kit exclusivo com colar choker, brincos gota e anel solitário. A coleção mais desejada.',
    price: 299.90,
    image: produtoFotos[13],
    category: 'conjuntos',
    material: 'Semi-joias banhadas a ouro 18k',
    materialType: 'ouro',
    inStock: true,
    badge: 'Exclusivo',
  },
];

export const categoryLabels: Record<string, string> = {
  todos: 'Todos',
  brincos: 'Brincos',
  colares: 'Colares',
  pulseiras: 'Pulseiras',
  aneis: 'Anéis',
  conjuntos: 'Conjuntos',
};

export const materialLabels: Record<string, string> = {
  todos: 'Todos os materiais',
  ouro: '✦ Banhado a Ouro 18k',
  prata: '✦ Banhado a Prata 925',
  'aco-inox': '✦ Aço Inoxidável',
};
