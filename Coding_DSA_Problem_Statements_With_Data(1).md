# Coding & DSA — Problem Statement Bank

> Problem statements for Programming Basics, Data Structures, Algorithms, and 30 Must-Do Coding Questions.
>
> Each problem includes **Input, Output, Constraints, and Sample Data** where useful. These are language-independent and can be solved in Python, C, C++, or Java.

---

# 1. Programming Basics

## 1. Variables & Data Types

### Problem Statement
Write a program that accepts an integer, a floating-point number, a character, and a string. Display all the values and their corresponding data types.

### Input
Four values:
- An integer `N`
- A floating-point number `F`
- A character `C`
- A string `S`

### Output
Print each value and its data type.

### Constraints
- `-10^9 <= N <= 10^9`
- `-10^9 <= F <= 10^9`
- `S` contains printable characters.

### Sample Input
```text
25
12.5
A
Hello
```

### Sample Output
```text
Integer: 25
Float: 12.5
Character: A
String: Hello
```

---

## 2. Input / Output

### Problem Statement
Write a program that reads a student's name and marks in three subjects. Calculate and display the total marks and average marks.

### Input
```text
Name
Marks1 Marks2 Marks3
```

### Output
Display the student's name, total marks, and average.

### Constraints
- `0 <= Marks <= 100`

### Sample Input
```text
Hina
85 90 80
```

### Sample Output
```text
Name: Hina
Total: 255
Average: 85.00
```

---

## 3. If–Else

### Problem Statement
Given an integer `N`, determine whether it is positive, negative, or zero. If it is positive, also determine whether it is even or odd.

### Input
A single integer `N`.

### Output
Print the appropriate classification.

### Sample Input
```text
17
```

### Sample Output
```text
Positive
Odd
```

---

## 4. Loops

### Problem Statement
Given an integer `N`, print all numbers from `1` to `N` that are divisible by both `3` and `5`.

### Input
A single integer `N`.

### Output
Print the qualifying numbers separated by spaces.

### Constraints
- `1 <= N <= 10^6`

### Sample Input
```text
50
```

### Sample Output
```text
15 30 45
```

---

## 5. Functions

### Problem Statement
Write a function that accepts two positive integers and returns their Greatest Common Divisor (GCD).

### Input
Two integers `A` and `B`.

### Output
Print the GCD.

### Sample Input
```text
48 18
```

### Sample Output
```text
6
```

---

## 6. Arrays

### Problem Statement
Given an array of `N` integers, find its sum, maximum element, and minimum element.

### Input
```text
N
A1 A2 A3 ... AN
```

### Output
Print the sum, maximum, and minimum.

### Sample Input
```text
5
10 25 7 40 15
```

### Sample Output
```text
Sum: 97
Maximum: 40
Minimum: 7
```

---

## 7. Strings

### Problem Statement
Given a string, count the number of vowels, consonants, digits, and special characters.

### Input
A single string.

### Output
Print the count of each category.

### Sample Input
```text
Hello123!
```

### Sample Output
```text
Vowels: 2
Consonants: 3
Digits: 3
Special Characters: 1
```

---

## 8. Pointers

### Problem Statement
Given two integers, swap their values using pointers.

### Input
Two integers `A` and `B`.

### Output
Print the values after swapping.

### Sample Input
```text
10 20
```

### Sample Output
```text
20 10
```

> Note: This problem specifically tests pointer concepts in C/C++. In Python, the equivalent should demonstrate references and swapping.

---

## 9. Recursion

### Problem Statement
Given a positive integer `N`, calculate the sum of all integers from `1` to `N` using recursion.

### Input
A single integer `N`.

### Output
Print the sum.

### Sample Input
```text
5
```

### Sample Output
```text
15
```

---

# 2. Data Structures

# Arrays

## 10. Reverse an Array

### Problem Statement
Given an array of `N` integers, reverse the array in-place.

### Input
```text
N
A1 A2 ... AN
```

### Output
Print the reversed array.

### Sample Input
```text
5
1 2 3 4 5
```

### Sample Output
```text
5 4 3 2 1
```

---

## 11. Rotate an Array

### Problem Statement
Given an array and an integer `K`, rotate the array to the right by `K` positions.

### Input
```text
N K
A1 A2 ... AN
```

### Output
Print the rotated array.

### Sample Input
```text
5 2
1 2 3 4 5
```

### Sample Output
```text
4 5 1 2 3
```

---

## 12. Remove Duplicates from Array

### Problem Statement
Given an array, remove duplicate values while preserving the order of their first occurrence.

### Input
```text
N
A1 A2 ... AN
```

### Output
Print the resulting array.

### Sample Input
```text
7
1 2 2 3 1 4 3
```

### Sample Output
```text
1 2 3 4
```

---

# Strings

## 13. Character Frequency

### Problem Statement
Given a string, find the frequency of every character appearing in it.

### Input
A string `S`.

### Output
Display each character and its frequency.

### Sample Input
```text
programming
```

### Sample Output
```text
p: 1
r: 2
o: 1
g: 2
a: 1
m: 2
i: 1
n: 1
```

---

## 14. First Non-Repeating Character

### Problem Statement
Given a string, find the first character that occurs exactly once.

### Input
A string `S`.

### Output
Print the first non-repeating character. If none exists, print `-1`.

### Sample Input
```text
aabbcddee
```

### Sample Output
```text
c
```

---

## 15. Longest Word

### Problem Statement
Given a sentence containing multiple words, find the longest word. If multiple words have the same maximum length, return the first one.

### Sample Input
```text
I love programming
```

### Sample Output
```text
programming
```

---

# Linked List

## 16. Create and Display Linked List

### Problem Statement
Create a singly linked list containing `N` integers and display all elements from the head to the tail.

### Sample Input
```text
5
10 20 30 40 50
```

### Sample Output
```text
10 -> 20 -> 30 -> 40 -> 50 -> NULL
```

---

## 17. Insert Node in Linked List

### Problem Statement
Given a singly linked list, a value `X`, and a position `P`, insert `X` at position `P`.

### Input
```text
N
A1 A2 ... AN
X P
```

### Sample Input
```text
4
10 20 30 40
25 3
```

### Sample Output
```text
10 20 25 30 40
```

---

## 18. Delete Node from Linked List

### Problem Statement
Given a singly linked list and a value `X`, delete the first occurrence of `X`.

### Sample Input
```text
5
10 20 30 40 50
30
```

### Sample Output
```text
10 20 40 50
```

---

## 19. Reverse Linked List

### Problem Statement
Given the head of a singly linked list, reverse the list.

### Sample Input
```text
5
1 2 3 4 5
```

### Sample Output
```text
5 4 3 2 1
```

---

## 20. Detect Cycle in Linked List

### Problem Statement
Given a singly linked list and a position indicating where the last node connects, determine whether the linked list contains a cycle.

### Input
```text
N
A1 A2 ... AN
P
```

`P = -1` means the last node does not connect to another node.

### Sample Input
```text
5
1 2 3 4 5
2
```

### Sample Output
```text
Cycle Detected
```

---

# Stack

## 21. Stack Operations

### Problem Statement
Implement a stack supporting `PUSH`, `POP`, `PEEK`, and `ISEMPTY` operations.

### Sample Input
```text
6
PUSH 10
PUSH 20
PEEK
POP
PEEK
ISEMPTY
```

### Sample Output
```text
20
20
10
False
```

---

## 22. Balanced Parentheses

### Problem Statement
Given a string containing `()`, `{}`, and `[]`, determine whether the brackets are balanced and correctly nested.

### Sample Input
```text
{[()]}
```

### Sample Output
```text
Balanced
```

### Sample Input
```text
{[(])}
```

### Sample Output
```text
Not Balanced
```

---

## 23. Reverse String Using Stack

### Problem Statement
Given a string, reverse it using a stack.

### Sample Input
```text
hello
```

### Sample Output
```text
olleh
```

---

# Queue

## 24. Queue Operations

### Problem Statement
Implement a queue supporting `ENQUEUE`, `DEQUEUE`, `FRONT`, and `ISEMPTY`.

### Sample Input
```text
6
ENQUEUE 10
ENQUEUE 20
FRONT
DEQUEUE
FRONT
ISEMPTY
```

### Sample Output
```text
10
10
20
False
```

---

## 25. Circular Queue

### Problem Statement
Implement a circular queue of capacity `K` supporting insertion and deletion.

### Sample Input
```text
5
ENQUEUE 10
ENQUEUE 20
ENQUEUE 30
DEQUEUE
ENQUEUE 40
FRONT
```

### Sample Output
```text
20
```

---

## 26. Queue Using Two Stacks

### Problem Statement
Implement a FIFO queue using two stacks. Support enqueue and dequeue operations.

### Sample Input
```text
5
ENQUEUE 10
ENQUEUE 20
DEQUEUE
ENQUEUE 30
DEQUEUE
```

### Sample Output
```text
10
20
```

---

# Hashing

## 27. Frequency Count

### Problem Statement
Given an array, calculate the frequency of every distinct element.

### Sample Input
```text
8
1 2 2 3 1 2 4 3
```

### Sample Output
```text
1: 2
2: 3
3: 2
4: 1
```

---

## 28. Two Sum

### Problem Statement
Given an array and a target value, find two distinct elements whose sum equals the target. Return their indices.

### Sample Input
```text
4 9
2 7 11 15
```

### Sample Output
```text
0 1
```

---

## 29. Duplicate Detection

### Problem Statement
Given an array, determine whether any value occurs more than once.

### Sample Input
```text
5
1 2 3 2 5
```

### Sample Output
```text
Duplicate Found
```

---

## 30. Longest Consecutive Sequence

### Problem Statement
Given an unsorted array of integers, find the length of the longest sequence of consecutive integers.

### Sample Input
```text
6
100 4 200 1 3 2
```

### Sample Output
```text
4
```

---

# Trees

## 31. Tree Traversals

### Problem Statement
Given a binary tree, print its inorder, preorder, postorder, and level-order traversals.

### Sample Tree
```text
        1
       / \
      2   3
     / \
    4   5
```

### Sample Output
```text
Inorder: 4 2 5 1 3
Preorder: 1 2 4 5 3
Postorder: 4 5 2 3 1
Level Order: 1 2 3 4 5
```

---

## 32. Height of Binary Tree

### Problem Statement
Given a binary tree, find its height measured as the number of levels in the tree.

### Sample Tree
```text
        1
       / \
      2   3
     /
    4
```

### Sample Output
```text
3
```

---

## 33. Count Nodes

### Problem Statement
Given a binary tree, count the total number of nodes.

### Sample Tree
```text
        1
       / \
      2   3
     / \
    4   5
```

### Sample Output
```text
5
```

---

## 34. Count Leaf Nodes

### Problem Statement
Given a binary tree, count the number of nodes that have no left or right child.

### Sample Tree
```text
        1
       / \
      2   3
     / \
    4   5
```

### Sample Output
```text
3
```

---

# Binary Search Tree

## 35. Insert into BST

### Problem Statement
Given `N` integers, construct a Binary Search Tree by inserting the values in the given order.

### Sample Input
```text
7
50 30 70 20 40 60 80
```

### Expected BST
```text
        50
       /  \
     30    70
    / \    / \
   20 40  60 80
```

---

## 36. Search in BST

### Problem Statement
Given a Binary Search Tree and a target value `X`, determine whether `X` exists in the tree.

### Sample Input
```text
7
50 30 70 20 40 60 80
60
```

### Sample Output
```text
Found
```

---

## 37. Minimum and Maximum in BST

### Problem Statement
Given a Binary Search Tree, find its minimum and maximum values.

### Sample Input
```text
7
50 30 70 20 40 60 80
```

### Sample Output
```text
Minimum: 20
Maximum: 80
```

---

## 38. Validate BST

### Problem Statement
Given a binary tree, determine whether it satisfies all Binary Search Tree properties.

### Sample Tree
```text
        8
       / \
      3   10
     / \    \
    1   6    14
```

### Sample Output
```text
Valid BST
```

---

# Heaps

## 39. Build Min Heap

### Problem Statement
Given an array of integers, construct a min heap containing all elements.

### Sample Input
```text
6
9 4 7 1 3 8
```

### Sample Output
```text
1 3 7 9 4 8
```

> Any valid heap representation satisfying the min-heap property is acceptable.

---

## 40. Kth Largest Element

### Problem Statement
Given an array of integers and an integer `K`, find the Kth largest element.

### Sample Input
```text
6 2
3 2 1 5 6 4
```

### Sample Output
```text
5
```

---

## 41. K Largest Elements

### Problem Statement
Given an array and an integer `K`, find the K largest elements.

### Sample Input
```text
6 3
10 4 7 1 9 2
```

### Sample Output
```text
10 9 7
```

---

## 42. Heap Sort

### Problem Statement
Given an array of integers, sort it in ascending order using the Heap Sort algorithm.

### Sample Input
```text
5
12 11 13 5 6
```

### Sample Output
```text
5 6 11 12 13
```

---

# Graphs

## 43. Graph Representation

### Problem Statement
Given an undirected graph with `V` vertices and `E` edges, construct its adjacency list.

### Sample Input
```text
4 4
0 1
0 2
1 2
2 3
```

### Sample Output
```text
0: 1 2
1: 0 2
2: 0 1 3
3: 2
```

---

## 44. BFS Traversal

### Problem Statement
Given an undirected graph and a starting vertex, perform Breadth-First Search traversal.

### Sample Input
```text
5 5
0 1
0 2
1 3
2 4
3 4
0
```

### Sample Output
```text
0 1 2 3 4
```

---

## 45. DFS Traversal

### Problem Statement
Given an undirected graph and a starting vertex, perform Depth-First Search traversal.

### Sample Input
```text
5 5
0 1
0 2
1 3
2 4
3 4
0
```

### Sample Output
```text
0 1 3 4 2
```

> DFS order can vary depending on adjacency ordering. Any valid DFS traversal is acceptable.

---

## 46. Detect Cycle in Graph

### Problem Statement
Given an undirected graph, determine whether the graph contains a cycle.

### Sample Input
```text
4 4
0 1
1 2
2 3
3 0
```

### Sample Output
```text
Cycle Detected
```

---

## 47. Connected Components

### Problem Statement
Given an undirected graph, find the number of connected components.

### Sample Input
```text
5 2
0 1
3 4
```

### Sample Output
```text
3
```

---

# 3. Algorithms

## 48. Linear Search

### Problem Statement
Given an array of `N` integers and a target value `X`, find the index of the first occurrence of `X`.

### Sample Input
```text
5 30
10 20 30 40 50
```

### Sample Output
```text
2
```

---

## 49. Binary Search

### Problem Statement
Given a sorted array and a target value, find the target's index using Binary Search.

### Sample Input
```text
6 40
10 20 30 40 50 60
```

### Sample Output
```text
3
```

---

## 50. Bubble Sort

### Problem Statement
Sort an array of integers in ascending order using Bubble Sort.

### Sample Input
```text
5
5 1 4 2 8
```

### Sample Output
```text
1 2 4 5 8
```

---

## 51. Selection Sort

### Problem Statement
Sort an array of integers in ascending order using Selection Sort.

### Sample Input
```text
5
64 25 12 22 11
```

### Sample Output
```text
11 12 22 25 64
```

---

## 52. Insertion Sort

### Problem Statement
Sort an array of integers in ascending order using Insertion Sort.

### Sample Input
```text
5
12 11 13 5 6
```

### Sample Output
```text
5 6 11 12 13
```

---

## 53. Merge Sort

### Problem Statement
Sort an array of integers in ascending order using Merge Sort.

### Sample Input
```text
7
38 27 43 3 9 82 10
```

### Sample Output
```text
3 9 10 27 38 43 82
```

---

## 54. Quick Sort

### Problem Statement
Sort an array of integers in ascending order using Quick Sort.

### Sample Input
```text
6
10 7 8 9 1 5
```

### Sample Output
```text
1 5 7 8 9 10
```

---

# Two Pointer Technique

## 55. Two Sum in Sorted Array

### Problem Statement
Given a sorted array and a target value, determine whether two elements sum to the target. Return their indices if they exist.

### Sample Input
```text
6 10
1 2 4 6 8 9
```

### Sample Output
```text
1 4
```

---

## 56. Remove Duplicates from Sorted Array

### Problem Statement
Given a sorted array, remove duplicate elements in-place and return the number of unique elements.

### Sample Input
```text
7
1 1 2 2 2 3 4
```

### Sample Output
```text
4
1 2 3 4
```

---

## 57. Reverse Array Using Two Pointers

### Problem Statement
Reverse an array in-place using two pointers.

### Sample Input
```text
5
1 2 3 4 5
```

### Sample Output
```text
5 4 3 2 1
```

---

# Sliding Window

## 58. Maximum Sum Subarray of Size K

### Problem Statement
Given an array and an integer `K`, find the maximum sum of any contiguous subarray of size `K`.

### Sample Input
```text
6 3
2 1 5 1 3 2
```

### Sample Output
```text
9
```

---

## 59. Longest Substring Without Repeating Characters

### Problem Statement
Given a string, find the length of the longest substring that contains no repeated characters.

### Sample Input
```text
abcabcbb
```

### Sample Output
```text
3
```

---

## 60. Minimum Window Substring

### Problem Statement
Given strings `S` and `T`, find the smallest substring of `S` that contains every character of `T` with the required frequency.

### Sample Input
```text
ADOBECODEBANC
ABC
```

### Sample Output
```text
BANC
```

---

# Greedy Algorithm

## 61. Activity Selection

### Problem Statement
Given `N` activities with start and finish times, select the maximum number of non-overlapping activities that can be performed by one person.

### Sample Input
```text
6
1 3
2 4
3 5
0 6
5 7
8 9
```

### Sample Output
```text
Maximum Activities: 4
```

---

## 62. Fractional Knapsack

### Problem Statement
Given `N` items with values and weights and a knapsack with capacity `W`, maximize the total value. Fractions of items can be taken.

### Sample Input
```text
3 50
60 10
100 20
120 30
```

### Sample Output
```text
240.00
```

---

## 63. Minimum Number of Coins

### Problem Statement
Given coin denominations and a target amount, find the minimum number of coins required to make the target amount.

### Sample Input
```text
3
1 5 10
18
```

### Sample Output
```text
5
```

> If the amount cannot be formed, print `-1`.

---

# Backtracking

## 64. Generate All Subsets

### Problem Statement
Given an array of `N` distinct integers, generate all possible subsets.

### Sample Input
```text
3
1 2 3
```

### Sample Output
```text
[]
[1]
[2]
[3]
[1, 2]
[1, 3]
[2, 3]
[1, 2, 3]
```

---

## 65. Generate Permutations

### Problem Statement
Given an array of `N` distinct integers, generate all possible permutations.

### Sample Input
```text
3
1 2 3
```

### Sample Output
```text
1 2 3
1 3 2
2 1 3
2 3 1
3 1 2
3 2 1
```

---

## 66. N-Queens

### Problem Statement
Given an integer `N`, place `N` queens on an `N × N` chessboard such that no two queens attack each other.

### Input
```text
4
```

### Output
Print all valid board configurations or the number of valid solutions.

### Sample Output
```text
2
```

---

## 67. Sudoku Solver

### Problem Statement
Given a partially completed 9×9 Sudoku board, fill the empty cells so that every row, column, and 3×3 subgrid contains the digits `1` through `9` exactly once.

### Sample Input
```text
5 3 . . 7 . . . .
6 . . 1 9 5 . . .
. 9 8 . . . . 6 .
8 . . . 6 . . . 3
4 . . 8 . 3 . . 1
7 . . . 2 . . . 6
. 6 . . . . 2 8 .
. . . 4 1 9 . . 5
. . . . 8 . . 7 9
```

### Output
Print the completed Sudoku board.

---

# 4. 30 Must-Do Coding Questions

## 68. Prime Number

### Problem Statement
Given an integer `N`, determine whether it is a prime number.

### Sample Input
```text
29
```

### Sample Output
```text
Prime
```

---

## 69. Palindrome

### Problem Statement
Given a string, determine whether it reads the same forward and backward.

### Sample Input
```text
madam
```

### Sample Output
```text
Palindrome
```

---

## 70. Fibonacci Series

### Problem Statement
Given an integer `N`, print the first `N` terms of the Fibonacci sequence.

### Sample Input
```text
7
```

### Sample Output
```text
0 1 1 2 3 5 8
```

---

## 71. Factorial

### Problem Statement
Given a non-negative integer `N`, calculate `N!`.

### Sample Input
```text
5
```

### Sample Output
```text
120
```

---

## 72. Reverse a Number

### Problem Statement
Given an integer `N`, reverse its digits.

### Sample Input
```text
12345
```

### Sample Output
```text
54321
```

---

## 73. Armstrong Number

### Problem Statement
Given an integer `N`, determine whether it is an Armstrong number. For an N-digit number, the sum of each digit raised to the power N must equal the original number.

### Sample Input
```text
153
```

### Sample Output
```text
Armstrong Number
```

---

## 74. GCD

### Problem Statement
Given two positive integers `A` and `B`, find their Greatest Common Divisor.

### Sample Input
```text
48 18
```

### Sample Output
```text
6
```

---

## 75. LCM

### Problem Statement
Given two positive integers `A` and `B`, find their Least Common Multiple.

### Sample Input
```text
12 18
```

### Sample Output
```text
36
```

---

## 76. Swap Two Numbers

### Problem Statement
Given two integers, swap their values without using a third variable.

### Sample Input
```text
10 20
```

### Sample Output
```text
20 10
```

---

## 77. Count Digits

### Problem Statement
Given an integer `N`, count the number of digits in it.

### Sample Input
```text
123456
```

### Sample Output
```text
6
```

---

## 78. Sum of Digits

### Problem Statement
Given an integer `N`, calculate the sum of all its digits.

### Sample Input
```text
12345
```

### Sample Output
```text
15
```

---

## 79. Anagram

### Problem Statement
Given two strings, determine whether they are anagrams. Ignore spaces and letter case.

### Sample Input
```text
listen
silent
```

### Sample Output
```text
Anagram
```

---

## 80. Reverse String

### Problem Statement
Given a string, reverse all of its characters.

### Sample Input
```text
hello
```

### Sample Output
```text
olleh
```

---

## 81. Remove Duplicates

### Problem Statement
Given an array of integers, remove duplicate elements while preserving the first occurrence of each element.

### Sample Input
```text
8
1 2 2 3 4 1 5 3
```

### Sample Output
```text
1 2 3 4 5
```

---

## 82. Max Element in Array

### Problem Statement
Given an array of integers, find the largest element without using a built-in maximum function.

### Sample Input
```text
5
10 25 7 40 15
```

### Sample Output
```text
40
```

---

## 83. Min Element in Array

### Problem Statement
Given an array of integers, find the smallest element without using a built-in minimum function.

### Sample Input
```text
5
10 25 7 40 15
```

### Sample Output
```text
7
```

---

## 84. Second Largest

### Problem Statement
Given an array of integers, find the second largest distinct element.

### Sample Input
```text
6
10 20 5 20 15 8
```

### Sample Output
```text
15
```

---

## 85. Linear Search

### Problem Statement
Given an array and a target value, find the index of the first occurrence of the target using Linear Search.

### Sample Input
```text
5 30
10 20 30 40 50
```

### Sample Output
```text
2
```

---

## 86. Binary Search

### Problem Statement
Given a sorted array and a target value, find the target index using Binary Search.

### Sample Input
```text
5 40
10 20 30 40 50
```

### Sample Output
```text
3
```

---

## 87. Missing Number

### Problem Statement
Given an array containing `N` distinct numbers from `0` to `N`, with exactly one number missing, find the missing number.

### Sample Input
```text
3
3 0 1
```

### Sample Output
```text
2
```

---

## 88. Majority Element

### Problem Statement
Given an array, find the element that occurs more than `N/2` times. If no such element exists, print `-1`.

### Sample Input
```text
7
2 2 1 1 1 2 2
```

### Sample Output
```text
2
```

---

## 89. Frequency Count

### Problem Statement
Given an array, count the frequency of every distinct element.

### Sample Input
```text
7
1 2 2 3 3 3 1
```

### Sample Output
```text
1: 2
2: 2
3: 3
```

---

## 90. Subarray Sum

### Problem Statement
Given an array of integers and a target sum `K`, find a contiguous subarray whose sum equals `K`.

### Sample Input
```text
5 12
1 2 3 7 5
```

### Sample Output
```text
Subarray: 2 3 7
```

---

## 91. Kadane's Algorithm

### Problem Statement
Given an integer array containing positive and negative numbers, find the maximum possible sum of a contiguous subarray.

### Sample Input
```text
9
-2 1 -3 4 -1 2 1 -5 4
```

### Sample Output
```text
6
```

---

## 92. Valid Parentheses

### Problem Statement
Given a string containing only `()`, `{}`, and `[]`, determine whether the brackets are valid and properly nested.

### Sample Input
```text
({[]})
```

### Sample Output
```text
Valid
```

---

## 93. Reverse Linked List

### Problem Statement
Given a singly linked list, reverse the links and print the reversed list.

### Sample Input
```text
5
1 2 3 4 5
```

### Sample Output
```text
5 4 3 2 1
```

---

## 94. Stack Using Array

### Problem Statement
Implement a stack using an array with the operations `push`, `pop`, and `peek`.

### Sample Input
```text
5
push 10
push 20
peek
pop
peek
```

### Sample Output
```text
20
20
10
```

---

## 95. Queue Using Stack

### Problem Statement
Implement a FIFO queue using two stacks. Support enqueue and dequeue operations.

### Sample Input
```text
5
enqueue 10
enqueue 20
dequeue
enqueue 30
dequeue
```

### Sample Output
```text
10
20
```

---

## 96. Tree Traversal

### Problem Statement
Given the root of a binary tree, perform inorder, preorder, postorder, and level-order traversal.

### Sample Tree
```text
        1
       / \
      2   3
     / \
    4   5
```

### Sample Output
```text
Inorder: 4 2 5 1 3
Preorder: 1 2 4 5 3
Postorder: 4 5 2 3 1
Level Order: 1 2 3 4 5
```

---

## 97. Basic Graph Traversal

### Problem Statement
Given a graph represented by an adjacency list and a starting vertex, perform both BFS and DFS traversal.

### Sample Input
```text
5 5
0 1
0 2
1 3
2 4
3 4
0
```

### Sample Output
```text
BFS: 0 1 2 3 4
DFS: 0 1 3 4 2
```

> DFS order may vary depending on the order in which adjacent vertices are processed.
