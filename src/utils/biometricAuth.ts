import { Platform } from 'react-native';
import * as Keychain from 'react-native-keychain';
import ReactNativeBiometrics from 'react-native-biometrics';

const rnBiometrics = new ReactNativeBiometrics({ allowDeviceCredentials: false });
const SERVICE = 'com.hopnground.refresh-token';

export async function getBiometryType(): Promise<'FaceID' | 'TouchID' | 'Biometrics' | null> {
  // RN Keychain returns 'FaceID' | 'TouchID' | 'Biometrics' | null
  const t = await Keychain.getSupportedBiometryType();
  return (t as any) ?? null;
}

export async function isBiometricsAvailable(): Promise<boolean> {
  try {
    const { available } = await rnBiometrics.isSensorAvailable();
    return available;
  } catch {
    return false;
  }
}

export async function saveRefreshToken(token: string): Promise<boolean> {
  try {
    if (Platform.OS === 'ios') {
      await Keychain.setGenericPassword('user', token, {
        service: SERVICE,
        accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED,
        accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_CURRENT_SET,
      });
      return true;
    }
    // Android: prefer hardware-backed, fall back if unavailable
    try {
      await Keychain.setGenericPassword('user', token, {
        service: SERVICE,
        securityLevel: Keychain.SECURITY_LEVEL.SECURE_HARDWARE,
      });
    } catch {
      await Keychain.setGenericPassword('user', token, {
        service: SERVICE,
        securityLevel: Keychain.SECURITY_LEVEL.ANY,
      });
    }
    return true;
  } catch (e) {
    console.warn('saveRefreshToken error', e);
    return false;
  }
}

export async function hasStoredToken(): Promise<boolean> {
   const creds = await Keychain.getGenericPassword({ service: SERVICE });
  return creds !== false;             // <- explicit boolean check
}

export async function loginWithBiometrics(): Promise<string | null> {
  try {
    if (!(await hasStoredToken())) return null;

    if (Platform.OS === 'android') {
      const { available } = await rnBiometrics.isSensorAvailable();
      if (!available) return null;

      const { success } = await rnBiometrics.simplePrompt({ promptMessage: 'Login with biometrics' });
      if (!success) return null;

      const creds = await Keychain.getGenericPassword({ service: SERVICE });
      if (creds === false) return null;   // <- narrow union
      return creds.password;              // creds is UserCredentials here
    }

    // iOS
    const creds = await Keychain.getGenericPassword({
      service: SERVICE,
      authenticationPrompt: { title: 'Login with Face ID' },
    });
    if (creds === false) return null;     // <- narrow union
    return creds.password;
  } catch (e) {
    console.warn('loginWithBiometrics error', e);
    return null;
  }
  async function readToken(): Promise<string | null> {
  const r = await Keychain.getGenericPassword({ service: SERVICE });
  return r === false ? null : r.password;
}
}
