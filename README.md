
## Overview

* 8 puzzle

    8 puzzel - game is  start state and goal state
    *** image 1 start and goal state.
    
    This game is acctualy a **Search Problem.
    When trying to implement an algorithem for solving 8 puzzel - the main considiration is to choose what is the next step, what tile to move on board. this would determine if we are getting closer to the goal or not.
     - - - ***image 2 tree
The problem of 8 puzzel, could be "converted" to a Graph Search problem. Then diffrent scemes of graph searching area possible, some are compleate , some give optimal results.
        
* A* search 
 

A* algorithem, uses Best First Search approch to go over a graph, from a starting state getting to a Goal state.
A* uses a huristic function to decide what is the next step.
F(n) = g(n) + h(n)  - (g(n) number of steps done until this point, h(n) a heiristic assumption how many more steps until goal state reached)
A* is complete and Optimal.


* different heuristic functions

## Problem description
The project consisted of a few parts.

1. Creating an online 8puzzle game
2. Implementing the A* algorithm
3. Exploration of A* performance with different heuristic functions

## 1 - Creating an online 8puzzle game
### Dev environment and tools

### Architecture Overview

### Unique programming challenges


## 2 - Implementing the A* algorithm
We chose two diffrent heruristic functions and explored the diffrence in performance counting number of steps, and time.


### h1 - Number of misplased tiles
    Counting the number of misplaced tiles, was

### h2

### Challenges

## 3 - Exploration of A* performance with different heuristic functions

### Experiment setup

### Collecting the data

### Challenges

### Visualization
