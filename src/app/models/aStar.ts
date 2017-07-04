import * as _ from "lodash";
import { MovementService } from '../services/movement';

export class AStar {
	goal;
	movement;
	dimension;
	start;
	fringe = [];
	closed = [];
	fringe_states = [];
	closed_states = [[]];
	g = 0;
	heuristicFunction;

	readonly HEURISTIC_FUNCITONS = {
		1: this.nrOfMisplacedTiles,
		2: this.sumOfManattenDistances
	}

	constructor(goal, start, h = 2) {
		this.goal = goal;
		this.movement = new MovementService();
		this.dimension = Math.sqrt(goal.length);
		this.heuristicFunction = h;
		this.start = start;
	}

	getFringe(){
		return this.fringe;
	}

	getClosedStates(){
		return this.closed_states;
	}

	getFringeStates(){
		return this.fringe_states;
	}

	getClosed(){
		return this.closed;
	}

	run(){
		this.pushToFringe({
			f: this.f(this.start),
			g: this.g,
			h: this.hFunction(this.start),
			board: this.start
		});
		this.fringe_states.push([Object.assign([], this.fringe)]);


		while(!_.isEmpty(this.fringe)) {
			if (this.g > 2000) {
				console.log("###### POSSIBLY THERE IS NO SOLUTION  ######");
				return;
			}


			let node = _.head(this.fringe);
			this.fringe = _.tail(this.fringe);
			if (node) {
				if (this.goalReached(node)) {

					console.log(`###### GOAL REACHED AFTER ${this.g} STEPS ######"`);
					return this.g;
				} else {
					this.closed.push(node);
					this.closed_states.push([Object.assign([], this.closed)]);

					this.g += 1;
					let children = this.children(node.board);

					// TODO sort children by value (number in the tile)
					console.log("###### GOT CHILDREN ######");
					console.log(this.fringe);

					for (var child of children) {
						if (child && !this.isInClosed(child)) {
							let f = this.f(child);
							this.pushToFringe( {
								board: child,
								f: f,
								g: this.g,
								h: this.hFunction(child)
							});
						}
					}
					this.fringe_states.push([Object.assign([], this.fringe)]);
				}
			} else {
        return undefined;
			}
		}

	}

	isInClosed(board) {

		for (var closed_board of this.closed) {
			if (this.areEqual(closed_board.board, board)){
				return true;
			}
		}
		return false;
	}

	areEqual(board1, board2) {
		for (var tile of board1) {
			if (!_.find(board2, tile)) {
				return false;
			}
		}
		return true;
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
		if ( board[board.length -1].value !== null) {
			misplaced = misplaced - 1;
		};
		return misplaced;
	}

	sumOfManattenDistances(board, goal){
		let _this = this;
		let sum_of_distances = 0;
		for (var tile of board) {
			if (tile.value) {
				// _this.tileManhattanDistance(goal_tile, tile);
				let goal_tile = _.find(goal, { value: tile.value });
				sum_of_distances = sum_of_distances + Math.abs(goal_tile.x - tile.x) + Math.abs(goal_tile.y - tile.y);
			}
		}

		return sum_of_distances;
	}

	// tileManhattanDistance(tile1, tile2){
	// 	return (Math.abs(tile1.x - tile2.x) + Math.abs(tile1.y + tile2.y));
	// }

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
		if (this.isOnBoard(x, y)){
			let value = _.find(board, { x: x, y: y }).value;
			let new_board = this.movement.make_move(board, value);
			return this.movement.make_move(board, value, this.dimension);
		}
	}

	private childUp(board, emptyTile) {
		return this.nextState(board, emptyTile.x, emptyTile.y - 1);
	}

	private childDown(board, emptyTile) {
		return this.nextState(board, emptyTile.x, emptyTile.y + 1);
	}

	private childLeft(board, emptyTile) {
		return this.nextState(board, emptyTile.x - 1, emptyTile.y);
	}
	private childRight(board, emptyTile) {
		return this.nextState(board, emptyTile.x + 1, emptyTile.y);
	}

	private isOnBoard(x, y) {
		if (this.withinDimensions(x) && this.withinDimensions(y)) {
			return true;
		} else {
			return false;
		}
	}

	private withinDimensions(n) {
		if (n >= 1 && n <= this.dimension) {
			return true;
		} else {
			return false;
		}
	}

}
