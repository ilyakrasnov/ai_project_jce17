import * as _ from "lodash";
import { MovementService } from '../services/movement';
import {PuzzleCreatorService, times } from "../services/puzzle-creator";
import {AStar} from './aStar';


export class Stats {

	dimensions = [6];
	h_functions = [1,2];
	iterations = 1;

	results = [	]
	puzzleCreator;

	constructor(puzzleCreator) {
		this.puzzleCreator = puzzleCreator;
	}

	run(){
		for (var dimension of this.dimensions) {
			times (this.iterations)  (() => {
				let result = {
					board: null,
					dimension: null,
					h1: null,
					h2: null,
					time: null
				};
				let board = this.puzzleCreator.createBoard(dimension);
				result = Object.assign({}, result, { board, dimension });
				let goal = this.puzzleCreator.createGoalState();
				for (var h_func of this.h_functions) {
					let t0 = performance.now();
					let aStar = new AStar(board, goal, h_func);
					let steps = aStar.run();
					let t1 = performance.now();
					let time = t1-t0;
					if (h_func == 1) {
						result = Object.assign({}, result, { h1: steps, time });
					} else {
						result = Object.assign({}, result, { h2: steps, time });
					}
				}
				this.results.push(result);
			});
		}
		console.log("###### RESULTS ######");
		console.log(this.results);

	}

	compare(){
	}


}
