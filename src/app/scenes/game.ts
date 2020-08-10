import io from 'socket.io-client'
import * as Phaser from 'phaser'
import Card from '../helpers/card'
import Zone from '../helpers/zone'
import Dealer from '../helpers/dealer'

import { environment } from './../../environments/environment'

export default class Game extends Phaser.Scene {
  card: Phaser.GameObjects.Image
  dealer: Dealer
  dealText: Phaser.GameObjects.Text
  dropZone: Phaser.GameObjects.Zone
  outline: Phaser.GameObjects.Graphics
  zone: Zone
  isPlayerA: boolean
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
    this.isPlayerA = false
    this.opponentCards = []

    this.zone = new Zone(this)
    this.dropZone = this.zone.renderZone()
    this.outline = this.zone.renderOutline(this.dropZone)

    this.dealer = new Dealer(this)

    this.socket = io(environment.socketServer)

    this.socket.on('connect', () => {
      console.log('Connected!')
    })

    this.socket.on('isPlayerA', () => {
      this.isPlayerA = true
      console.log('I\'m player A')
    })

    this.socket.on('dealCards', () => {
      this.dealer.dealCards()
      this.dealText.disableInteractive()
    })

    this.socket.on('cardPlayed', ({ sprite, isPlayerA }) => {
      if (isPlayerA !== this.isPlayerA) {
        this.opponentCards.shift().destroy()
        this.dropZone.data.values.cards++
        const card = new Card(this)
        card.render(((this.dropZone.x - 350) + (this.dropZone.data.values.cards * 50)), (this.dropZone.y), sprite).disableInteractive()
      }
    })

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
      this.socket.emit('cardPlayed', { sprite: gameObject.texture.key, isPlayerA: this.isPlayerA })
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
