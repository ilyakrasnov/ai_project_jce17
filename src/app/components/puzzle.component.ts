import { Component, Input } from '@angular/core';
import {MdGridListModule} from '@angular/material';
import { MovementService } from "../services/movement"
import { Book } from '../models/book';
import * as book from '../actions/puzzle';
import * as _ from "lodash";
import {PuzzleCreatorService} from "../services/puzzle-creator";
import {AStar} from "../models/aStar";
import {Stats} from "../models/stats";
import {MdSnackBar} from '@angular/material';


@Component({
  selector: 'puzzle',
  templateUrl: './puzzle.component.html',
  styleUrls: ['./puzzle.component.css']
})
export class PuzzleComponent {
  DIMENSION = 4;
  GOAL_STATE = [];

  board = [
    // { x: 1, y: 1, value: 1 }, { x: 2, y: 1, value: 2 }, { x: 3, y: 1, value: 3 },
    // { x: 1, y: 2, value: 4 }, { x: 2, y: 2, value: 8 }, { x: 3, y: 2, value: 5 },
    // { x: 1, y: 3, value: null }, { x: 2, y: 3, value: 7 }, { x: 3, y: 3, value: 6}
  ];

  moves = [ ];
  aStar;

  constructor(
    private movement: MovementService,
    private snackBar: MdSnackBar,
    private puzzleCreator: PuzzleCreatorService
  ) {
    }

    ngOnInit(){
      this.initializeBoardAndGoal();
    }

    initializeBoardAndGoal(){
    	// let puzzleCreator = new PuzzleCreatorService(this.DIMENSION);
      this.board = this.puzzleCreator.createBoard(this.DIMENSION);
      this.GOAL_STATE = this.puzzleCreator.createGoalState();
      this.aStar = new AStar(this.GOAL_STATE, this.board);
    }

  // this.initializeBoardAndGoal();

	runStats(){
    	new Stats(this.puzzleCreator).run();
	}

  runAlgorithm(){
      let result = this.aStar.run();

      if(result){
        this.snackBar.open(`YEAH.. Reached goal in ${result} steps`, '',{
          duration: 2000,
        });
      }
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

    getClosedStates(){
      return this.aStar.getClosedStates();
    }

    getFringeStates(){
      return this.aStar.getFringeStates();
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
