import type { DefaultTagGroup } from './tags.types';


export const DEFAULT_TAGS:DefaultTagGroup[]= [
  {
    groupName: 'Food and drink', 
    iconInfo: 'fa-utensils',
    tags: [
      { name: 'Cafe', iconInfo: 'fa-martini-glass-citrus' }, 
      { name: 'Restaraunts', iconInfo: 'fa-bowl-rice' }, 
      { name: 'Supermarket', iconInfo: 'fa-cart-shopping' }
    ],
  },
  {
    groupName: 'Transport', 
    iconInfo: 'fa-car-side',
    tags: [
      { name: 'Gas', iconInfo: 'fa-gas-pump' }, 
      { name: 'Maintenatnce', iconInfo: 'fa-oil-can' }
    ],
  },
  {
    groupName: 'Bills', 
    iconInfo: 'fa-file-lines',
    tags: [
      { name: 'Internet', iconInfo: 'fa-globe' }, 
      { name: 'Water', iconInfo: 'fa-faucet-drip' }, 
      { name: 'Electricity', iconInfo: 'fa-plug' }
    ],
  },
  {
    groupName: 'Brands', 
    iconInfo: 'fa-copyright',
    tags: [
      { name: 'Shopee', iconInfo: 'fa-cart-plus' }, 
      { name: 'Lotus', iconInfo: 'fa-tree' }, 
    ],
  },
];
