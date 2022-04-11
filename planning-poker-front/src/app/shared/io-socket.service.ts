/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as io from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class IoSocketService {
  public socket?: io.Socket;

  public connect() {
    this.socket = io.connect('http://localhost:8080');
  }

  public something$(): Observable<Readonly<any>> {
    if (!this.socket) {
      throw new Error('Trying to get information from IO socket without being connected');
    }

    return new Observable((observer) => {
      this.socket!.on('actualPlayers', (data) => observer.next(data));
      return () => this.socket!.disconnect();
    });
  }
}
