export default class Zone {
  public renderZone: () => Phaser.GameObjects.Zone
  public renderOutline: (dropZone: Phaser.GameObjects.Zone) => Phaser.GameObjects.Graphics

  constructor(scene: Phaser.Scene) {
    this.renderZone = () => {
      const dropZone: Phaser.GameObjects.Zone = scene.add.zone(700, 375, 900, 250).setRectangleDropZone(900, 250)
      dropZone.setData({ cards: 0 })
      return dropZone
    }
    this.renderOutline = (dropZone) => {
      const dropZoneOutline = scene.add.graphics()
      dropZoneOutline.lineStyle(4, 0xff69b4)
      dropZoneOutline
        .strokeRect(
          dropZone.x - dropZone.input.hitArea.width / 2,
          dropZone.y - dropZone.input.hitArea.height / 2,
          dropZone.input.hitArea.width,
          dropZone.input.hitArea.height
        )
      return dropZoneOutline
    }
  }
}
