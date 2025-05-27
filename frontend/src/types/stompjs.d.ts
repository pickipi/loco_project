declare module 'stompjs' {
  export interface Client {
    connected: boolean;
    connect: (headers: object, connectCallback: () => void, errorCallback?: (error: any) => void) => void;
    disconnect: (callback?: () => void) => void;
    subscribe: (destination: string, callback: (message: any) => void) => { id: string; unsubscribe: () => void };
    send: (destination: string, headers?: object, body?: string) => void;
  }

  export interface Frame {
    command: string;
    headers: { [key: string]: string };
    body: string;
  }

  export function over(ws: any): Client;
} 