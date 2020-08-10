import { Injectable } from '@angular/core'
import io from 'socket.io-client'

import { environment } from './../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  socket: any

  constructor() {}

  connect() {
    this.socket = io(environment.socketServer)

    this.socket.on('connect', () => {
      console.log('Connected!')
    })
  }
}
