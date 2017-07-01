import { Component, Input } from '@angular/core';
import {MdGridListModule} from '@angular/material';
import { MovementService } from "../services/movement"
import { Book } from '../models/book';
import * as book from '../actions/puzzle';
import * as _ from "lodash";
import {PuzzleCreatorService} from "../services/puzzle-creator";
import {AStar} from "../models/aStar";
import {MdSnackBar} from '@angular/material';


@Component({
  selector: 'miniboard',
  templateUrl: './miniboard.component.html',
  styleUrls: ['./puzzle.component.css']
})
export class MiniboardComponent {
  @Input() board;

  boardRows() {
    return _.chunk(this.board.board, Math.sqrt(this.board.board.length));
  }

}
