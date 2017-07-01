import 'rxjs/add/operator/map';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Book } from '../models/book';
import * as _ from "lodash";
import { MovementService } from '../services/movement';

const times = x => f => {
	if (x > 0) {
		f()
		times (x - 1) (f)
	}
}

@Injectable()
export class PuzzleCreatorService {

	constructor(private movement: MovementService){

	}



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

		let originalBoard = this.createGoalState(dimension);


		return this.randomize1(emptyBoard, dimension);
		// return this.randomize2(originalBoard);
	}

	randomize2(board) {
		console.log("###### GOT BOARD TO RANDOMIZE ######");
		console.log(board);

		let iterations = 10;

		times (iterations)  (() => {
			board = Object.assign([], this.makeRandomMove(board));
		});

		return board;
	}

	makeRandomMove(board){
		let values = _.range(1, board.length);
		let value = _.sample(values);
		console.log("###### RANDOM VALUE: ######");
		console.log(values);
		return;
	}

	// play(board, value) {
	// 	return this.movement.make_move(board, value);
	// }

	createGoalState(dimension){
		// this.dimension = dimension;

		let range = _.range(1, dimension + 1);
		let emptyBoard = this.emptyBoard(range);

		let nrOfCells = dimension ** 2;
		let numbers = _.range(1, nrOfCells).concat([null]);
		return this.assignNumbersToBoard(numbers, emptyBoard);
	}

	randomize1(board, dimension){
		let nrOfCells = dimension ** 2;
		let range = _.range(1, nrOfCells).concat([null]);
		let randomNumbers = this.solvableSample(range, nrOfCells) ;

		return this.assignNumbersToBoard(randomNumbers, board);
	}

	solvableSample(range, nrOfCells) {
		let possibleSample = _.sampleSize(range, nrOfCells);

		while (!this.solvable(possibleSample)) {
			// console.log("###### PUZZLE UNSOLVABLE, redoing ######");
			// console.log();

			possibleSample = _.sampleSize(range, nrOfCells);
		}

		return possibleSample;
	}

	solvable(array) {
		let totalInversions = 0;
		for (var x of array) {
			totalInversions = totalInversions + this.countInversions(x, array);
		}
		return this.isEven(totalInversions)
	}

	isEven(x){
		return (x % 2) == 0;
	}

	countInversions(x, array) {
		let index = array.findIndex( el => el == x);
		let tailAfterX = _.slice(array, index + 1);
		return tailAfterX.map( el => el < x)
			.reduce((a, b) => a + b, 0);
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