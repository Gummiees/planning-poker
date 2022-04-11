import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as io from 'socket.io-client';
import { ERROR_NOT_CONNECTED } from './errors';

@Injectable({
  providedIn: 'root',
})
export class IoSocketService {
  public socket?: io.Socket;

  public connect(username: string) {
    this.socket = io.connect('http://localhost:8080');
    this.socket.emit('username', username);
  }

  public disconnect() {
    this.socket?.emit('disconnect');
  }

  public async createRoom(username: string): Promise<string> {
    this.connect(username);
    this.socket?.emit('createRoom');
    return new Promise<string>((resolve) => {
      this.socket?.on('roomCreated', (data) => resolve(data));
    });
  }

  public async joinRoom(room: string, username: string): Promise<any> {
    this.connect(username);
    this.socket?.emit('joinRoom', room);
    return new Promise<string>((resolve, reject) => {
      this.socket?.on('roomJoined', (data) => resolve(data));
      this.socket?.on('roomDoesNotExist', () => reject());
    });
  }

  public async doesRoomExist(room: string): Promise<boolean> {
    this.connectAnonymously();
    this.socket?.emit('doesRoomExist', room);
    return new Promise<boolean>((resolve) => {
      this.socket?.on('roomExists', () => resolve(true));
      this.socket?.on('roomDoesNotExist', () => resolve(false));
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

  private connectAnonymously() {
    this.socket = io.connect('http://localhost:8080');
  }
}
