import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.sirius',
  appName: 'culiso',
  webDir: 'build',
  plugins: {
    Geolocation: {
      enableHighAccuracy: true
    }
  }
};

export default config;
