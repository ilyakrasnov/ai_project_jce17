import 'rxjs/add/operator/map';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Book } from '../models/book';
import * as _ from "lodash";


// @Injectable()
export class MovementService {

  move;

  make_move(board, tile_number) {
    let tile = Object.assign({}, _.find(board, { value: tile_number }));
    let _board = Object.assign([], board);
    this.move = new Move(_board, tile);
    return this.validate();
  }

  validate() {
    let moveTo = this.move.isLigit();
    if (moveTo) {
      console.log("###### THIS IS A VALID MOVE ######");
      return this.move.move(moveTo);

    } else {
      console.log("###### SORRY, CAN'T MOVE IT ######");
      console.log(this.move.isLigit());
    }
  }
}

class Move {
  board;
  tile;

  constructor(board, tile){
    this.board = board;
    this.tile = tile;
  }

  move(destination){
    let originIndex = _.findIndex(this.board, this.tile);
    let destinationIndex = _.findIndex(this.board, destination);
    let newDestinationValue = this.tile.value;
    let newOriginValue = null;

    this.board[destinationIndex] = Object.assign({}, this.board[destinationIndex], {
      value: newDestinationValue
    });


    this.board[originIndex] = Object.assign({}, this.board[originIndex], {
      value: newOriginValue
    });

    return Object.assign([], this.board);
  }

  isLigit(){
    return this.canMoveRight() ||
           this.canMoveLeft() ||
           this.canMoveUp() ||
           this.canMoveDown()
  }

  private canMoveRight(){
    return this.canMoveToNewCoords(this.tile.x + 1, this.tile.y);
  }

  private canMoveLeft(){
    return this.canMoveToNewCoords(this.tile.x - 1, this.tile.y);
  }

  private canMoveUp(){
    return this.canMoveToNewCoords(this.tile.x, this.tile.y - 1);
  }

  private canMoveDown(){
    return this.canMoveToNewCoords(this.tile.x, this.tile.y + 1);
  }

  private canMoveToNewCoords(new_x, new_y) {
    if (this.isOnBoard(new_x, new_y) && this.isEmpty(new_x, new_y)) {

      return this.newCoords(new_x, new_y);
    } else {
      return null;
    }
  }

  private newCoords(new_x, new_y) {
    return {
      x: new_x,
      y: new_y
    }
  }

  private isEmpty(x_coord, y_coord) {
    let tile = _.find(this.board, { x: x_coord, y: y_coord});
    if (tile.value) {
      return false;
    } else {
      return true;
    }
  }

  private isOnBoard(x, y) {
    if (this.withinDimensions(x) && this.withinDimensions(y)) {
      return true;
    } else {
      return false;
    }
  }

  private withinDimensions(n) {
    if (n >= 1 && n <= 3) {
      return true;
    } else {
      return false;
    }
  }

}
