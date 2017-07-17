import * as _ from "lodash";
import { MovementService } from '../services/movement';
import {PuzzleCreatorService, times } from "../services/puzzle-creator";
import {AStar} from './aStar';


export class Stats {

	dimensions = [3, 4, 5];
	h_functions = [1,2];
	iterations = 10;
	randomize_degrees = [5, 10, 15];

	results = [	]
	puzzleCreator;

	constructor(puzzleCreator) {
		this.puzzleCreator = puzzleCreator;
	}

	run(){
		let t0 = performance.now();
		for (var rand_degree of this.randomize_degrees){
			for (var dimension of this.dimensions) {
				let iter = 0;
				times (this.iterations)  (() => {
					iter +=1;

					let board = this.puzzleCreator.createBoard(dimension, rand_degree);
					// result = Object.assign({}, result, { board, dimension });
					let goal = this.puzzleCreator.createGoalState();
					for (var h_func of this.h_functions) {
						let result = {
							board: null,
							dimension: null,
							rand_degree: rand_degree,
							heuristic: null,
							time: null,
							steps: null
						};
						// result = Object.assign({}, result, { dimension });

						console.log(`###### RAND(${rand_degree}): iteration: ${iter}, h${h_func} for dim: ${dimension}   ######`);

						let t0 = performance.now();
						let aStar = new AStar(board, goal, h_func);
						let steps = aStar.run();
						let t1 = performance.now();
						let time = t1-t0;
						if (h_func == 1) {
							result = Object.assign({}, result, { heuristic: 1, steps, time, dimension, board } );
						} else {
							result = Object.assign({}, result, { heuristic: 2, steps, time, dimension, board } );
						}
						this.results.push(result);
					}
				});
			}
		}
		let t1 = performance.now();

		console.log(`###### RESULTS IN ${(t1-t0)/1000} SECONDS ######`);
		console.log(this.results);

	}

	compare(){
	}


}
