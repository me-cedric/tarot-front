export default class Card {
  render: (x: number, y: number, sprite: string) => Phaser.GameObjects.Image

  constructor(scene: Phaser.Scene) {
    this.render = (x, y, sprite) => {
      const card = scene
        .add.image(x, y, sprite)
        .setScale(0.3, 0.3)
        .setInteractive()
      scene.input.setDraggable(card)
      return card
    }
  }
}
