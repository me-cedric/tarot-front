import Card from './card'
import Game from '../scenes/game'

export default class Dealer {
  dealCards: () => void

  constructor(scene: Game) {
    this.dealCards = () => {
      let playerSprite: string
      let opponentSprite: string
      if (scene.isPlayerA) {
        playerSprite = 'cyanCardFront'
        opponentSprite = 'magentaCardBack'
      } else {
        playerSprite = 'magentaCardFront'
        opponentSprite = 'cyanCardBack'
      }
      for (let i = 0; i < 5; i++) {
        const playerCard = new Card(scene)
        playerCard.render(475 + (i * 100), 650, playerSprite)

        const opponentCard: Card = new Card(scene)
        scene.opponentCards.push(opponentCard.render(475 + (i * 100), 125, opponentSprite).disableInteractive())
      }
    }
  }
}
