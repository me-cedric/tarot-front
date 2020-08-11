import io from 'socket.io-client'
import * as Phaser from 'phaser'
import Card from '../helpers/card'
import Zone from '../helpers/zone'
import Dealer from '../helpers/dealer'

import { environment } from './../../environments/environment'

class Player {
  id: string
  name?: string
  lobby?: string
}

class Room {
  public started = false
  public creatorId: string
  public roomName: string
  private cards: number[]
  public players: { [key: string]: any } = {}

  constructor(creatorId: string, roomName: string) {
    this.creatorId = creatorId
    this.roomName = roomName
    this.cards = [...Array(22).keys()]
  }
}

export default class Game extends Phaser.Scene {
  card: Phaser.GameObjects.Image
  dealer: Dealer
  dealText: Phaser.GameObjects.Text
  dropZone: Phaser.GameObjects.Zone
  outline: Phaser.GameObjects.Graphics
  zone: Zone
  player: Player
  room: Room
  opponentCards: Phaser.GameObjects.Image[]
  socket: SocketIOClient.Socket

  dealCards: () => void

  constructor() {
    super({
      key: 'Game'
    })
  }

  preload() {
    this.load.image('cyanCardFront', 'assets/CyanCardFront.png')
    this.load.image('cyanCardBack', 'assets/CyanCardBack.png')
    this.load.image('magentaCardFront', 'assets/MagentaCardFront.png')
    this.load.image('magentaCardBack', 'assets/MagentaCardBack.png')
  }

  create() {
    this.opponentCards = []

    this.zone = new Zone(this)
    this.dropZone = this.zone.renderZone()
    this.outline = this.zone.renderOutline(this.dropZone)

    this.dealer = new Dealer(this)

    this.socket = io(environment.socketServer)

    this.socket.on('connect', () => {
      console.log('Connected!')
      this.socket.emit('setUser', 'userName')
    })

    this.socket.on('gameJoined', (room: Room) => {
      this.room = room
      // todo editRoomName
    })

    this.socket.on('user', (player) => {
      this.player = player
    })

    this.socket.on('dealCards', () => {
      this.dealer.dealCards()
      this.dealText.disableInteractive()
    })
    let rooom = ''
    this.socket.on('roomCreated', (room) => {
      rooom = room
      console.log(room)
    })

    this.socket.on('cardPlayed', ({ sprite, player }) => {
      if (player.id !== this.player.id) {
        this.opponentCards.shift().destroy()
        this.dropZone.data.values.cards++
        const card = new Card(this)
        card.render(((this.dropZone.x - 350) + (this.dropZone.data.values.cards * 50)), (this.dropZone.y), sprite).disableInteractive()
      }
    })

    const join = this.add.text(75, 370, ['Join'])
      .setFontSize(18)
      .setFontFamily('Trebuchet MS')
      .setColor('#00ffff')
      .setInteractive()

    join.on('pointerdown', () => {
      this.socket.emit('joinRoom', rooom)
    })

    join.on('pointerover', () => join.setColor('#ff69b4'))

    join.on('pointerout', () => join.setColor('#00ffff'))

    const create = this.add.text(75, 390, ['Create'])
      .setFontSize(18)
      .setFontFamily('Trebuchet MS')
      .setColor('#00ffff')
      .setInteractive()

    create.on('pointerdown', () => {
      this.socket.emit('createRoom', 'rooom name')
    })

    create.on('pointerover', () => create.setColor('#ff69b4'))

    create.on('pointerout', () => create.setColor('#00ffff'))


    this.dealText = this.add.text(75, 350, ['Start Game'])
      .setFontSize(18)
      .setFontFamily('Trebuchet MS')
      .setColor('#00ffff')
      .setInteractive()

    this.dealText.on('pointerdown', () => {
      this.socket.emit('dealCards')
    })

    this.dealText.on('pointerover', () => this.dealText.setColor('#ff69b4'))

    this.dealText.on('pointerout', () => this.dealText.setColor('#00ffff'))

    this.input.on('drag', (pointer: any, gameObject: Phaser.GameObjects.Sprite, dragX: number, dragY: number) => {
      gameObject.x = dragX
      gameObject.y = dragY
    })

    this.input.on('dragstart', (pointer: any, gameObject: Phaser.GameObjects.Sprite) => {
      gameObject.setTint(0xff69b4)
      this.children.bringToTop(gameObject)
    })

    this.input.on('dragend', (pointer: any, gameObject: Phaser.GameObjects.Sprite, dropped: boolean) => {
      gameObject.setTint()
      if (!dropped) {
        gameObject.x = gameObject.input.dragStartX
        gameObject.y = gameObject.input.dragStartY
      }
    })

    this.input.on('drop', (pointer: any, gameObject: any, dropZone) => {
      dropZone.data.values.cards++
      gameObject.x = (dropZone.x - 350) + (dropZone.data.values.cards * 50)
      gameObject.y = dropZone.y
      gameObject.disableInteractive()
      this.socket.emit('cardPlayed', gameObject.texture.key)
    })
  }

  update() {

  }
  // create() {
  //   this.scene.add(SCENES.FIRST, FirstScene, true)
  //   this.scene.add(SCENES.SECOND, SecondScene, false)

  //   this.scene.run(SCENES.FIRST)
  // }
}
