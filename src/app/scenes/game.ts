import * as Phaser from 'phaser'
import Card from '../helpers/card'

export default class Game extends Phaser.Scene {
  card: Phaser.GameObjects.Image
  dealText: Phaser.GameObjects.Text
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

    }

    this.dealText.on('pointerdown', () => this.dealCards())

    this.dealText.on('pointerover', () => this.dealText.setColor('#ff69b4'))

    this.dealText.on('pointerout', () => this.dealText.setColor('#00ffff'))

    this.input.on('drag', (pointer: any, gameObject: Phaser.GameObjects.Graphics, dragX: number, dragY: number) => {
      gameObject.x = dragX
      gameObject.y = dragY
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
