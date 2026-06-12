# 📸 Como adicionar fotos dos produtos

Coloque os arquivos de imagem **nesta pasta** (`public/produtos/`)
com os nomes exatos listados abaixo. O site carrega as fotos automaticamente.

## Nomes de arquivo esperados

| Foto | Nome do arquivo |
|---|---|
| Brinco Arco Celeste | `brinco-arco-celeste.jpg` |
| Brinco Gota Aurora | `brinco-gota-aurora.jpg` |
| Brinco Pérola Minimal | `brinco-perola-minimal.jpg` |
| Colar Veneziana Gold | `colar-veneziana-gold.jpg` |
| Colar Pingente Lua | `colar-pingente-lua.jpg` |
| Colar Choker Clássico | `colar-choker-classico.jpg` |
| Pulseira Riviera Cristal | `pulseira-riviera-cristal.jpg` |
| Pulseira Elos Flat | `pulseira-elos-flat.jpg` |
| Pulseira Bracelete Slim | `pulseira-bracelete-slim.jpg` |
| Anel Solitário Gema | `anel-solitario-gema.jpg` |
| Anel Falange Delicado | `anel-falange-delicado.jpg` |
| Anel Serpente | `anel-serpente.jpg` |
| Conjunto Trio Veneziana | `conjunto-trio-veneziana.jpg` |
| Conjunto Aurora Deluxe | `conjunto-aurora-deluxe.jpg` |
| Imagem reserva (fallback) | `placeholder.jpg` |

## Dicas importantes

- **Formato:** `.jpg`, `.jpeg`, `.png` ou `.webp`
- **Tamanho ideal:** 800×800px (quadrado) — o site corta automaticamente
- **Peso máximo:** até 1MB por foto para carregamento rápido
- **Sem foto ainda?** Deixe o arquivo `placeholder.jpg` na pasta — o site usa ele como reserva

## Adicionando um produto novo

1. Coloque a foto aqui na pasta `public/produtos/`
2. Abra `src/data/products.ts`
3. Adicione o nome do arquivo no array `produtoFotos`:
   ```ts
   img('meu-novo-produto.jpg'),  // índice XX
   ```
4. Crie a entrada do produto no array `products` usando `produtoFotos[XX]`
