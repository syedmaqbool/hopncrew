import { Platform } from 'react-native';

export const FONTS = {
  regular: Platform.select({
    ios: 'FONTSPRINGDEMO-BiennaleRegular',
    android: 'BiennaleRegular',
  }),
  medium: Platform.select({
    ios: 'FONTSPRINGDEMO-BiennaleMediumRegular',
    android: 'BiennaleMedium',
  }),
  semibold: Platform.select({
    ios: 'FONTSPRINGDEMO-BiennaleSemiBoldRegular',
    android: 'BiennaleSemiBold',
  }),
  bold: Platform.select({
    ios: 'FONTSPRINGDEMO-BiennaleBoldRegular',
    android: 'BiennaleBold',
  }),
} as const;
