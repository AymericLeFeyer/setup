const categoriesData = [
  { id: 1, name: 'PC ', showTotal: true },
  { id: 2, name: 'Stream', showTotal: true },
  { id: 3, name: 'Ergonomie', showTotal: true },
  { id: 4, name: 'Composants PC', showTotal: true },
  { id: 5, name: 'Travail', showTotal: true },
  { id: 6, name: 'Impression 3D', showTotal: true },
  { id: 7, name: 'Homelab', showTotal: true },
  { id: 8, name: 'Caméra', showTotal: true },
  { id: 9, name: 'Travel', showTotal: true },
  { id: 10, name: 'Daily', showTotal: true }
];

const setupsData = [
  {
    id: 'desk',
    title: 'Desk',
    image: 'assets/setup.jpeg',
    description: 'Tout ce qu\'il faut pour faire des montages, des streams gaming, et travailler pour mes clients de temps en temps',
    items: [
      {
        id: 'logitech-mx-vertical',
        category: 1,
        x: 56.9,
        y: 63.7,
        name: 'Logitech MX Vertical',
        image: 'https://m.media-amazon.com/images/I/61iiZ-gDYEL._AC_SL1500_.jpg',
        buyLink: 'https://amzn.to/4wXAQWb',
        price: '70€'
      },
      {
        id: 'keychron-k10-v2',
        category: 1,
        x: 42.2,
        y: 64.7,
        name: 'Keychron K10 V2',
        image: 'https://m.media-amazon.com/images/I/71aQghYjysL._AC_SL1500_.jpg',
        buyLink: 'https://aylabs.fr/produit/keychron-k10',
        price: '110€'
      },
      {
        id: 'nouvel-equipement',
        category: 1,
        x: 70.9,
        y: 47.6,
        name: 'PC Gaming',
        description: 'Acheté d\'occasion, détails en dessous',
        image: 'https://m.media-amazon.com/images/I/81jO0K8XqNL._AC_SL1500_.jpg',
        buyLink: 'https://aylabs.fr',
        price: '950€'
      },
      {
        id: 'nouvel-equipement-2',
        category: 5,
        x: 69.6,
        y: 22.2,
        name: 'MacBook Air M2 ',
        description: '8 Go RAM',
        image: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fappleshop.com.pk%2Fwp-content%2Fuploads%2F2024%2F03%2Fmba13-m3-midnight-gallery5.jpeg&f=1&nofb=1&ipt=171f8d8a09ce92607022c238057b7641cf17a95bfb0c6c802da6d3f5e706d979',
        buyLink: 'https://www.fnac.com/informatique/macbook-air-m2/q',
        price: '900€'
      },
      {
        id: 'nouvel-equipement-3',
        category: 1,
        x: 29.7,
        y: 37.5,
        name: 'Écran Samsung Ultrawide 49" 32:9 C49HG9x',
        image: 'https://m.media-amazon.com/images/I/81hfK6EuZ6L._AC_SL1500_.jpg',
        buyLink: 'https://amzn.to/4qfvByD',
        price: '959€'
      },
      {
        id: 'nouvel-equipement-4',
        category: 1,
        x: 59.2,
        y: 13.7,
        name: 'Ecran 21:9',
        description: 'Pas exactement celui là',
        image: 'https://m.media-amazon.com/images/I/61I45blpnVL._AC_SL1500_.jpg',
        buyLink: 'https://amzn.to/45HmzB3',
        price: '149€'
      },
      {
        id: 'nouvel-equipement-5',
        category: 2,
        x: 46.2,
        y: 43.4,
        name: 'Micro Elgato Wave:3',
        image: 'https://m.media-amazon.com/images/I/61xmSN0y8HL._AC_SL1500_.jpg',
        buyLink: 'https://amzn.to/4i5MM3j',
        price: '149€'
      },
      {
        id: 'nouvel-equipement-6',
        category: 2,
        x: 65.1,
        y: 59.5,
        name: 'Bras du micro',
        image: 'https://m.media-amazon.com/images/I/51OHj7-+8EL._AC_SL1500_.jpg',
        buyLink: 'https://amzn.to/4g53RrB',
        price: '29€'
      },
      {
        id: 'nouvel-equipement-7',
        category: 2,
        x: 43.3,
        y: 53,
        name: 'Streamdeck Neo',
        image: 'https://m.media-amazon.com/images/I/61YXUwCxbhL._AC_SL1500_.jpg',
        buyLink: 'https://amzn.to/3UuFvjN',
        price: '100€'
      },
      {
        id: 'nouvel-equipement-8',
        category: 2,
        x: 17.5,
        y: 88.9,
        name: 'Casque Beyerdynamic DT 990 Pro',
        image: 'https://m.media-amazon.com/images/I/71-0d2CTMML._AC_SL1500_.jpg',
        buyLink: 'https://amzn.to/4zjVCRw',
        price: '145€'
      },
      {
        id: 'nouvel-equipement-9',
        category: 3,
        x: 90,
        y: 82.9,
        name: 'Chaise Flexispot FoldeX',
        image: 'https://m.media-amazon.com/images/I/716z8xmt60L._AC_SL1500_.jpg',
        buyLink: 'https://amzn.to/4wutuZ7',
        price: '239€'
      },
      {
        id: 'nouvel-equipement-10',
        category: 3,
        x: 17.5,
        y: 68.6,
        name: 'Bureau assis-debout',
        description: '160x80',
        image: 'https://image.springbeetle.eu/cdn-cgi/image/dpr=1,format=webp,fit=pad/https://s3.springbeetle.eu/prod-eu-s3/E7prob-vitesse_20260728_6WsdrCUn.png',
        buyLink: 'https://www.flexispot.fr/nouvelle-generation-bureau-assis-debout-electrique-e7pro',
        price: '900€'
      },
      {
        id: 'nouvel-equipement-11',
        category: 3,
        x: 28.7,
        y: 65.9,
        name: 'Tapis de souris XXL',
        image: 'https://m.media-amazon.com/images/I/51umVkj2t6L._AC_SL1500_.jpg',
        buyLink: 'https://amzn.to/4zikARe',
        price: '39€'
      },
      {
        id: 'nouvel-equipement-12',
        category: 1,
        x: 48,
        y: 85.9,
        name: 'Tapis anti-fatigue',
        image: 'https://image.springbeetle.eu/cdn-cgi/image/dpr=1,format=webp,fit=pad/https://s3.springbeetle.eu/prod-eu-s3/trantor/attachments/FR/SS007L-1.png',
        buyLink: 'https://www.flexispot.fr/tapis-anti-fatigue-mt1b?ref=search_products',
        price: '59€'
      },
      {
        id: 'nouvel-equipement-13',
        category: 2,
        x: 30.7,
        y: 19.2,
        name: 'Caméra Razer Kiyo',
        image: 'https://m.media-amazon.com/images/I/614YfiGJDlL._AC_SL1500_.jpg',
        buyLink: 'https://amzn.to/3TRWPiA',
        price: '49€'
      },
      {
        id: 'nouvel-equipement-15',
        category: 1,
        x: 56.3,
        y: 48.8,
        name: 'Station d\'accueil',
        image: 'https://m.media-amazon.com/images/I/71NyqmhQtEL._AC_SL1500_.jpg',
        buyLink: 'https://amzn.to/45VPvFj',
        price: '89€'
      },
      {
        id: 'nouvel-equipement-16',
        category: 4,
        name: 'Processeur Ryzen 7 5700x3D',
        image: 'https://m.media-amazon.com/images/I/61vkFq7H9tL._AC_SL1300_.jpg',
        buyLink: 'https://amzn.to/3RYAFKZ',
        price: '389€'
      },
      {
        id: 'nouvel-equipement-17',
        category: 4,
        name: 'Carte graphique RTX 5070 Gigabyte OC',
        image: 'https://m.media-amazon.com/images/I/81AHWRRuBCL._AC_SL1500_.jpg',
        buyLink: 'https://amzn.to/45rDNSH',
        price: '699€'
      },
      {
        id: 'nouvel-equipement-18',
        category: 4,
        name: 'RAM 32Go DDR4 3200MHz CORSAIRE VENGEANCE',
        image: 'https://m.media-amazon.com/images/I/61FGpdRF2gL._AC_SL1500_.jpg',
        buyLink: 'https://amzn.to/3SrQn1m',
        price: '300€'
      },
      {
        id: 'nouvel-equipement-19',
        category: 4,
        name: 'SSD 1To NVMe Crucial P3 Plus',
        image: 'https://m.media-amazon.com/images/I/51lrFzSnxhL._AC_SL1080_.jpg',
        buyLink: 'https://amzn.to/4zco33x',
        price: '169€'
      },
      {
        id: 'nouvel-equipement-20',
        category: 4,
        name: 'Carte mère MSI MPG B550 Gaming Plus',
        image: 'https://m.media-amazon.com/images/I/61xc7xGsAlL._AC_SL1200_.jpg',
        buyLink: 'https://amzn.to/4qarWSq',
        price: '139€'
      },
      {
        id: 'nouvel-equipement-21',
        category: 4,
        name: 'Ventirad Artic Freezer 36',
        image: 'https://m.media-amazon.com/images/I/710Z5PcNlLL._AC_SL1500_.jpg',
        buyLink: 'https://amzn.to/4g66glL',
        price: '34€'
      },
      {
        id: 'nouvel-equipement-22',
        category: 4,
        name: 'Alimentation Gigabyte 750W Gold Modulaire',
        image: 'https://m.media-amazon.com/images/I/511XNvBjRLL._AC_SL1000_.jpg',
        buyLink: 'https://amzn.to/4wpDJhh',
        price: '85€'
      },
      {
        id: 'nouvel-equipement-23',
        category: 4,
        name: 'Boitier Aquarium FOIFKIN F300',
        image: 'https://m.media-amazon.com/images/I/81jO0K8XqNL._AC_SL1500_.jpg',
        buyLink: 'https://amzn.to/4g53wFl',
        price: '59€'
      }
    ]
  },
  {
    id: 'aylabs',
    title: 'AyLabs',
    image: 'assets/aylabs.jpeg',
    description: 'Un décor dans lequel je me sens bien, une caméra qui me plaît toujours autant, le tout entouré d\'imprimantes 3D ',
    items: [
      {
        id: 'nouvel-equipement',
        category: 6,
        x: 29.4,
        y: 67.4,
        name: 'BambuLab A1 Combo',
        image: 'https://store.bblcdn.eu/s8/default/8026271045524b2ca4d14f0d10f15013/A1_C-compressed.jpg',
        buyLink: 'https://eu.store.bambulab.com/fr/products/a1?gad_campaignid=20530447580&gbraid=0AAAAAqFjFZrVpzIvBpnhU2KHX-q5SMhtC',
        price: '390€'
      },
      {
        id: 'nouvel-equipement-2',
        category: 6,
        x: 31.9,
        y: 92.2,
        name: 'Elegoo Centauri Carbon',
        image: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.notebookcheck.net%2Ffileadmin%2FNotebooks%2FNews%2F_nc4%2Felegoocentauricarbon.jpg&f=1&nofb=1&ipt=b1ad02b9ad3f7af388d8c4e334e8c6277039f41e4d61ac00593d8d984a1adbca',
        buyLink: 'https://affiliate.geekbuying.com/deeplink.php?url=https://www.geekbuying.com/item/Elegoo-Centauri-Carbon-3D-Printer-529142.html&affid=6265',
        price: '300€'
      },
      {
        id: 'nouvel-equipement-3',
        category: 6,
        x: 42.9,
        y: 89.7,
        name: 'SUNLU Filament Dryer S4',
        image: 'https://media.sunlu.com/prod/20260323/9d2028db-376c-40fd-9fba-2d2efc4ec63a.jpg',
        buyLink: 'https://www.sunlu.com/products/filadryer-s4-filament-dryer',
        price: '124€'
      },
      {
        id: 'nouvel-equipement-4',
        category: 6,
        x: 37.7,
        y: 7.3,
        name: 'Bobines d\'impression 3D',
        image: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.voxelmatters.directory%2Fwp-content%2Fuploads%2F2016%2F11%2FSUNLU-logo.jpg&f=1&nofb=1&ipt=9d7aeb66a2e48d40fdac28b3c9ce96b634fb88e0d7aedd3cec567173e9428800',
        buyLink: 'https://www.sunlu.com/?sca_ref=8673819.e6xLp1xWaj/',
        price: '20€'
      },
      {
        id: 'nouvel-equipement-5',
        category: 8,
        x: 59.6,
        y: 95.8,
        name: 'Trépied',
        image: 'https://m.media-amazon.com/images/I/71Wawa99UgL._AC_SL1500_.jpg',
        buyLink: 'https://amzn.to/4xA22dl',
        price: '38€'
      },
      {
        id: 'nouvel-equipement-6',
        category: 8,
        x: 63.9,
        y: 69.4,
        name: 'DJI Osmo Pocket 3',
        image: 'https://m.media-amazon.com/images/I/51GdrLQctrL._AC_SL1285_.jpg',
        buyLink: 'https://amzn.to/4wm0nHq',
        price: '439€'
      },
      {
        id: 'nouvel-equipement-7',
        category: 8,
        x: 42.9,
        y: 70.6,
        name: 'DJI Mic 2',
        image: 'https://m.media-amazon.com/images/I/514wrrdv+8L._AC_SL1500_.jpg',
        buyLink: 'https://amzn.to/4wQindT',
        price: '59€'
      },
      {
        id: 'nouvel-equipement-8',
        category: 8,
        x: 50.6,
        y: 66.7,
        name: 'Batterie DJI Osmo Pocket 3',
        image: 'https://m.media-amazon.com/images/I/51R90r4WWpL._AC_SL1500_.jpg',
        buyLink: 'https://amzn.to/4wsPYJP',
        price: '69€'
      },
      {
        id: 'nouvel-equipement-9',
        category: 8,
        x: 43.6,
        y: 51,
        name: 'Bras pour unboxings',
        image: 'https://m.media-amazon.com/images/I/61GBjUFfk+L._AC_SL1500_.jpg',
        buyLink: 'https://amzn.to/4wqx2M1',
        price: '33€'
      },
      {
        id: 'nouvel-equipement-10',
        category: 3,
        x: 64,
        y: 24.4,
        name: 'AWTRIX',
        image: 'https://m.media-amazon.com/images/I/51wNiychaWL._AC_SL1500_.jpg',
        buyLink: 'https://amzn.to/4xCyrA1',
        price: '52€'
      },
      {
        id: 'nouvel-equipement-11',
        category: 6,
        x: 55.1,
        y: 31.5,
        name: 'Logo DIY',
        buyLink: 'https://www.youtube.com/watch?v=i5b1K8W7S2I',
        price: 'N/A'
      },
      {
        id: 'nouvel-equipement-12',
        category: 8,
        x: 69.3,
        y: 70.6,
        name: 'Support de sangle de sac à dos',
        image: 'https://m.media-amazon.com/images/I/61UU8Fm44aL._AC_SL1000_.jpg',
        buyLink: 'https://amzn.to/4xBwKmv',
        price: '26€'
      },
      {
        id: 'nouvel-equipement-13',
        category: 3,
        x: 75.6,
        y: 69.4,
        name: 'Phillips HUE LED Strip',
        image: 'https://m.media-amazon.com/images/I/71uIoLd8nLL._AC_SL1500_.jpg',
        buyLink: 'https://amzn.to/3SqhTfH',
        price: '69€'
      }
    ]
  },
  {
    id: 'homelab',
    title: 'Homelab',
    image: 'assets/homelab.jpeg',
    description: 'Mon p\'tit rack, la pièce maîtresse de mon homelab',
    items: [
      {
        id: 'nouvel-equipement',
        category: 7,
        x: 51.8,
        y: 78.2,
        name: 'Synology DS923+',
        image: 'https://m.media-amazon.com/images/I/610MHG+3QPL._AC_SL1500_.jpg',
        buyLink: 'https://amzn.to/4gsZS9D',
        price: '600€'
      },
      {
        id: 'nouvel-equipement-2',
        category: 7,
        name: 'IronWolf 4To',
        description: 'x3',
        image: 'https://m.media-amazon.com/images/I/61TZBcjvfUL._AC_SL1500_.jpg',
        buyLink: 'https://amzn.to/4gtxMek',
        price: '200€'
      },
      {
        id: 'nouvel-equipement-3',
        category: 7,
        name: 'IronWolf 16To',
        description: 'x1',
        image: 'https://m.media-amazon.com/images/I/61dYWqOhNnL._AC_SL1500_.jpg',
        buyLink: 'https://amzn.to/4wIeRSh',
        price: '730€'
      },
      {
        id: 'nouvel-equipement-4',
        category: 7,
        x: 54.1,
        y: 57.7,
        name: 'OptiPlex 7070',
        image: 'https://m.media-amazon.com/images/I/61KUey9SDmL._AC_SL1498_.jpg',
        buyLink: 'https://amzn.to/4xAeY2Q',
        price: '289€'
      },
      {
        id: 'nouvel-equipement-5',
        category: 7,
        x: 35,
        y: 66.7,
        name: 'Rack imprimé en 3D',
        buyLink: 'https://www.youtube.com/watch?v=GZmOgrfJXWs',
        price: 'N/A'
      },
      {
        id: 'nouvel-equipement-6',
        category: 7,
        x: 53.5,
        y: 50.2,
        name: 'TP-Link Omada TL-SG2210P Switch PoE',
        image: 'https://m.media-amazon.com/images/I/41aRi2Xsp0L._AC_SL1000_.jpg',
        buyLink: 'https://amzn.to/4zepHBQ',
        price: '125€'
      },
      {
        id: 'nouvel-equipement-7',
        category: 7,
        x: 55,
        y: 33.7,
        name: 'Beelink Mini S12 Pro',
        image: 'https://m.media-amazon.com/images/I/71DNBYaKkWL._AC_SL1500_.jpg',
        buyLink: 'https://amzn.to/3U9HnOQ',
        price: '359€'
      },
      {
        id: 'nouvel-equipement-8',
        category: 7,
        x: 55.2,
        y: 21.2,
        name: 'Minix NEO Z350-0dB',
        image: 'https://m.media-amazon.com/images/I/61LcgJYyHlL._AC_SL1500_.jpg',
        buyLink: 'https://amzn.to/4g5woNT',
        price: '569€'
      }
    ]
  },
  {
    id: 'daily',
    title: 'Daily & Travel',
    image: 'assets/daily-travel.JPG',
    description: 'Le matos que j\'utilise au quotidien et que je recommande. Et comme il restait beaucoup de place sur la table, j\'ai ajouté le matos de voyages / déplacement',
    items: [
      {
        id: 'nouvel-equipement',
        category: 9,
        x: 18.4,
        y: 18.1,
        name: 'Trousse de Toilette Pliable et à Suspendre',
        image: 'https://m.media-amazon.com/images/I/814iof+QMtL._AC_SL1500_.jpg',
        buyLink: 'https://amzn.to/3TT40Hl',
        price: '25€'
      },
      {
        id: 'nouvel-equipement-2',
        category: 10,
        x: 37.9,
        y: 12.7,
        name: 'Tech Pouch Peak Design',
        image: 'https://m.media-amazon.com/images/I/61diZr9kkUL._AC_SL1000_.jpg',
        buyLink: 'https://amzn.to/4ziRjWw',
        price: '49€'
      },
      {
        id: 'nouvel-equipement-3',
        category: 9,
        x: 41.5,
        y: 63.1,
        name: 'Station de charge pliable',
        description: 'Apple Watch, iPhone, AirPods',
        image: 'https://m.media-amazon.com/images/I/71CX6pWF7QL._AC_SL1500_.jpg',
        buyLink: 'https://www.amazon.fr/dp/B0CW1T3394?ref=ppx_yo2ov_dt_b_fed_asin_title&th=1',
        price: '33€'
      },
      {
        id: 'nouvel-equipement-4',
        category: 9,
        x: 83.3,
        y: 79.1,
        name: 'Sac à linge sale',
        image: 'https://m.media-amazon.com/images/I/51dzXpgDmpL._AC_SL1500_.jpg',
        buyLink: 'https://amzn.to/4xF8Run',
        price: '8€'
      },
      {
        id: 'nouvel-equipement-5',
        category: 9,
        x: 54.8,
        y: 16.1,
        name: 'Osprey Ultralight 18L',
        image: 'https://m.media-amazon.com/images/I/51kyoABOz5L._AC_SL1500_.jpg',
        buyLink: 'https://amzn.to/4g2LCD5',
        price: '38€'
      },
      {
        id: 'nouvel-equipement-6',
        category: 9,
        x: 66.5,
        y: 80.5,
        name: 'Thule Compression Packing Cube',
        image: 'https://m.media-amazon.com/images/I/81GCxkYOHHL._AC_SL1500_.jpg',
        buyLink: 'https://amzn.to/4zfjvJO',
        price: '43€'
      },
      {
        id: 'nouvel-equipement-7',
        category: 10,
        x: 10.7,
        y: 48.4,
        name: 'Anker Batterie Externe 25000 mAh 165W',
        image: 'https://m.media-amazon.com/images/I/61vA9Tc6djL._AC_SL1500_.jpg',
        buyLink: 'https://amzn.to/4qcL02k',
        price: '89€'
      },
      {
        id: 'nouvel-equipement-8',
        category: 9,
        x: 42.2,
        y: 38.9,
        name: 'Sac à bandouilière',
        description: 'Pour y ranger la Osmo Pocket et accessoires',
        image: 'https://m.media-amazon.com/images/I/71p-vSn+ZEL._AC_SL1500_.jpg',
        buyLink: 'https://www.amazon.fr/dp/B0F62X8YWY?ref=ppx_yo2ov_dt_b_fed_asin_title&th=1',
        price: '39€'
      },
      {
        id: 'nouvel-equipement-9',
        category: 9,
        x: 55.2,
        y: 54.4,
        name: 'Nanobag Plus 19L',
        image: 'https://m.media-amazon.com/images/I/410YORZDx6L._AC_SX466_.jpg',
        buyLink: 'https://amzn.to/4bObscW',
        price: '18€'
      },
      {
        id: 'nouvel-equipement-10',
        category: 10,
        x: 25,
        y: 45.8,
        name: 'Câble renforcé en Kevlar',
        image: 'https://m.media-amazon.com/images/I/61E7BJ0fYsL._SL1000_.jpg',
        buyLink: 'https://amzn.to/4cjfU3r',
        price: '31€'
      },
      {
        id: 'nouvel-equipement-11',
        category: 10,
        x: 51,
        y: 78,
        name: 'AirPods 4',
        image: 'https://m.media-amazon.com/images/I/51MlTIMDdsL._AC_SL1500_.jpg',
        buyLink: 'https://amzn.to/4g6nbEK',
        price: '173€'
      },
      {
        id: 'nouvel-equipement-12',
        category: 9,
        x: 48.1,
        y: 64.3,
        name: 'Adaptateur de prise universelle',
        image: 'https://m.media-amazon.com/images/I/61CSmc4N+-L._AC_SL1216_.jpg',
        buyLink: 'https://amzn.to/4fY1Op6',
        price: '27€'
      },
      {
        id: 'nouvel-equipement-13',
        category: 10,
        x: 43.9,
        y: 84.7,
        name: 'Coque dBrand Grip',
        image: 'https://cdn.shopify.com/s/files/1/0733/5867/2170/files/65c7afcf-7dd4-4219-8a33-37a5052efeb0.jpg?v=1763414968',
        buyLink: 'https://dbrand.com/shop/grip/iphone-17-pro-max-cases?design=something-dark',
        price: '60€'
      },
      {
        id: 'nouvel-equipement-14',
        category: 10,
        x: 36.1,
        y: 82.9,
        name: 'iPhone 17 Pro Max',
        image: 'https://m.media-amazon.com/images/I/71YBR7rf6sL._AC_SL1500_.jpg',
        buyLink: 'https://amzn.to/4g5bmyL',
        price: '1309€'
      },
      {
        id: 'nouvel-equipement-15',
        category: 10,
        x: 22.7,
        y: 82.7,
        name: 'iPad Pro 11" 2020',
        image: 'https://m.media-amazon.com/images/I/81ilcUQUC-L._AC_SL1500_.jpg',
        buyLink: 'https://amzn.to/3U9LmLi',
        price: '600€'
      },
      {
        id: 'nouvel-equipement-16',
        category: 10,
        x: 11.1,
        y: 77.2,
        name: 'Apple Watch SE ',
        image: 'https://m.media-amazon.com/images/I/616Y66Csy8L._AC_SL1500_.jpg',
        buyLink: 'https://amzn.to/3TS6Dco',
        price: '269€'
      },
      {
        id: 'nouvel-equipement-17',
        category: 10,
        x: 21.8,
        y: 61.3,
        name: 'AYN Thor',
        image: 'https://www.ayntec.com/cdn/shop/files/4fe40f089696834c4906303a743d01c5_d891fc5b-3473-449a-85c1-56663e291fcf.jpg?v=1755855604',
        buyLink: 'https://www.youtube.com/watch?v=MyI5UWv-EEM',
        price: '480€'
      },
      {
        id: 'nouvel-equipement-18',
        category: 10,
        x: 33.5,
        y: 61.5,
        name: 'Ekster Wallet Pro',
        image: 'https://www.ekster.com/cdn/shop/files/Wallet_-_Juniper_Green_Infograph_01.png?v=1763718021',
        buyLink: 'https://www.ekster.com/en-eu/products/ekster-wallet',
        price: '75€'
      },
      {
        id: 'nouvel-equipement-19',
        category: 10,
        x: 76.9,
        y: 34.1,
        name: 'AER City Pack Pro ',
        description: 'J\'ai la première version mais plus commercialisée',
        image: 'https://cld.accentuate.io/42653034119264/1774629156722/AER21064_1_citypackpro224l_black_34hero.jpg?v=1774906164000&options=w_540',
        buyLink: 'https://aersf.com/collections/city-collection/products/city-pack-pro-2-24l?country=FR',
        price: '240€'
      },
      {
        id: 'nouvel-equipement-20',
        category: 10,
        name: 'Anker Magsafe ',
        image: 'https://m.media-amazon.com/images/I/61NvRDu8CxL._AC_SL1500_.jpg',
        buyLink: 'https://link.amazon/B0fXCsZpo',
        price: '59€'
      },
      {
        id: 'nouvel-equipement-21',
        category: 9,
        name: 'Gritin masque',
        image: 'https://m.media-amazon.com/images/I/81JYcf0mIdL._AC_SL1500_.jpg',
        buyLink: 'https://link.amazon/B0i7CA4P3',
        price: '8€'
      },
      {
        id: 'nouvel-equipement-22',
        category: 10,
        name: 'AirTags',
        image: 'https://m.media-amazon.com/images/I/61a9WSqyGEL._AC_SL1500_.jpg',
        buyLink: 'https://link.amazon/B0aZuutkw',
        price: '30'
      }
    ]
  }
];
