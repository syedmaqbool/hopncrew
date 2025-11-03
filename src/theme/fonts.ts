import { Platform } from 'react-native';

export const FONTS = {
  regular: Platform.OS === 'ios' ? 'Biennale-Regular' : 'BiennaleRegular',
  medium: Platform.OS === 'ios' ? 'Biennale-Medium' : 'BiennaleMedium',
  semibold: Platform.OS === 'ios' ? 'Biennale-SemiBold' : 'BiennaleSemiBold',
  bold: Platform.OS === 'ios' ? 'Biennale-Bold' : 'BiennaleBold',
} as const;
