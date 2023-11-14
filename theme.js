import { extendTheme } from "@chakra-ui/react";

export default extendTheme({
  breakpoints: {
    xs: '1px'
  },
  colors: {
    bgColor: '#F4EEE0',
    primary: '#393939',
    primaryFg: '#222222',
    primaryText: '#D3D3D3',
    secondaryText: '#000',
    secondary: '#FFFFFF',
    secondaryFg: '#656565',
    creation: 'green',
    exclusion: 'red',
    openMenu: 'green',
    openMenuHover: 'lightgreen',
    closeMenu: 'red',
    closeMenuHover: 'lightpink'
  },
  fonts: {
    primary: 'Roboto, sans-serif',
    secondary: 'Fondamento, cursive',
  }
});