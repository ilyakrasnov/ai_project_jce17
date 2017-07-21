
## Overview

* 8 puzzle

    8 puzzel - game is  start state and goal state
    *** image 1 start and goal state.
    
    
    When trying to implement an algorithem for solving 8 puzzel - the main considiration is to choose what is the next step, what tile to move on board. this would determine if we are getting closer to the goal or not.
     - - - ***image 2 tree**
The problem of 8 puzzel, can be presented as a Graph **Search problem**. 
There are diffrent scemes of graph searching  possible, some are compleate , some give optimal results.


The 8 puzzel problem could not always be solved, there are start states that don't have a solution.
Compleate means if there is a solution the algorithem would find one.
Optimal means - the solution found is the optimal, in our case - minimal number of steps taken to solve the puzzel.

        
* A* search 
 
A* algorithem, uses Best First Search approch to go over a graph, from a starting state getting to a Goal state.
A* uses a huristic function to decide what is the next step.
F(n) = g(n) + h(n)  - (g(n) number of steps done until this point, h(n) a heiristic assumption how many more steps until goal state reached)
if F(n) is Admissable (קבילה)  then  A* is complete and Optimal.



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
    Counting the number of misplaced tiles. this is  Admissable.
    the rational of this is - you need to move at least x tiles to achive the goal state. (x is the number of misplaced tiles)
    

### h2 - Num of manhatten distances
    counting the number of steps in manhaten distances for each misplased tile.
    Acctually this huristic funciton, tells us, you would need to move a tile three positions to get it to it's place in Goal posistion.
    this approch acctualy gives us more inmormation about how many steps would requeir to achive the goal state.
    This function is Admissable.
    
*** image from slide - h1 , h2 

### Challenges

## 3 - Exploration of A* performance with different heuristic functions

### Experiment setup

### Collecting the data

### Challenges

### Visualization
