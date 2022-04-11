import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as io from 'socket.io-client';
import { ERROR_NOT_CONNECTED } from './errors';

@Injectable({
  providedIn: 'root',
})
export class IoSocketService {
  public socket?: io.Socket;

  public connect() {
    this.socket = io.connect('http://localhost:8080');
  }

  public disconnect() {
    this.socket?.emit('disconnect');
  }

  public async createRoom(): Promise<string> {
    this.connect();
    this.socket?.emit('createRoom');
    return new Promise<string>((resolve) => {
      this.socket?.on('roomCreated', (data) => resolve(data));
    });
  }

  public something$(): Observable<Readonly<any>> {
    if (!this.socket) {
      console.error(ERROR_NOT_CONNECTED);
      throw new Error(ERROR_NOT_CONNECTED);
    }

    return new Observable((observer) => {
      this.socket?.on('actualPlayers', (data) => observer.next(data));
      return () => this.socket?.disconnect();
    });
  }
}
