import { UserAuthSession } from '../types';

const STORAGE_KEY_AUTH = 'enat_auth_session';
const STORAGE_KEY_TEMP_PASSWORD = 'enat_temp_keycloak_password';
const STORAGE_KEY_ACTIVATION_CODE = 'enat_activation_code';

export interface KeycloakNotification {
  id: string;
  type: 'ACTIVATION_OTP' | 'TEMP_PASSWORD' | 'SECURITY_ALERT';
  title: string;
  message: string;
  code?: string;
  timestamp: string;
}

export class MockKeycloakService {
  private static listeners: ((notification: KeycloakNotification) => void)[] = [];

  public static subscribeNotifications(callback: (notification: KeycloakNotification) => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((cb) => cb !== callback);
    };
  }

  private static notify(notification: KeycloakNotification) {
    this.listeners.forEach((cb) => cb(notification));
  }

  public static getSavedSession(): UserAuthSession {
    const raw = localStorage.getItem(STORAGE_KEY_AUTH);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (e) {
        console.error('Failed to parse auth session', e);
      }
    }
    return {
      userId: 'usr_enat_77491',
      phoneNumber: '+251 91 148 9204',
      fullName: 'Selamawit Tadesse Bekele',
      email: 'selamawit.t@enatbank.et',
      isActivated: false,
      hasChangedPin: false,
      pinCode: '7492',
      biometricsEnabled: true,
      faceIdEnabled: true,
    };
  }

  public static saveSession(session: UserAuthSession) {
    localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(session));
  }

  /**
   * Generates or retrieves the active activation code sent via Keycloak SMS
   */
  public static requestActivationCode(phoneOrAccount: string): { code: string; expiresSec: number } {
    const defaultCode = '849201';
    localStorage.setItem(STORAGE_KEY_ACTIVATION_CODE, defaultCode);

    // Simulate SMS dispatch
    setTimeout(() => {
      this.notify({
        id: 'msg-' + Date.now(),
        type: 'ACTIVATION_OTP',
        title: 'Keycloak IAM • Enat Bank SMS',
        message: `Your Enat Bank mobile activation code is ${defaultCode}. Valid for 10 minutes. Never share this with anyone.`,
        code: defaultCode,
        timestamp: 'Just now',
      });
    }, 400);

    return { code: defaultCode, expiresSec: 600 };
  }

  /**
   * Step 1: User enters activation code.
   * If correct, Keycloak sends a new temporary password!
   */
  public static verifyActivationCode(enteredCode: string): { success: boolean; message: string; tempPassword?: string } {
    const saved = localStorage.getItem(STORAGE_KEY_ACTIVATION_CODE) || '849201';
    // Allow either the official code or a 6-digit test code
    if (enteredCode.trim() === saved || enteredCode.trim() === '849201' || enteredCode.trim() === '123456') {
      const generatedTempPassword = 'Enat@Pass' + Math.floor(1000 + Math.random() * 9000);
      localStorage.setItem(STORAGE_KEY_TEMP_PASSWORD, generatedTempPassword);

      // Trigger Keycloak notification for temporary password
      setTimeout(() => {
        this.notify({
          id: 'msg-' + Date.now(),
          type: 'TEMP_PASSWORD',
          title: 'Keycloak IAM • Temporary Credentials',
          message: `Activation verified! Your temporary system password is: ${generatedTempPassword}. Please enter it to continue setup.`,
          code: generatedTempPassword,
          timestamp: 'Just now',
        });
      }, 500);

      return {
        success: true,
        message: 'Activation code verified by Keycloak IAM service.',
        tempPassword: generatedTempPassword,
      };
    }

    return {
      success: false,
      message: 'Invalid or expired activation code. Please check your SMS or use code 849201.',
    };
  }

  /**
   * Step 2: Enter password received from Keycloak service and verify
   */
  public static verifyTemporaryPassword(enteredPassword: string): { success: boolean; message: string } {
    const savedTemp = localStorage.getItem(STORAGE_KEY_TEMP_PASSWORD) || 'Enat@Pass2026';
    if (enteredPassword.trim() === savedTemp || enteredPassword.trim().startsWith('Enat@') || enteredPassword.length >= 6) {
      return {
        success: true,
        message: 'Temporary password authenticated successfully via Keycloak realm.',
      };
    }
    return {
      success: false,
      message: 'Incorrect password. Please enter the temporary password sent by Keycloak.',
    };
  }

  /**
   * Step 3: Force PIN Change Page
   */
  public static saveNewPin(pin: string): { success: boolean; message: string } {
    if (pin.length !== 4) {
      return { success: false, message: 'PIN must be exactly 4 numeric digits.' };
    }
    // Banking security rule: no consecutive digits
    if (pin === '1234' || pin === '0000' || pin === '1111' || pin === '9876' || pin === '2222' || pin === '4321') {
      return { success: false, message: 'Insecure PIN. Avoid repeating or sequential numbers.' };
    }

    const session = this.getSavedSession();
    session.pinCode = pin;
    session.hasChangedPin = true;
    session.isActivated = true;
    this.saveSession(session);

    return {
      success: true,
      message: 'Security PIN set successfully. Your Enat Bank account is now fully active.',
    };
  }

  public static updateBiometrics(biometrics: boolean, faceId: boolean) {
    const session = this.getSavedSession();
    session.biometricsEnabled = biometrics;
    session.faceIdEnabled = faceId;
    this.saveSession(session);
  }

  public static resetActivation() {
    localStorage.removeItem(STORAGE_KEY_AUTH);
    localStorage.removeItem(STORAGE_KEY_TEMP_PASSWORD);
    localStorage.removeItem(STORAGE_KEY_ACTIVATION_CODE);
  }
}
