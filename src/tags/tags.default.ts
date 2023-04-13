import type { DefaultTagGroup } from './tags.types';


export const DEFAULT_TAGS:DefaultTagGroup[]= [
  {
    groupName: 'Food and drink', 
    iconName: 'fa-utensils',
    tags: [
      { name: 'Cafe', iconName: 'fa-martini-glass-citrus' }, 
      { name: 'Restaraunts', iconName: 'fa-bowl-rice' }, 
      { name: 'Supermarket', iconName: 'fa-cart-shopping' }
    ],
  },
  {
    groupName: 'Transport', 
    iconName: 'fa-car-side',
    tags: [
      { name: 'Gas', iconName: 'fa-gas-pump' }, 
      { name: 'Maintenatnce', iconName: 'fa-oil-can' }
    ],
  },
  {
    groupName: 'Bills', 
    iconName: 'fa-file-lines',
    tags: [
      { name: 'Internet', iconName: 'fa-globe' }, 
      { name: 'Water', iconName: 'fa-faucet-drip' }, 
      { name: 'Electricity', iconName: 'fa-plug' }
    ],
  },
  {
    groupName: 'Brands', 
    iconName: 'fa-copyright',
    tags: [
      { name: 'Shopee', iconName: 'fa-cart-plus' }, 
      { name: 'Lotus', iconName: 'fa-tree' }, 
    ],
  },
];
