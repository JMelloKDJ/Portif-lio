# Portfólio — composição e movimento de 10/10/2026

Site estático de João Victor, com três projetos selecionados, prévias opcionais e casos com acesso direto. Base de publicação preservada: `/Portif-lio/`.

## Executar localmente

Requisitos: Node.js 22 ou superior. Na pasta do pacote:

```powershell
npm ci
npm run build
npm run preview
```

Abrir `http://127.0.0.1:4173/Portif-lio/`. Se a porta já estiver em uso, não iniciar uma segunda instância sobre ela; usar a existente ou definir outra porta via `PORT`.

## Verificar

```powershell
npm test
npm run test:browser
npm run test:editorial
npm run audit
npm run record
```

Os testes de navegador usam Microsoft Edge instalado e um preview disponível. `PREVIEW_URL`, `TEST_DIR` e `RECORD_DIR` permitem apontar a URL e as pastas de evidência. Resultados padrão vão para `.review/`.

## Edição

- `content/portfolio.json`: conteúdo dos casos e dados públicos.
- `scripts/home-v5.mjs`, `scripts/explorer.mjs`, `scripts/closing.mjs`: composição semântica.
- `scripts/art-editorial.mjs`: três capas vetoriais originais.
- `assets/explorer.js`: seleção, teclado e retorno aos casos.
- `assets/explorer.css`, `assets/editorial.css`, `assets/composition.css`: composição e hierarquia visual.
- `assets/site-v4.css`: base preservada de layout/retrato; recebeu sobreposição editorial separada.
- `scripts/build.mjs`: entrada do build. Os HTML são gerados.

Os títulos selecionam a prévia por um grupo de radios nativos; não navegam. Apenas “Abrir o caso” abre a página detalhada. Tab entra no título selecionado; setas mudam a seleção e Espaço a confirma. Sem JavaScript, seleção, links e disclosure continuam funcionando. A home não exige WebGL. A troca de prévia termina após a interação. O movimento ambiente usa SVG/CSS, pausa fora da tela e respeita movimento reduzido. Os controles no hero e no perfil pausam ou retomam o movimento e preservam a escolha nesta sessão. Sem JavaScript, a arte permanece estática.

O retrato original e seus derivados foram preservados byte a byte. As capas de Delta e Atena são demonstrações ilustrativas; a do Hórus é uma captura do relatório. A autoria e os limites dos casos estão delimitados no conteúdo. Este candidato não foi publicado.

O pacote inclui código e artefatos estáticos prontos, sem `node_modules`, `.git`, arquivos pessoais de fonte ou credenciais. Para hospedagem, servir os HTML, `assets/`, `casos/`, `robots.txt`, `sitemap.xml` e `.nojekyll`, mantendo a base indicada.

A capa não é link. Escape recolhe a coleção com JavaScript ativo; o controle nativo também abre e fecha. O retorno do caso restaura a seleção. Perfil e contato preservam a composição da dobra aprovada. `scripts/contours.mjs` gera as linhas do hero com pontas dissipadas; `assets/ambient.js` mantém os controles de pausa e preferência. O telefone confirmado está em `person.phone`, com destino `tel:` e sem WhatsApp. Os rótulos repetidos das ilustrações foram removidos por decisão do proprietário; a capa do Hórus é uma captura da página Farol Hórus do relatório em Power BI, sem as páginas que listam membros.
