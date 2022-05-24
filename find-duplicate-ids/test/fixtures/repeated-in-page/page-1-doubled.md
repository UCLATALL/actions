<iframe data-type="learnosity" id="Pulse2"  src="https://coursekata.org/learnosity/preview/Pulse2" width="100%" height="660"></iframe>

# Chapter 2 - Understanding Data

## 2.0 Starting With a Bunch of Numbers

When statisticians talk about variation, they refer to a particular kind of variation: variation in data. But variation doesn’t start out as data. Look around; you see people, buildings, trees, light, and so on. And you see lots of variation: no two people look exactly alike, just as no two trees look exactly alike. Statisticians seek to express this variation using numbers, which is where we will start. (In a bit we will discuss where the numbers come from.)

Not all groups of numbers have variation. Take, for example, these numbers: 2, 2, 2, 2, 2, 2, 2, 2, 2. No need to use statistics in this case, because there is no variation. You can just look at the numbers and describe them in a phrase: "Nine twos." If we said, "What number best represents this distribution of numbers?" you would, almost certainly, say, “Two.”

But take this group of numbers: 2, 1, 3, 3, 2, 3, 1, 2, 1. Now it’s not as easy to describe them—certainly not in a short phrase. And imagine if there were hundreds or thousands of numbers; the challenge would be even greater. 

### Seeing Patterns in Numbers

Statisticians have, over the years, invented some ideas and some procedures to help us make sense of bunches of numbers. Here’s a simple example. First, see if you can create a vector to store the numbers 2, 1, 3, 3, 2, 3, 1, 2, 1. 

In the code window below, we put in the code to create a vector with nine 2s. We saved it in an R object called ```bunch_of_2s```. Now you add the code to create a vector called ```bunch_of_123s``` with the numbers 2, 1, 3, 3, 2, 3, 1, 2, 1. (HINT: use the ```c()``` function.) Run the code, then add some code to print out the two vectors just to make sure they ended up with the numbers you intended. 

```{ data-ckcode=true #ch2-1 }
%%% setup
require(coursekata)

%%% prompt
# Here's how to combine nine 2s into a vector
# You could also use rep(2, times = 9)
bunch_of_2s <- c(2, 2, 2, 2, 2, 2, 2, 2, 2)

# Create a vector called bunch_of_123s with the numbers
# 2, 1, 3, 3, 2, 3, 1, 2, 1
bunch_of_123s <- c()

%%% solution
bunch_of_123s <- c(2, 1, 3, 3, 2, 3, 1, 2, 1)

%%% test
ex() %>% check_object("bunch_of_123s") %>% check_equal()
```

Now, let’s take the numbers in ```bunch_of_123s``` and sort them in ascending order. We can use the ```sort()``` function for this. 

```
sort(bunch_of_123s)
``` 

```
[1] 1 1 1 2 2 2 3 3 3
```

Now look at the numbers in ```bunch_of_123s``` after we have sorted them. Suddenly it is easier to see a pattern in the variation: there are equal numbers of 1s, 2s, and 3s. Just sorting numbers makes it easier to see a pattern!

If you understand this example, you have just mastered your first statistical technique! It may not look like much, but if you had a bigger data set (instead of nine numbers) you would quickly see the advantages of simply sorting them in order. 

### Frequency Tables

We could also represent the same pattern in a frequency table using the command ```tally()```.

```
tally(bunch_of_123s)
``` 

```
X
1 2 3 
3 3 3
```

<iframe data-type="learnosity" id="Ch2_Starting_1_r3.0"  src="https://coursekata.org/learnosity/preview/Ch2_Starting_1_r3.0" width="100%" height="660"></iframe>

```{ data-ckcode=true #ch2-2 }
%%% setup
require(coursekata)

%%% prompt
# Here is code to create the vector that we named bunch_of_2s
bunch_of_2s <- c(2,2,2,2,2,2,2,2,2)

# Now, let's run the tally() function on bunch_of_2s

%%% solution
# Here is code to create the vector that we named bunch_of_2s
bunch_of_2s <- c(2,2,2,2,2,2,2,2,2)

# Now, let's run the tally() function on bunch_of_2s
tally(bunch_of_2s)

%%% test
ex() %>% check_function("tally") %>% check_result() %>% check_equal()
``` 

```
X
2 
9
```

Believe it or not, you’ve now learned a second statistical technique—frequency tables (implemented in R as the ```tally()``` function)! As you learn more and more about statistics, you will encounter lots and lots of techniques like this. Fundamentally, they are all variations on just a few core ideas. As you go, and as you build up your statistical power, we will help you keep it all in perspective. 

<iframe data-type="learnosity" id="Pulse2"  src="https://coursekata.org/learnosity/preview/Pulse2" width="100%" height="660"></iframe>

# Chapter 2 - Understanding Data

## 2.0 Starting With a Bunch of Numbers

When statisticians talk about variation, they refer to a particular kind of variation: variation in data. But variation doesn’t start out as data. Look around; you see people, buildings, trees, light, and so on. And you see lots of variation: no two people look exactly alike, just as no two trees look exactly alike. Statisticians seek to express this variation using numbers, which is where we will start. (In a bit we will discuss where the numbers come from.)

Not all groups of numbers have variation. Take, for example, these numbers: 2, 2, 2, 2, 2, 2, 2, 2, 2. No need to use statistics in this case, because there is no variation. You can just look at the numbers and describe them in a phrase: "Nine twos." If we said, "What number best represents this distribution of numbers?" you would, almost certainly, say, “Two.”

But take this group of numbers: 2, 1, 3, 3, 2, 3, 1, 2, 1. Now it’s not as easy to describe them—certainly not in a short phrase. And imagine if there were hundreds or thousands of numbers; the challenge would be even greater. 

### Seeing Patterns in Numbers

Statisticians have, over the years, invented some ideas and some procedures to help us make sense of bunches of numbers. Here’s a simple example. First, see if you can create a vector to store the numbers 2, 1, 3, 3, 2, 3, 1, 2, 1. 

In the code window below, we put in the code to create a vector with nine 2s. We saved it in an R object called ```bunch_of_2s```. Now you add the code to create a vector called ```bunch_of_123s``` with the numbers 2, 1, 3, 3, 2, 3, 1, 2, 1. (HINT: use the ```c()``` function.) Run the code, then add some code to print out the two vectors just to make sure they ended up with the numbers you intended. 

```{ data-ckcode=true #ch2-1 }
%%% setup
require(coursekata)

%%% prompt
# Here's how to combine nine 2s into a vector
# You could also use rep(2, times = 9)
bunch_of_2s <- c(2, 2, 2, 2, 2, 2, 2, 2, 2)

# Create a vector called bunch_of_123s with the numbers
# 2, 1, 3, 3, 2, 3, 1, 2, 1
bunch_of_123s <- c()

%%% solution
bunch_of_123s <- c(2, 1, 3, 3, 2, 3, 1, 2, 1)

%%% test
ex() %>% check_object("bunch_of_123s") %>% check_equal()
```

Now, let’s take the numbers in ```bunch_of_123s``` and sort them in ascending order. We can use the ```sort()``` function for this. 

```
sort(bunch_of_123s)
``` 

```
[1] 1 1 1 2 2 2 3 3 3
```

Now look at the numbers in ```bunch_of_123s``` after we have sorted them. Suddenly it is easier to see a pattern in the variation: there are equal numbers of 1s, 2s, and 3s. Just sorting numbers makes it easier to see a pattern!

If you understand this example, you have just mastered your first statistical technique! It may not look like much, but if you had a bigger data set (instead of nine numbers) you would quickly see the advantages of simply sorting them in order. 

### Frequency Tables

We could also represent the same pattern in a frequency table using the command ```tally()```.

```
tally(bunch_of_123s)
``` 

```
X
1 2 3 
3 3 3
```

<iframe data-type="learnosity" id="Ch2_Starting_1_r3.0"  src="https://coursekata.org/learnosity/preview/Ch2_Starting_1_r3.0" width="100%" height="660"></iframe>

```{ data-ckcode=true #ch2-2 }
%%% setup
require(coursekata)

%%% prompt
# Here is code to create the vector that we named bunch_of_2s
bunch_of_2s <- c(2,2,2,2,2,2,2,2,2)

# Now, let's run the tally() function on bunch_of_2s

%%% solution
# Here is code to create the vector that we named bunch_of_2s
bunch_of_2s <- c(2,2,2,2,2,2,2,2,2)

# Now, let's run the tally() function on bunch_of_2s
tally(bunch_of_2s)

%%% test
ex() %>% check_function("tally") %>% check_result() %>% check_equal()
``` 

```
X
2 
9
```

Believe it or not, you’ve now learned a second statistical technique—frequency tables (implemented in R as the ```tally()``` function)! As you learn more and more about statistics, you will encounter lots and lots of techniques like this. Fundamentally, they are all variations on just a few core ideas. As you go, and as you build up your statistical power, we will help you keep it all in perspective. 