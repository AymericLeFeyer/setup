const categoriesData = [
  { id: 1, name: 'PC de jeux', showTotal: true },
  { id: 2, name: 'Setup', showTotal: true },
  { id: 3, name: 'Mac', showTotal: true },
  { id: 4, name: 'Autre', showTotal: false }
];

const setupData = [
  {
    id: 'keyboard',
    category: 2,
    x: 46, // percentage from left
    y: 56, // percentage from top
    name: 'Clavier Keychron K8Ji qwerty',
    image: 'https://keychron.fr/cdn/shop/products/Keychron-K8-tenkeyless-wireless-mechanical-keyboard-for-Mac-Windows-iOS-RGB-white-backlight-with-Gateron-switch-red_3bdf2ef0-71ea-40b8-bd6c-e759569196a8.jpg?v=1750842904&width=1214',
    buyLink: 'https://keychron.fr/products/keychron-k8-tenkeyless-wireless-mechanical-keyboard',
    price: '106€'
  },
  {
    id: 'mouse',
    category: 2,
    x: 61,
    y: 57,
    name: 'Logitech G502 Lightspeed',
    buyLink: 'https://amzn.to/4fOydAk',
    image: 'https://m.media-amazon.com/images/I/718b9wK3eaL._AC_SL1500_.jpg',
    price: '124€'
  },
  {
    id: 'main-monitor',
    category: 2,
    x: 49,
    y: 30,
    name: 'Écran KTC M27P20 27" 4K miniled 144hz',
    color: 'black',
    image: 'http://img.gkbcdn.com/p/2024-07-12/KTC-M27P20-Pro-Mini-LED-Gaming-Monitor-27in-3840x2160-UHD-160Hz-10000421-1._w500_p1_.jpg',
    buyLink: 'https://fr.geekbuying.com/item/KTC-M27P20-Pro-Moniteur-de-jeu-mini-LED-27-pouces-3840-x-2160-UHD-160-Hz-10000421.html',
    price: '700€'
  },
  {
    id: 'headphones',
    category: 3,
    x: 88,
    y: 60,
    name: 'Macbook Pro M5 14" 32Go',
    description: 'Pc principale',
    image: 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/mac-macbook-pro-summary-select-202601-14inch-spaceblack?wid=5120&hei=3280&fmt=webp&qlt=90&.v=aXlkdGF0T0RUUVdDckNLaUc0OEE0MlllLy9mUUZibXJtaURkcVBmZXl6TGZwYzY0U3JBMlVNMzZiaWVuTi9EK3FUbGFVTWR0Ti93a3VSRzN5cEpVUjNFeUJKK3phOU5VdEl3YWNDUExmb2l0Si9xVzRhSS8wWUpZZHdJZjBBRG1VTVFxaHdBZEpFclJzdzdiaUxXV2Jn&traceId=1',
    buyLink: 'https://www.apple.com/fr/shop/buy-mac/macbook-pro/14-pouces-space-black-verre-d%E2%80%99%C3%A9cran-standard-puce-apple-m5-cpu-10-c%C5%93urs-gpu-10-c%C5%93urs-32-go-m%C3%A9moire-1to-stockage',
    price: '2400€'
  },
  {
    id: 'mic',
    category: 2,
    x: 4,
    y: 43,
    name: 'Micro Elgato Wave:3',
    image: 'https://m.media-amazon.com/images/I/61KjhEX33JL._AC_SL1500_.jpg',
    buyLink: 'https://amzn.to/4uzELGv',
    price: '93€'
  },
  {
    id: 'camera',
    category: 2,
    x: 50,
    y: 17,
    main: true,
    name: 'Panasonic DC-GX9',
    image: 'https://apprendre-la-photo.fr/wp-content/uploads/2024/07/f35537b9-774c-4571-9c5d-440622736719-750x405.jpeg',
    buyLink: 'https://apprendre-la-photo.fr/panasonic-lumix-gx9/',
    price: '799€'
  },
  {
    id: 'cam-link',
    category: 2,
    x: 50,
    y: 17,
    name: 'Elgato Cam Link 4K',
    description: 'Pour récupérer le flux de la caméra sur le PC',
    image: 'https://m.media-amazon.com/images/I/5146dDMeV6L._AC_SL1500_.jpg',
    buyLink: 'https://amzn.to/4fNTb2e',
    price: '74€'
  },
  {
    id: 'mic-arm',
    category: 2,
    x: 7.7,
    y: 56,
    name: 'Bras micro Elgato Wave Mic Arm LP',
    description: 'Pratique car on peut faire passer le câble dans le bras pour le cacher',
    image: 'https://m.media-amazon.com/images/I/51Bj5bGMDLL._AC_SL1500_.jpg',
    buyLink: 'https://amzn.to/4vV0Yjy',
    price: '96€'
  },
  {
    id: 'streamdeck-pedal',
    category: 2,
    x: 51,
    y: 92,
    name: 'Elgato Stream Deck Pedal',
    image: 'https://m.media-amazon.com/images/I/71YAZb1WDJL._AC_SL1500_.jpg',
    buyLink: 'https://amzn.to/3QhZpwX',
    price: '79€'
  },
  {
    id: 'streamdeck-neo',
    category: 2,
    x: 27.5,
    y: 54.4,
    name: 'Elgato Stream Deck Neo',
    image: 'https://m.media-amazon.com/images/I/61YXUwCxbhL._AC_SL1500_.jpg',
    buyLink: 'https://amzn.to/4oAWLiE',
    price: '84€'
  },
  {
    id: 'gamepad',
    category: 2,
    x: 33.3,
    y: 51.4,
    name: 'Manette 8Bitdo Ultimate 2',
    description: 'Pratique car dispose d\'un stande de charge',
    image: 'https://m.media-amazon.com/images/I/61HOGKr6RJL._AC_SL1500_.jpg',
    buyLink: 'https://amzn.to/4ovKYC4',
    price: '69€'
  },
  {
    id: 'airpods-max',
    category: 3,
    x: 85,
    y: 52.1,
    name: 'Casque Apple Airpods Max',
    image: 'https://m.media-amazon.com/images/I/71ihnpd4N3L._AC_SL1500_.jpg',
    buyLink: 'https://amzn.to/4uDS1Ks',
    price: '529€'
  },
  {
    id: 'headset',
    category: 2,
    coordinates: [
      { x: 72, y: 50.6 },
      { x: 14, y: 66 }
    ],
    name: 'Casque Steelseries Arctis Pro Wireless',
    description: 'Pratique car dispose d\'un système de double batterie',
    image: 'https://images.ctfassets.net/hmm5mo4qf4mf/6ZvNWxUyv1wzYaDuFGkO3Q/485bd0222fed88a4e9350eed2c6c6644/arctis_pro_wl_black_livingroom_wide_4k_001.jpg__1920x1080_q100_crop-fit_optimize_subsampling-2-2314.jpg?fm=webp&q=90&fit=scale&w=1920',
    buyLink: 'https://steelseries.com/fr-fr/gaming-headsets/arctis-pro',
    price: '370€'
  },
  {
    id: 'trackpad',
    category: 2,
    x: 69,
    y: 55.6,
    name: 'Apple Magic Trackpad',
    description: 'Support imprimer en 3D pour avoir un angle',
    image: 'https://m.media-amazon.com/images/I/51y-xuyGINL._AC_SL1500_.jpg',
    buyLink: 'https://amzn.to/4oqJFUM',
    price: '116€'
  },
  {
    id: 'dock',
    category: 2,
    x: 82.9,
    y: 67.4,
    name: 'Dock Thunderbolt',
    image: 'https://m.media-amazon.com/images/I/61beBFZ3keL._AC_SL1500_.jpg',
    buyLink: 'https://amzn.to/4gnx8zu',
    price: '165€'
  },
  {
    id: 'desk',
    category: 2,
    coordinates: [
      { x: 50.5, y: 64.4 },
      { x: 94, y: 67 }
    ],
    name: 'Bureau assis/debout',
    image: 'http://img.gkbcdn.com/p/2021-01-29/acgam-et225e-electric-three-stage-legs-standing-desk-frame-black-1611887099567._w500_.jpg',
    buyLink: 'https://www.geekbuying.com/item/ACGAM-ET225E-Electric-Three-stage-Legs-Standing-Desk-Frame-Black-434400.html',
    price: '367€'
  },
  {
    id: 'display-2',
    category: 2,
    coordinates: [
      { x: 25, y: 29 },
      { x: 75, y: 29 }
    ],
    color: 'black',
    name: 'Écrans SAMSUNG S27E510C 1080p 60hz incurvé',
    image: 'https://media.shopping-compare.com/files/products/photos/lcd/SAMS27E510C_2.jpg',
    buyLink: 'https://www.lcd-compare.com/moniteur-SAMS27E510C-SAMSUNG-S27E510C.htm#lightbox',
    price: '300€'
  },
  {
    id: 'foot-rest',
    category: 2,
    coordinates: [
      { x: 51, y: 84 }
    ],
    name: 'Repose-pieds Bureau',
    image: 'https://m.media-amazon.com/images/I/81T+oGxTk-L._AC_SL1500_.jpg',
    buyLink: 'https://amzn.to/4uXe5jr',
    price: '30€'
  },
  {
    id: 'chair',
    category: 2,
    name: 'Siège Steelcase Please',
    image: 'https://fr.steelcase.com/cdn/shop/products/steelcase-please-onyx-front_2000x.jpg?v=1757659411',
    buyLink: 'https://fr.steelcase.com/products/please?variant=42077392437439',
    price: '1100€'
  },
  {
    id: 'notebook',
    category: 4,
    coordinates: [
      { x: 20, y: 59 }
    ],
    name: 'Notebook Louise Carmen Honoré (M)',
    image: 'https://louisecarmen.com/cdn/shop/files/naturel_54a32253-18e8-4175-90a1-69e9e8b3ff97_4000x@2x.progressive.jpg?v=1768326147',
    buyLink: 'https://louisecarmen.com/en/products/capsule-honore',
    price: '159€'
  },
  {
    id: 'pc-cpu',
    category: 1,
    name: 'CPU AMD Ryzen 7 5700G',
    image: 'https://m.media-amazon.com/images/I/510zj43C3iL._AC_SL1000_.jpg',
    buyLink: 'https://amzn.to/43H5gyT',
    price: '209€'
  },
  {
    id: 'pc-cpu-fan',
    category: 1,
    name: 'Ventirad Noctua NH-C14S',
    image: 'https://m.media-amazon.com/images/I/81SPOa8QnuL._SL1500_.jpg',
    buyLink: 'https://amzn.to/4ovT2T7',
    price: '90€'
  },
  {
    id: 'pc-gpu',
    category: 1,
    name: 'Carte graphique Nvidia RTX 3070',
    image: 'https://www.notebookcheck.biz/fileadmin/Notebooks/NVIDIA/MSI_RTX_3070_Gaming_X_Trio/MSI_GeForce_RTX_3070_Gaming_X_Trio_17.jpg',
    buyLink: 'https://www.nvidia.com/fr-fr/geforce/graphics-cards/30-series/rtx-3070-3070ti/',
    price: '550€'
  },
  {
    id: 'pc-ram',
    category: 1,
    name: 'Ram 64Go Corsair 3600mhz DDR4',
    image: 'https://m.media-amazon.com/images/I/51gLnYN1W7L._AC_SL1100_.jpg',
    buyLink: 'https://amzn.to/4uEUgwX',
    price: '200€'
  },
  {
    id: 'pc-ssd',
    category: 1,
    name: 'SSD 2TO WD_BLACK SN850X',
    image: 'https://m.media-amazon.com/images/I/61jQCrK6mFL._AC_SL1500_.jpg',
    buyLink: 'https://amzn.to/3SoBcpd',
    price: '175€'
  },
  {
    id: 'pc-network-card',
    category: 1,
    name: 'Carte réseau 2.5G PCI-E',
    image: 'https://m.media-amazon.com/images/I/61jNjSNSj3L._AC_SL1143_.jpg',
    buyLink: 'https://amzn.to/3S9QlLe',
    price: '35€'
  },
  {
    id: 'pc-fan',
    category: 1,
    name: '3 ventilateurs Noctua NF-F12',
    image: 'https://m.media-amazon.com/images/I/81mSPKcv89L._AC_SL1500_.jpg',
    buyLink: 'https://amzn.to/3Q4SQhf',
    price: '75€'
  },
  {
    id: 'pc-zigbee',
    category: 1,
    name: 'Carte pour allumer/éteindre le PC Zigbee',
    image: 'https://ae-pic-a1.aliexpress-media.com/kf/S60a5a851020d41edb19f8a2dd6f99d668.jpg_960x960q75.jpg_.avif',
    buyLink: 'https://fr.aliexpress.com/item/1005006090821609.html?spm=a2g0o.order_detail.order_detail_item.3.55ea7d56eRTsLs&gatewayAdapt=glo2fra',
    price: '24€'
  },
  {
    id: 'pc-zigbee',
    category: 1,
    name: 'Carte Wifi/Bluetooth',
    image: 'https://ae-pic-a1.aliexpress-media.com/kf/Sc804cd7c3f6946149ddc1160730c4dccb.jpg_960x960q75.jpg_.avif',
    buyLink: 'https://fr.aliexpress.com/item/1005006818372682.html?spm=a2g0o.order_list.order_list_main.5.21ef5e5bmFVIX8&gatewayAdapt=glo2fra',
    price: '22€'
  },
  {
    id: 'pc-case',
    category: 1,
    name: 'Boitier pc rack 4U',
    image: 'https://m.media-amazon.com/images/I/71N4NMiz-pL._AC_SL1500_.jpg',
    buyLink: 'https://www.amazon.co.uk/RackOwl-Chassis-Rackmount-Devices-Motherboards-Silver-Black/dp/B0DJJNWHXD',
    price: '300€'
  },
  {
    id: 'pc-psu',
    category: 1,
    name: 'Alimentation Be quiet! BN211 Power Zone 750W 80 Plus Bronze',
    description: 'Alimentation que j\'ai depuis 10 ans, 0 soucis',
    image: 'https://m.media-amazon.com/images/I/51kfJ88unLL._AC_SL1000_.jpg',
    buyLink: 'https://amzn.to/4ospHJg',
    price: '120€'
  },
  {
    id: 'test',
    name: 'test',
    image: 'test',
    buyLink: 'test',
    price: '159€'
  }
];
