import { Component, Input } from '@angular/core';
import {MdGridListModule} from '@angular/material';
import { MovementService } from "../services/movement"
import { Book } from '../models/book';
import * as book from '../actions/puzzle';
import * as _ from "lodash";
import {PuzzleCreatorService} from "../services/puzzle-creator";


@Component({
	selector: 'puzzle',
	templateUrl: './puzzle.component.html',
	styleUrls: ['./puzzle.component.css']
})
export class PuzzleComponent {
	DIMENSION = 3;
	GOAL_STATE = [];

	board = [
		{ x: 1, y: 1, value: 1 }, { x: 2, y: 1, value: 2 }, { x: 3, y: 1, value: 3 },
		{ x: 1, y: 2, value: 4 }, { x: 2, y: 2, value: 8 }, { x: 3, y: 2, value: 5 },
		{ x: 1, y: 3, value: null }, { x: 2, y: 3, value: 7 }, { x: 3, y: 3, value: 6}
		];

	// closed = [
	// 	{ board: [
	// 		{ x: 1, y: 1, value: 1 }, { x: 2, y: 1, value: 2 }, { x: 3, y: 1, value: 3 },
	// 		{ x: 1, y: 2, value: 4 }, { x: 2, y: 2, value: 8 }, { x: 3, y: 2, value: 5 },
	// 		{ x: 1, y: 3, value: 7 }, { x: 2, y: 3, value: null }, { x: 3, y: 3, value: 6}
	// 		]
	// 	},
	// 	{ board: [
	// 		{ x: 1, y: 1, value: 1 }, { x: 2, y: 1, value: 2 }, { x: 3, y: 1, value: 3 },
	// 		{ x: 1, y: 2, value: 4 }, { x: 2, y: 2, value: null }, { x: 3, y: 2, value: 5 },
	// 		{ x: 1, y: 3, value: 7 }, { x: 2, y: 3, value: 8 }, { x: 3, y: 3, value: 6}
	// 	]
	// 	}
	// 	];



	moves = [ ];
	aStar;

	constructor(private movement: MovementService,
				private puzzleCreator: PuzzleCreatorService) {
	}

	ngOnInit(){
		this.initializeBoardAndGoal();
	}
	
	initializeBoardAndGoal(){
		// this.board = this.puzzleCreator.createBoard(this.DIMENSION);
		this.GOAL_STATE = this.puzzleCreator.createGoalState(this.DIMENSION);
		this.aStar = new AStar(this.GOAL_STATE, this.board, this.movement, this.DIMENSION);
	}

	runAlgorithm(){
		this.aStar.run();
	}

	boardRows() {
		return _.chunk(this.board, this.DIMENSION);
	}

	closedRows(closedBoard){
		return _.chunk(closedBoard, this.DIMENSION);
	}

	getFringe(){
		return this.aStar.getFringe();
	}

	getClosed(){
		return this.aStar.getClosed();
	}

	finished(){
		return this.deepCompare(this.GOAL_STATE, this.board);
	}

	tileClicked(tile_number) {
		let newBoard = this.movement.make_move(this.board, tile_number, this.DIMENSION);
		this.saveAndMove(newBoard);
	}

	private saveAndMove(newBoard) {
		if (newBoard) {
			this.moves.push(newBoard);
			this.board = newBoard;
		}
	}

	private deepCompare(goal, state) {
		for (var tile of state) {
			if (!_.find(goal, tile)) {
				return false;
			}
		}
		return true;
	}
}

class AStar {
	goal;
	movement;
	dimension;
	start;
	fringe = [];
	closed = [];
	g = 0;
	heuristicFunction;

	readonly HEURISTIC_FUNCITONS = {
		1: this.nrOfMisplacedTiles,
		2: this.sumOfManattenDistances
	}

	constructor(goal, start, movement, dimension, h = 1) {
		this.goal = goal;
		this.movement = movement;
		this.dimension = dimension;
		this.heuristicFunction = h;
		this.start = start;
	}

	getFringe(){
		return this.fringe;
	}

	getClosed(){
		console.log("###### CLOSED IS ######");
		console.log(this.closed);

		return this.closed;
	}

	run(){
		this.pushToFringe({
			f: this.f(this.start),
			board: this.start
		});

		// console.log("###### FRINGE ######");
		// console.log(this.fringe);
		//
		// console.log("###### CLOSED ######");
		// console.log(this.closed);

		while(!_.isEmpty(this.fringe)) {
			let node = _.head(this.fringe);
			this.fringe = _.tail(this.fringe);
			if (node) {
				if (this.goalReached(node)) {
					console.log(`###### GOAL REACHED AFTER ${this.g} STEPS ######"`);
					return;
				} else {
					this.closed.push(node);
					this.g += 1;
					let children = this.children(node.board);

					// TODO sort children by value (number in the tile)
					console.log("###### GOT CHILDREN ######");
					console.log(this.fringe);

					for (var child of children) {
						if (child && this.isNotInClosed(child)) {
							let f = this.f(child);
							this.pushToFringe( {
								board: child,
								f: f
							});
						}
					}
				}
			} else {
				// console.log("###### FRINDGE EMPTY... :( ######");
			}
		}

	}

	isNotInClosed(board) {
		// let check = _.find(this.closed, board);
		// console.log("###### CHECKING... ######");
		// console.log(check);


		if (_.find(this.closed, board)) {
			return false;
		} else {
			return true;
		}

	}

	pushToFringe(node){
		if(_.isEmpty(this.fringe)) {
			this.fringe.push(node);
		} else {

			let index = _.findIndex(this.fringe, function(nodeInFringe) { return nodeInFringe.f > node.f });
			if(index == -1){
				this.fringe.push(node);
			} else {
				this.fringe.splice(index, 0, node);
			}

		}

		console.log("###### NEW FRINGE ######");
		console.log(this.fringe);
	}

	f(board){
		return this.g + this.hFunction(board);
	}

	hFunction(board){

		let heuristic = this.HEURISTIC_FUNCITONS[this.heuristicFunction];
		return heuristic(board, this.goal);
	}

	nrOfMisplacedTiles(board, goal){

		let misplaced = 0;
		for (var tile of board) {
			if (!_.find(goal, tile)) {
				misplaced = misplaced + 1;
			}
		}
		misplaced = misplaced - 1;
		return misplaced;
	}

	sumOfManattenDistances(board){
		console.log("###### I AM MANHATTEN ######");
		console.log();
	}

	goalReached(node){
		console.log("###### CHECKING IF REACHED GOAL ######");
		console.log(node.board);
		console.log(this.goal);

		for (var tile of node.board) {
			if (!_.find(this.goal, tile)) {
				return false;
			}
		}
		return true;
	}

	children(board) {
		let emptyTile = _.find(board, { value: null});

		return [
			this.childUp(board, emptyTile),
			this.childDown(board, emptyTile),
			this.childLeft(board, emptyTile),
			this.childRight(board, emptyTile)
		]
	}

	private nextState(board, x, y) {

		console.log("###### IN NEXT STATE: ######");
		console.log(board);
		console.log(x,y);

		if (this.isOnBoard(x, y)){
			let value = _.find(board, { x: x, y: y }).value;
			
			let new_board = this.movement.make_move(board, value);

			return this.movement.make_move(board, value, this.dimension);
		}
	}

	private childUp(board, emptyTile) {
		let new_x = emptyTile.x;
		let new_y = emptyTile.y - 1;
		console.log("###### NEW COORDS ######");
		console.log(new_x, new_y);

		return this.nextState(board, new_x, new_y);
	}

	private childDown(board, emptyTile) {
		let new_x = emptyTile.x;
		let new_y = emptyTile.y + 1;

		return this.nextState(board, new_x, new_y);
	}

	private childLeft(board, emptyTile) {
		let new_x = emptyTile.x - 1;
		let new_y = emptyTile.y;

		return this.nextState(board, new_x, new_y);
	}
	private childRight(board, emptyTile) {
		let new_x = emptyTile.x + 1;
		let new_y = emptyTile.y;

		return this.nextState(board, new_x, new_y);
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