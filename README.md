
## Overview

* 8 puzzle

    **8 puzzel - game**
    In 8 puzzel game the goal is to reorder tiels from a start state to the goal state
    
    ![alt text](https://github.com/ilyakrasnov/ai_project_jce17/blob/master/images/img_1_start_and_stop_states.PNG)
    
       
    
    When trying to implement an algorithem for solving 8 puzzel - the main considiration is to choose what is the next step, what tile to move on board. this would determine if we are getting closer to the goal or not.
![alt text](https://github.com/ilyakrasnov/ai_project_jce17/blob/master/images/img_2_successors.PNG)
    
The problem of 8 puzzel, can be presented as a Graph **Search problem**. 

There are diffrent scemes of graph searching  possible, some are compleate , some give optimal results.
* Complete and Optimal  sotions.
The 8 puzzel problem could not always be solved, there are start states that don't have a solution.
Compleate means if there is a solution the algorithem would find one.
Optimal means - the solution found is the optimal, in our case - minimal number of steps taken to solve the puzzel.

**Fringe and closed-


A Search algortion uses 2 basic lists for calculating the next step. Fringe and Closed
Fringe holds the next possible steps- or expanded steps. and Closed are states that were already chosen in the path to solving the problem.
A sucsessor function expands a node, finding what are the next possible steps . 
the descition of what goes into the list and in what ordere depends on the Search algorithem.


![alt text](https://github.com/ilyakrasnov/ai_project_jce17/blob/master/images/img_visualizing_fring_closed.PNG)
    
 
 Image fringe.
 Image fringe state and closed state.
 
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
The [online game](http://ngdeploy.ilyakrasnov.s3-website-us-west-2.amazonaws.com/) was developed in [TypeScript](https://www.typescriptlang.org/) using the [Angular](https://angular.io/) framework for frontend development. The framework enables fast development process with reusable components and supporting application structure.

The source code is accessible in this [GitHub repository](https://github.com/ilyakrasnov/ai_project_jce17). We used [AWS Codepipeline](https://aws.amazon.com/codepipeline/) and [AWS Codebuild](https://aws.amazon.com/codebuild/) to automate the build and deployment process of the application. 

### Architecture Overview
The game and later the algorithm were developed using Object Oriented Design for better structure and code reusability. Since it was not the main subject of this project, we only present here basic classes and their responsibilities briefly.

#### Puzzle

The *Puzzle* class represents the whole game, connecting all other application parts together and presenting them on the webpage. 

#### Board
The *Board* class represents the setup of a game board, with its dimensions, numbers, etc. The main function of the board is to return a list of possible moves aka 'neigbors' of the empty tile.

#### PuzzleCreator
*PuzzleCreator*'s task is creating a randomized board with given dimensions and a board representing the goal state. 

#### Movement
The *Movement* class performs the basic step of moving a tile. In afterthought it was a very good decision to abstact out this class, since we later were able to make use of it in both the online game and the algorithm searching for the solution.

#### AStar
At the core of the algorithmic part of the implementation is the *AStar* class. It defines the heuristic functions as well as the overall search algorithm with node expansion, managind the *Fringe* and *Closed* lists, etc.

####  Stats
In order to collect the data, we created the *Stats* class, which defines the setup and execution of our expriment, collects and outputs the results represented as a *JSON* file.

### Unique challenges - Randomization

One of the intersting and challenging aspects we faced was randomization of the board when generating the puzzle. Further we discuss the 2 approaches we took and the reasons why we decided to finally use only one of them.

#### Approach 1
Our first approach was to create a board of a given dimension, i.e. 3x3, 4x4, etc, and  

As disussed [here](https://www.cs.bham.ac.uk/~mdr/teaching/modules04/java2/TilesSolvability.html), there is 


#### Approach 2


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
it was not easy to implemet, there are many "moving parts" and there were many adjustments and corrections needed. 
we used Visualization of the algorithem working displaying each step displaying the Fringe states, and Closed states. thies helped understanding what the algorithem was  acctualy doing and what corrections were requiered. 


## 3 - Exploration of A* performance with different heuristic functions

### Experiment setup

### Collecting the data

### Challenges

### Visualization
