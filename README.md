# Kanaloa Kite — segunda versão

Site estático com páginas de início, escola, guarderia, loja, produto, carrinho e vento/maré. Para abrir localmente com todos os recursos, sirva esta pasta em um servidor HTTP (por exemplo, `python -m http.server 8765`) e acesse `http://localhost:8765/`.

## O que funciona

- O formulário da escola prepara uma mensagem de WhatsApp com nome, data, período e observações. Ele solicita uma aula; a equipe confirma disponibilidade, horário e preço.
- O catálogo oferece filtros, detalhes, duas imagens por item, tamanho para vestuário, quantidade e carrinho guardado no navegador. O carrinho envia uma consulta pelo WhatsApp, sem pagamento.
- O vento vem da previsão da Open-Meteo para a área da Praia do Meio/Araçagy e é renovado a cada 15 minutos enquanto a página fica aberta.
- A tábua semanal usa os horários de 2026 do porto de São Luís, publicados pela DHN/Marinha e obtidos pela API Tábua de Maré. A semana mostrada avança automaticamente com a data. A fonte de 2027 precisará ser incorporada quando for publicada; isso não requer edição diária pelo administrador. Os horários são referência do porto, não medição na praia.
- A animação inicial traça o símbolo da marca a partir do logótipo fornecido na captura de tela.

## Antes de usar comercialmente

Os **seis produtos, preços e fotografias de produto são demonstrativos**, criados para testar a experiência. Substitua os dados em `products.js` e as imagens em `assets/` pelo catálogo real antes de apresentar o site como loja oficial. Não há estoque sincronizado, pagamento ou confirmação automática de reserva. O logótipo foi recortado da captura enviada e deve ser substituído pelo arquivo original quando disponível. As fotos de velejo são ilustrativas.

Serviços e WhatsApp: [Instagram oficial](https://www.instagram.com/kanaloakite/) e [Linktree oficial](https://linktr.ee/kanaloakite). Vento: [Open-Meteo](https://open-meteo.com/en/docs). Maré: [Tábua oficial da Marinha](https://www.marinha.mil.br/chm/dados-do-segnav-publicacoes/tabuas-das-mares), [API utilizada para preparar os dados](https://tabuamare.api.br/docs).
