import { Component, OnInit } from '@angular/core'
import Game from '../scenes/game'

import * as Phaser from 'phaser'

interface GameInstance extends Phaser.Types.Core.GameConfig {
  instance: Phaser.Game
}

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  initialize = false
  game: GameInstance = {
    width: '100%',
    height: '100%',
    type: Phaser.AUTO,
    scene: [
      Game
    ],
    instance: null
  }

  getInstance() {
    return this.game.instance
  }

  initializeGame() {
    this.initialize = true
  }

  ngOnInit(): void {
    this.initializeGame()
  }

}
