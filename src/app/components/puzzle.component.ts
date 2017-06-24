import { Component, Input } from '@angular/core';
import {MdGridListModule} from '@angular/material';
import { MovementService } from "../services/movement"
import { Book } from '../models/book';
import * as book from '../actions/puzzle';
import * as _ from "lodash";


@Component({
	selector: 'puzzle',
	template: `
        <!--<bc-book-preview *ngFor="let book of books" [book]="book"></bc-book-preview>-->

        <div layout-fill layout="column" layout-align="center none">
            <div layout="row" layout-align="center none">

                <md-card>
                    <md-card-title-group>
                        <!--<img md-card-sm-image *ngIf="thumbnail" [src]="thumbnail"/>-->
                        <md-card-title>Moves: {{ moves.length }}, Finished:
                            <span ng-class="md-48">
		                <md-icon  class="green" *ngIf=" finished()">done</md-icon>
		                <md-icon  class="red" *ngIf="!finished()">clear</md-icon>
	                </span>{{ finished() }}
                        </md-card-title>
                        <!--<md-card-subtitle *ngIf="subtitle">{{ subtitle | bcEllipsis:40 }}</md-card-subtitle>-->
                    </md-card-title-group>
                    <md-card-content>
                        <div class="puzzle">
                            <div class="row" *ngFor="let row of boardRows()">
                                <div class="tile" *ngFor="let tile of row" (click)="tileClicked(tile.value)">
                                    {{tile.value}}
                                </div>
                            </div>
                        </div>
                    </md-card-content>
                </md-card>
	            
	            <button (click)="runAlgorithm()"></button>
	            
            </div>
        </div>

        <h2>Fringe:</h2>
        <pre>{{ getFringe().board  | json }}</pre>
        <!--<md-card  class="mini" *ngFor="let fringeBoard of getFringe().board">-->
        <!--<md-card-title-group>-->
        <!--<md-card-title>F = g + h = {{ fringeBoard.f }}</md-card-title>-->
        <!--</md-card-title-group>-->
        <!--<md-card-content>-->
        <!--<div class="puzzle-mini">-->
        <!--<div class="tile-mini" *ngFor="let tile of fringeBoard" (click)="tileClicked(tile.value)">-->
        <!--{{tile.value}}-->
        <!--</div>-->
        <!--</div>-->
        <!--</md-card-content>-->
        <!--</md-card>-->


        <h2>Closed:</h2>
        <md-card  class="mini" *ngFor="let closedBoard of getClosed().board">
            <md-card-title-group>
                <md-card-title>F = g + h</md-card-title>
            </md-card-title-group>
            <md-card-content>
                <div class="puzzle-mini">
                    <div class="tile-mini" *ngFor="let tile of closedBoard" (click)="tileClicked(tile.value)">
                        {{tile.value}}
                    </div>
                </div>
            </md-card-content>
        </md-card>


        <!---->
        <!--<pre>{{ getFringe() | json }}</pre>-->

        <!--<h2>Closed:</h2>-->
        <!--<pre>{{ getClosed() | json }}</pre>-->

	`,
	styles: [`
		md-icon{
			font-size:45px;
			height:45px;
			width: 45px;
		}

		.mat-icon.green{
			color: green;
		}
		.mat-icon.red{
			color: red;
		}

		.row {
			position: relative;
			width: 100%;
			left: 0;
			float: none;
			clear:both
		}


		.tile {
			width: 80px;
			height: 80px;
			line-height: 80px;
			float: left;
			justify-content: center;
			text-align: center;
			margin: 2px;
			font-size: 30px;
			color: #0f0a33;
			font-weight: 900;
			background-color: antiquewhite;
			border-right-width: 0;
			border-bottom-width: 0;
		}
		/*.tile-mini {*/
		/*width: 40px;*/
		/*height: 40px;*/
		/*float: left;*/
		/*justify-content: center;*/
		/*margin: 2px;*/
		/*border-right-width: 0;*/
		/*border-bottom-width: 0;*/
		/*}*/
		/*.tile:nth-child(3n) {*/
		/*border-right-width: 2px;*/
		/*}*/

		/*.tile:nth-child(7n) {*/
		/*border-bottom-width: 2px;*/
		/*}*/

		/*.tile:nth-child(8n) {*/
		/*border-bottom-width: 2px;*/
		/*}*/

		/*.tile:nth-child(9n) {*/
		/*border-bottom-width: 2px;*/
		/*}*/


		/*.tile-mini:nth-child(3n) {*/
		/*border-right-width: 2px;*/
		/*}*/

		/*.tile-mini:nth-child(7n) {*/
		/*border-bottom-width: 2px;*/
		/*}*/

		/*.tile-mini:nth-child(8n) {*/
		/*border-bottom-width: 2px;*/
		/*}*/

		/*.tile-mini:nth-child(9n) {*/
		/*border-bottom-width: 2px;*/
		/*}*/
		/*.puzzle {*/
		/*width: 300px;*/
		/*}*/

		/*.mini  {*/
		/*width: 170px;*/
		/*height: 220px;*/
		/*margin: 15px;*/
		/*}*/
		md-card {

			display:block;
			overflow:auto;
			margin: 35px;
		}
		@media only screen and (max-width: 768px) {
			md-card {
				margin: 15px 0 !important;
			}
		}
		md-card:hover {
			box-shadow: 3px 3px 16px -2px rgba(0, 0, 0, .5);
		}
		md-card-title {
			margin-right: 10px;
		}
		md-card-title-group {
			margin: 0;
		}
		a {
			color: inherit;
			text-decoration: none;
		}
		img {
			width: 60px;
			min-width: 60px;
			margin-left: 5px;
		}
		md-card-content {
			margin-top: 15px;
			margin: 15px 0 0;
		}
		span {
			display: inline-block;
			font-size: 13px;
		}
		md-card-footer {
			padding: 0 25px 25px;
		}
	`]
})
export class PuzzleComponent {
	DIMENSION = 3;
	GOAL_STATE = [
		{ x: 1, y: 1, value: 1 }, { x: 2, y: 1, value: 2 }, { x: 3, y: 1, value: 3 },
		{ x: 1, y: 2, value: 4 }, { x: 2, y: 2, value: 5 }, { x: 3, y: 2, value: 6 },
		{ x: 1, y: 3, value: 7 }, { x: 2, y: 3, value: 8 }, { x: 3, y: 3, value: null}
	];

	board = [];

	moves = [ ];
	movement;
	aStar;

	constructor() {
		this.movement = new MovementService();
		this.createBoard();
		this.createGoalState();
		this.aStar = new AStar(this.GOAL_STATE, this.board, this.movement);
	}

	runAlgorithm(){
		this.aStar.run();
	}
	createBoard(){
		let range = _.range(1, this.DIMENSION + 1);
		let emptyBoard = this.emptyBoard(range);
		this.board = this.randomize(emptyBoard);
	}
	
	createGoalState(){
		let range = _.range(1, this.DIMENSION + 1);
		let emptyBoard = this.emptyBoard(range);

		let nrOfCells = this.DIMENSION ** 2;
		let numbers = _.range(1, nrOfCells).concat([null]);
		this.GOAL_STATE = this.assignNumbersToBoard(numbers, emptyBoard);
		console.log("###### GOAL + ######");
		console.log(this.GOAL_STATE);

	}

	randomize(board){
		let nrOfCells = this.DIMENSION ** 2;
		let range = _.range(1, nrOfCells).concat([null]);
		let randomNumbers = _.sampleSize(range, nrOfCells);
		
		return this.assignNumbersToBoard(randomNumbers, board);
	}
	
	assignNumbersToBoard(numbers, board) {
		_.each(numbers, (n, index) => {
			board[index] = Object.assign({}, board[index], {
				value: n
			});
		});
		
		return board;
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
	boardRows() {
		return _.chunk(this.board, this.DIMENSION);
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
		let newBoard = this.movement.make_move(this.board, tile_number);
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
	// start;
	fringe = [];
	closed = [];
	g = 0;
	heuristicFunction;

	readonly HEURISTIC_FUNCITONS = {
		1: this.nrOfMisplacedTiles,
		2: this.sumOfManattenDistances
	}

	constructor(goal, start, movement, h = 1) {
		this.goal = goal;
		this.movement = movement;
		this.heuristicFunction = h;
		// this.start = start;
		this.pushToFringe( {
			f: this.f(start),
			board: start
		});
	}

	getFringe(){
		return this.fringe;
	}

	getClosed(){
		return this.closed;
	}

	run(){
		console.log("###### FRINGE ######");
		console.log(this.fringe);

		console.log("###### CLOSED ######");
		console.log(this.closed);

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
					for (var child of children) {
						if (child) {

							this.pushToFringe( {
								board: child,
								f: this.f(child)
							});
						}
					}
				}
			} else {
				// console.log("###### FRINDGE EMPTY... :( ######");
			}
		}

	}

	pushToFringe(node){
		if(_.isEmpty(this.fringe)) {

			this.fringe.push(node);
		} else {

			let index = _.findIndex(this.fringe, function(nodeInFringe) { return nodeInFringe.f > node.f });
			this.fringe.splice(index, 0, node);
		}

		console.log("###### NEW FRINGE ######");
		console.log(this.fringe);

	}

	f(board){
		return this.g + this.hFunction(board);
	}

	hFunction(board){

		let heuristic = this.HEURISTIC_FUNCITONS[this.heuristicFunction];
		return heuristic(board, this.goal) - 1;
	}

	nrOfMisplacedTiles(board, goal){

		let misplaced = 0;
		for (var tile of board) {
			if (!_.find(goal, tile)) {
				misplaced = misplaced + 1;
			}
		}
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
		if (this.isOnBoard(x, y)){
			let value = _.find(board, { x: x, y: y }).value;
			return this.movement.make_move(board, value);
		}
	}

	private childUp(board, emptyTile) {
		let new_x = emptyTile.x;
		let new_y = emptyTile.y - 1;

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