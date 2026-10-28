// Cardápio do Miramar Rooftop, a partir do cardápio publicado no site da casa.
// mar: true = leva sabores do Maranhão (aparece com o ícone de onda).
window.MIRAMAR_MENU = [
  {
    id: "entradas", nome: "Entradas", itens: [
      { n: "Ceviche de Pescada Amarela", d: "Pescada amarela marinada no limão, com cebola roxa, coentro e pimenta.", p: 65, mar: true },
      { n: "Salada de Camarão", d: "Camarões, alface americana, rúcula e lascas de parmesão ao molho do chef.", p: 68 },
      { n: "Panelinha de Filé com Molho Gorgonzola", d: "Iscas de filé mignon ao molho gorgonzola, com torradas artesanais.", p: 75 },
      { n: "Carpaccio do Chef", d: "Carpaccio de carne com alcaparras, parmesão, tomate cereja confitado, rúcula e azeite trufado.", p: 75 },
      { n: "Salada Caprese Miramar", d: "Tomates temperados, rúcula, muçarela de búfala, berinjela laqueada no balsâmico e farofa de pão italiano.", p: 62 },
      { n: "Salada Caesar", d: "Alface americana, juliana de frango, parmesão, croutons, ervas finas e molho Caesar.", p: 59 }
    ]
  },
  {
    id: "petiscos", nome: "Petiscos", itens: [
      { n: "Casquinha de Caranguejo", d: "Carne de caranguejo servida com farofa e vinagrete.", p: 45, mar: true },
      { n: "Dadinho de Tapioca", d: "Oito dadinhos fritos de leve, com couve crocante e geleia de pimenta.", p: 35, mar: true },
      { n: "Camarão Alho e Óleo", d: "Camarões grelhados no alho e óleo.", p: 98 },
      { n: "Iscas de Peixe", d: "Tiras de pescada fritas, com molho tártaro.", p: 55 },
      { n: "Bolinho de Bacalhau", d: "Cinco unidades de bacalhau desfiado com ovo, cebola e temperos naturais.", p: 65 },
      { n: "Croqueta de Cupim", d: "Seis unidades de cupim empanado, casquinha crocante e miolo macio.", p: 49 },
      { n: "Pastéis com Geleia de Pimenta", d: "Seis mini pastéis de carne e queijo.", p: 35 }
    ]
  },
  {
    id: "mar", nome: "Peixes e frutos do mar", itens: [
      { n: "Peixada Maranhense", d: "Filé de pescada, camarão, ovos, batata, tomate, pimentões, coentro e leite de coco, com arroz branco. Preparo artesanal, cerca de 50 minutos.", p: 125, p2: 199, mar: true },
      { n: "Pescada ao Sunset", d: "Pescada grelhada, purê de banana-da-terra e risoto de alho-poró ao vinho branco.", p: 125, mar: true },
      { n: "Bacalhau à Moda Portuguesa", d: "Lascas de bacalhau, batata, brócolis, ovos, pimentões, cebola e azeitonas, com arroz branco.", p: 198, p2: 298 },
      { n: "Salmão ao Molho de Maracujá", d: "Salmão grelhado, purê de batata-baroa, molho de maracujá e arroz branco.", p: 135 },
      { n: "Salmão na Crosta de Ervas", d: "Salmão em crosta de ervas, arroz à grega e purê de batata-baroa.", p: 125 },
      { n: "Camarão à Grega", d: "Camarão crocante com arroz à grega e batata sautée.", p: 115 },
      { n: "Filé de Tilápia à Belle Meunière", d: "Tilápia, camarão, champignon e molho de alcaparras com azeite trufado.", p: 105 }
    ]
  },
  {
    id: "carnes", nome: "Carnes e aves", itens: [
      { n: "Carne de Sol", d: "Carne de sol grelhada, queijo coalho, baião de dois, macaxeira frita, farofa e vinagrete.", p: 115, p2: 180, mar: true },
      { n: "Carré de Cordeiro", d: "Carré grelhado com risoto de parmesão e molho roti.", p: 129 },
      { n: "Filé Mignon à Piemontese", d: "Filé grelhado com risoni à piemontese e cebola caramelizada.", p: 115 },
      { n: "Bife Ancho com Aligot", d: "Bife grelhado na manteiga de ervas com purê aligot.", p: 95 },
      { n: "Sobrecoxa Alcântara", d: "Sobrecoxa desossada grelhada, legumes na manteiga de ervas e purê de batatas.", p: 68 },
      { n: "Supremo de Frango", d: "Filé de frango recheado e empanado no panko, com purê de batatas e arroz à grega.", p: 68 }
    ]
  },
  {
    id: "risotos", nome: "Risotos e massas", itens: [
      { n: "Risoto de Camarão", d: "Arbóreo com camarão, pimentões e cebola, aromatizado com vinho branco.", p: 115 },
      { n: "Risoto de Shitake e Shimeji com Filé Mignon", d: "Cogumelos, vinho branco e parmesão, servido com filé mignon.", p: 105 },
      { n: "Risoto Caprese com Salmão", d: "Salmão fresco, manjericão, tomate confitado e muçarela de búfala.", p: 102 },
      { n: "Medalhão de Filé com Risoto de Limão Siciliano", d: "Medalhão de filé mignon com risoto de limão siciliano.", p: 94 },
      { n: "Fetuccine de Camarão ao Limão", d: "Camarões no molho cremoso de limão.", p: 89 },
      { n: "Tagliatelle al Burrata", d: "Pelati, burrata fresca, manjericão, pesto e azeite.", p: 89 },
      { n: "Rigatoni Miramar", d: "Matriciana com bacon, tomate confitado, pecorino romano e pimenta.", p: 74 },
      { n: "Linguini à Mexicana", d: "Pelati, azeitonas, alcaparras, pimentões, manjericão e pimenta.", p: 68 },
      { n: "Carbonara", d: "Ovos, parmesão, pancetta e pimenta-do-reino.", p: 65 }
    ]
  },
  {
    id: "veg", nome: "Vegetarianos e kids", itens: [
      { n: "Parmegiana de Berinjela", d: "Berinjela empanada ao molho vermelho, queijo vegano, arroz de brócolis e fritas.", p: 65, tag: "Vegetariano" },
      { n: "Fetuccine com Legumes", d: "Molho pomodoro com legumes salteados no azeite trufado.", p: 60, tag: "Vegetariano" },
      { n: "Espaguete ao Sugo", d: "Molho de tomate fresco e parmesão.", p: 55, tag: "Kids" },
      { n: "Proteína à Escolha", d: "Filé de carne, frango ou pescada à dorê, com arroz e purê ou fritas.", p: 55, tag: "Kids" }
    ]
  },
  {
    id: "sobremesas", nome: "Sobremesas", itens: [
      { n: "Petit Gâteau com Sorvete de Creme", d: "Bolinho quente de chocolate com sorvete.", p: 40 },
      { n: "Brownie com Sorvete de Creme", d: "Brownie macio de chocolate com sorvete de creme.", p: 40 },
      { n: "Torta de Limão", d: "Cítrica, doce e leve.", p: 40 },
      { n: "Pudim de Leite", d: "Cremoso e tradicional.", p: 28 }
    ]
  },
  {
    id: "bar", nome: "Bar", itens: [
      { n: "Aperol Spritz", d: "Aperol e espumante.", p: 35 },
      { n: "Mojito", d: "Gin, limão, hortelã, xarope simples e água tônica.", p: 38 },
      { n: "Sex on the Beach", d: "Vodka, suco de laranja e grenadine.", p: 35 },
      { n: "Caipirosca de Frutas", d: "Vodka com morango ou kiwi.", p: 35 },
      { n: "Lagoa Azul", d: "Vodka, limão e Sprite.", p: 25 },
      { n: "Gin importado", d: "Dose.", p: 39 },
      { n: "Whisky Royal Salute", d: "Dose.", p: 70 },
      { n: "Whisky Chivas Regal 18 anos", d: "Dose.", p: 68 },
      { n: "Whisky Chivas 12 anos", d: "Dose.", p: 42 },
      { n: "Licor 43", d: "Dose.", p: 38 },
      { n: "Suco de bacuri, cupuaçu, maracujá ou graviola", d: "Jarra de 750 ml. Também em copo de 300 ml.", p: 40, mar: true },
      { n: "Suco de acerola, goiaba, cajá ou caju", d: "Jarra de 750 ml. Também em copo de 300 ml, a partir de R$ 15.", p: 40, mar: true },
      { n: "Abacaxi com hortelã", d: "Jarra de 750 ml.", p: 45 },
      { n: "Água de coco", d: "Jarra de 750 ml. Copo de 300 ml por R$ 19.", p: 35 },
      { n: "Cappuccino", d: "", p: 16 },
      { n: "Café expresso", d: "", p: 12 }
    ]
  }
];
