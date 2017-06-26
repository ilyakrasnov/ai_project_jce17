import 'rxjs/add/operator/map';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Book } from '../models/book';
import * as _ from "lodash";


@Injectable()
export class PuzzelCreatorService {

  dimension;

  // createPuzzle(dimension) {
  //   this.dimension = dimension;
  //
  //   let board = this.createBoard();
  //   let goalState = this.createGoalState()
  //
  //   console.log("###### BOARD CREATED ######");
  //   console.log(board);
  //
  //   console.log("###### GOAL STATE ######");
  //   console.log(goalState);
  //
  //   return [board, goalState];
  // }

  createBoard(dimension){
    // this.dimension = dimension;

    let range = _.range(1, dimension + 1);
    let emptyBoard = this.emptyBoard(range);
    return this.randomize(emptyBoard, dimension);
  }

  createGoalState(dimension){
    // this.dimension = dimension;

    let range = _.range(1, dimension + 1);
    let emptyBoard = this.emptyBoard(range);

    let nrOfCells = dimension ** 2;
    let numbers = _.range(1, nrOfCells).concat([null]);
    return this.assignNumbersToBoard(numbers, emptyBoard);
  }

  randomize(board, dimension){
    

    let nrOfCells = dimension ** 2;
    let range = _.range(1, nrOfCells).concat([null]);
    let randomNumbers = _.sampleSize(range, nrOfCells);

    return this.assignNumbersToBoard(randomNumbers, board);
  }

  assignNumbersToBoard(numbers, board) {
    let newBoard = Object.assign([], board);
    _.each(numbers, (n, index) => {
      newBoard[index] = Object.assign({}, newBoard[index], {
        value: n
      });
    });

    return newBoard;
  }

  emptyBoard(range){
    let board = [];
    range.map( (y) => {
      range.map( (x) => {
        board.push({
          x,
          y,
          value: null
        })
      })
    })
    return board;
  }

}
