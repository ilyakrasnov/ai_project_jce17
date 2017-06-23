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
        
        
        <md-card>
            <md-card-title-group>
                <!--<img md-card-sm-image *ngIf="thumbnail" [src]="thumbnail"/>-->
                <md-card-title>Moves: {{ moves.length }}, Finished: {{ finished() }}</md-card-title>
                <!--<md-card-subtitle *ngIf="subtitle">{{ subtitle | bcEllipsis:40 }}</md-card-subtitle>-->
            </md-card-title-group>
            <md-card-content>
                <div class="puzzle">
                    <div class="tile" *ngFor="let tile of board" (click)="tileClicked(tile.value)">
                        {{tile.value}}
                    </div>
                </div>
            </md-card-content>
            
        </md-card>
        
        <h2>Fringe:</h2>
        <pre>{{ getFringe() | json }}</pre>

        <h2>Closed:</h2>
        <pre>{{ getClosed() | json }}</pre>

    `,
    styles: [`
		.tile {
			width: 80px;
			height: 80px;
			float: left;
			justify-content: center;
			border: 2px solid grey;
			border-right-width: 0;
			border-bottom-width: 0;

		}
		.tile:nth-child(3n) {
			border-right-width: 2px;
		}

		.tile:nth-child(7n) {
			border-bottom-width: 2px;
		}

		.tile:nth-child(8n) {
			border-bottom-width: 2px;
		}

		.tile:nth-child(9n) {
			border-bottom-width: 2px;
		}

		.puzzle {
			width: 300px;
		}
		md-card {
			width: 400px;
			height: 400px;
			margin: 15px;
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
    GOAL_STATE = [
        { x: 1, y: 1, value: 1 },
        { x: 2, y: 1, value: 2 },
        { x: 3, y: 1, value: 3 },
        { x: 1, y: 2, value: 4 },
        { x: 2, y: 2, value: 5 },
        { x: 3, y: 2, value: 6 },
        { x: 1, y: 3, value: 7 },
        { x: 2, y: 3, value: 8 },
        { x: 3, y: 3, value: null}
    ];

    board = [
        { x: 1, y: 1, value: 1 },
        { x: 2, y: 1, value: 2 },
        { x: 3, y: 1, value: 3 },
        { x: 1, y: 2, value: 4 },
        { x: 2, y: 2, value: 5 },
        { x: 3, y: 2, value: null },
        { x: 1, y: 3, value: 7 },
        { x: 2, y: 3, value: 8 },
        { x: 3, y: 3, value: 6}
    ];
    moves = [ ];
    movement;
    aStar;

    constructor() {
        this.movement = new MovementService();
        this.aStar = new AStar(this.GOAL_STATE, this.board, this.movement);
        this.aStar.run();
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
    g: 0;
    heuristicFunction;

    readonly HEURISTIC_FUNCITONS = {
        1: this.nrOfMisplacedTiles,
        2: this.sumOfManattenDistances
    }

    constructor(goal, start, movement, h = 1) {
        this.goal = goal;
        // this.start = start;
        this.fringe.push(start);
        this.movement = movement;
        this.heuristicFunction = h;
    }

    getFringe(){
        return this.fringe;
    }

    getClosed(){
        return this.closed;
    }
    run(){
        let node = _.head(this.fringe);
        if (node) {
            if (this.goalReached(node)) {
                console.log("###### GOAL REACHED ######");
            } else {
                this.closed.push(node);
                this.g += 1;
                let children = this.children(node);

                for (var child of children) {
                    if (child) {
                        this.f(child);
                    }
                }
            }
        } else {
            // console.log("###### FRINDGE EMPTY... :( ######");
        }
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
        return misplaced;

    }

    sumOfManattenDistances(board){
        console.log("###### I AM MANHATTEN ######");
        console.log();
    }

    goalReached(node){
        for (var tile of node) {
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