import * as Phaser from 'phaser'
import Card from '../helpers/card'
import Zone from '../helpers/zone'

export default class Game extends Phaser.Scene {
  card: Phaser.GameObjects.Image
  dealText: Phaser.GameObjects.Text
  zone: Zone
  dropZone: Phaser.GameObjects.Zone
  outline: Phaser.GameObjects.Graphics
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
    this.dealText = this.add.text(75, 350, ['DEAL CARDS'])
      .setFontSize(18)
      .setFontFamily('Trebuchet MS')
      .setColor('#00ffff')
      .setInteractive()

    this.card = this.add.image(300, 300, 'cyanCardFront').setScale(0.3, 0.3).setInteractive()
    this.input.setDraggable(this.card)
    this.dealCards = () => {
      for (let i = 0; i < 5; i++) {
        const playerCard = new Card(this)
        playerCard.render(475 + (i * 100), 650, 'cyanCardFront')
      }
    }

    this.dealText.on('pointerdown', () => this.dealCards())

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

    this.input.on('drop', (pointer: any, gameObject: Phaser.GameObjects.Sprite, dropZone) => {
      dropZone.data.values.cards++
      gameObject.x = (dropZone.x - 350) + (dropZone.data.values.cards * 50)
      gameObject.y = dropZone.y
      gameObject.disableInteractive()
    })

    this.zone = new Zone(this)
    this.dropZone = this.zone.renderZone()
    this.outline = this.zone.renderOutline(this.dropZone)
  }

  update() {

  }
  // create() {
  //   this.scene.add(SCENES.FIRST, FirstScene, true)
  //   this.scene.add(SCENES.SECOND, SecondScene, false)

  //   this.scene.run(SCENES.FIRST)
  // }
}
