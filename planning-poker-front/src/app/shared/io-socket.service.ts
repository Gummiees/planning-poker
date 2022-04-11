import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class IoSocketService {
  public socket: io.Socket;

  public constructor() {
    // this.socket = io.connect('');
    this.socket = io.connect('http://localhost:8080');
  }
}
