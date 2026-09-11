declare module 'wake_on_lan' {
  export function wake(mac: string, callback?: (error: any) => void): void;
  export function wake(mac: string, options: any, callback?: (error: any) => void): void;
  export function createMagicPacket(mac: string): Buffer;
}
