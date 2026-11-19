# IVAGEST

Protótipo de uma aplicação de gestão com áreas de dashboard, vendas, compras, contabilidade, stock, clientes e relatórios.

## Como executar

1. Extrai a pasta `IVAGEST_Prototype`.
2. Abre `index-IVAGEST.html` no navegador.
3. Para trabalhar com um servidor local, podes usar a extensão Live Server do VS Code.

A biblioteca Lucide é carregada por CDN, por isso os ícones precisam de ligação à internet.

## Estrutura

- `index-IVAGEST.html` — página inicial
- `vendas-IVAGEST.html` — vendas e criação de faturas de demonstração
- `compras-IVAGEST.html` — compras
- `area_contabilidade-IVAGEST.html` — contabilidade
- `area_stock-IVAGEST.html` — stock
- `clientes-IVAGEST.html` — clientes
- `relatorios-IVAGEST.html` — relatórios
- `style-IVAGEST.css` — estilos partilhados
- `js-IVAGEST.js` — interações do protótipo

## Estado do projeto

Este projeto é um protótipo frontend. Os valores apresentados são dados de exemplo. As faturas criadas no ecrã de vendas ficam apenas na memória da página e desaparecem ao atualizar. Ainda não existe ligação a uma API ou base de dados, nem emissão fiscal real ou exportação SAFT.
