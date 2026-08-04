import fs from 'fs';
import path from 'path';
import { Question } from '../types.js';

export function parseDsaQuestionBank(): Question[] {
  const filePath = path.join(process.cwd(), 'Coding_DSA_Problem_Statements_With_Data(1).md');
  if (!fs.existsSync(filePath)) {
    console.warn('Coding_DSA_Problem_Statements_With_Data(1).md not found at', filePath);
    return [];
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  // Split by "## " which delineates problem items
  const chunks = content.split(/^##\s+/m);
  const questions: Question[] = [];

  let qIndex = 1;

  for (const rawChunk of chunks) {
    if (!rawChunk.trim() || rawChunk.startsWith('#')) continue;

    const lines = rawChunk.split('\n');
    const headerLine = lines[0].trim(); // e.g. "1. Variables & Data Types" or "25. Merge Two Sorted Lists"
    const title = headerLine.replace(/^\d+[\.\:]\s*/, '').replace(/^Problem\s+\d+[\.\:]\s*/i, '').trim();

    if (!title) continue;

    const body = lines.slice(1).join('\n');

    // Extract sub-sections using regex
    const probStmtMatch = body.match(/###\s+Problem Statement\s*([\s\S]*?)(?=###|$)/i);
    const inputMatch = body.match(/###\s+Input\s*([\s\S]*?)(?=###|$)/i);
    const outputMatch = body.match(/###\s+Output\s*([\s\S]*?)(?=###|$)/i);
    const constraintsMatch = body.match(/###\s+Constraints\s*([\s\S]*?)(?=###|$)/i);

    // Extract sample inputs / outputs
    const sampleInputMatches = Array.from(body.matchAll(/###\s+Sample Input\s*\d*\s*```[a-z]*\n([\s\S]*?)```/gi));
    const sampleOutputMatches = Array.from(body.matchAll(/###\s+Sample Output\s*\d*\s*```[a-z]*\n([\s\S]*?)```/gi));

    const testCases: Array<{ input: string; expectedOutput: string }> = [];

    if (sampleInputMatches.length > 0 && sampleOutputMatches.length > 0) {
      for (let i = 0; i < Math.min(sampleInputMatches.length, sampleOutputMatches.length); i++) {
        testCases.push({
          input: sampleInputMatches[i][1].trim(),
          expectedOutput: sampleOutputMatches[i][1].trim(),
        });
      }
    }

    if (testCases.length === 0) {
      testCases.push({
        input: 'Sample Input',
        expectedOutput: 'Sample Output',
      });
    }

    const probStatementText = probStmtMatch ? probStmtMatch[1].trim() : body.trim();
    const inputDesc = inputMatch ? inputMatch[1].trim() : '';
    const outputDesc = outputMatch ? outputMatch[1].trim() : '';
    const constraints = constraintsMatch ? constraintsMatch[1].trim() : '1 <= N <= 10^5';

    // Clean starter code matching user guidelines
    let pythonStarter = `# Write your solution here\n`;
    if (/class\b/i.test(title) || /cache|data structure/i.test(title)) {
      pythonStarter = `class Solution:\n    def __init__(self):\n        # Write your solution here\n        pass\n`;
    }

    const starterCode = {
      python: pythonStarter,
      cpp: `#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your solution here\n    return 0;\n}\n`,
      c: `#include <stdio.h>\n\nint main() {\n    // Write your solution here\n    return 0;\n}\n`,
      java: `import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        // Write your solution here\n    }\n}\n`,
    };

    const id = `DSA-CODE-${qIndex++}`;

    questions.push({
      id,
      categoryId: 'cat-dsa',
      categoryName: 'DSA / Coding',
      type: 'coding',
      title: title,
      description: probStatementText,
      createdAt: new Date().toISOString(),
      codingData: {
        supportedLanguages: ['python', 'cpp', 'c', 'java'],
        starterCode,
        inputDescription: inputDesc,
        outputDescription: outputDesc,
        constraints,
        examples: testCases.map((tc) => ({ input: tc.input, output: tc.expectedOutput })),
        testCases,
      },
    });
  }

  console.log(`Parsed ${questions.length} DSA coding problems from Coding_DSA_Problem_Statements_With_Data(1).md`);
  return questions;
}

export function getDsaMcqQuestions(): Question[] {
  const dsaMcqData: Array<{
    title: string;
    description: string;
    options: [string, string, string, string];
    correctAnswer: number;
    explanation: string;
  }> = [
    // 1 - 10: Array, Strings & Complexity
    {
      title: 'Time Complexity of Binary Search',
      description: 'What is the worst-case time complexity of Binary Search on a sorted array of size n?',
      options: ['O(n)', 'O(n log n)', 'O(log n)', 'O(1)'],
      correctAnswer: 2,
      explanation: 'Binary Search repeatedly divides the search space in half, giving a worst-case time complexity of O(log n).'
    },
    {
      title: 'Array Random Access Complexity',
      description: 'What is the time complexity to access an element in a contiguous array by index?',
      options: ['O(1)', 'O(n)', 'O(log n)', 'O(n^2)'],
      correctAnswer: 0,
      explanation: 'Array elements are stored in contiguous memory locations. Using base address + index * element_size, random access takes O(1) time.'
    },
    {
      title: 'Stable Sorting Algorithms',
      description: 'Which of the following sorting algorithms is guaranteed to be stable and run in O(n log n) time in the worst case?',
      options: ['QuickSort', 'HeapSort', 'MergeSort', 'Selection Sort'],
      correctAnswer: 2,
      explanation: 'MergeSort maintains the relative order of equal elements (stable) and consistently operates in O(n log n) time.'
    },
    {
      title: 'In-Place Sorting Space Complexity',
      description: 'What is the auxiliary space complexity of HeapSort?',
      options: ['O(n)', 'O(n log n)', 'O(1)', 'O(log n)'],
      correctAnswer: 2,
      explanation: 'HeapSort rearranges elements in-place within the array using heapify routines, taking O(1) auxiliary space.'
    },
    {
      title: 'Dynamic Array Amortized Insertion',
      description: 'What is the amortized time complexity of appending an element to a dynamic array (e.g. C++ std::vector or Python list)?',
      options: ['O(1)', 'O(n)', 'O(log n)', 'O(n log n)'],
      correctAnswer: 0,
      explanation: 'While resizing takes O(n) time when capacity is reached, doubling capacity spreads the cost over n insertions, giving O(1) amortized time.'
    },
    {
      title: 'Two Pointer Technique Application',
      description: 'Which problem is best solved using the Two-Pointer approach in O(n) time on a sorted array?',
      options: ['Finding all subsets', 'Two Sum on a sorted array', 'Finding the median of an unsorted array', 'Matrix multiplication'],
      correctAnswer: 1,
      explanation: 'Using two pointers starting at opposite ends of a sorted array finds pair sums in linear O(n) time.'
    },
    {
      title: 'Kadanes Algorithm Purpose',
      description: 'What is the maximum subarray sum problem solved by Kadane’s algorithm in terms of time complexity?',
      options: ['O(n^2)', 'O(n log n)', 'O(n)', 'O(1)'],
      correctAnswer: 2,
      explanation: 'Kadane’s algorithm computes the maximum contiguous sum subarray in a single O(n) pass.'
    },
    {
      title: 'String Pattern Matching KMP Complexity',
      description: 'What is the worst-case time complexity of the Knuth-Morris-Pratt (KMP) string matching algorithm for text size N and pattern size M?',
      options: ['O(N * M)', 'O(N + M)', 'O(N log M)', 'O(M log N)'],
      correctAnswer: 1,
      explanation: 'KMP preprocessing takes O(M) and pattern searching takes O(N), yielding overall O(N + M) time.'
    },
    {
      title: 'Rabin-Karp Rolling Hash',
      description: 'Which hashing technique does the Rabin-Karp algorithm use for efficient string searching?',
      options: ['Perfect Hashing', 'Rolling Hash', 'Consistent Hashing', 'Double Hashing'],
      correctAnswer: 1,
      explanation: 'Rabin-Karp uses a rolling hash function to update substring hashes in O(1) time per sliding window shift.'
    },
    {
      title: 'Dutch National Flag Problem',
      description: 'What is the optimal time and space complexity to sort an array containing only 0s, 1s, and 2s?',
      options: ['O(n log n) time, O(1) space', 'O(n) time, O(n) space', 'O(n) time, O(1) space', 'O(n^2) time, O(1) space'],
      correctAnswer: 2,
      explanation: 'Dijkstra’s Dutch National Flag 3-pointer partition sorts 0s, 1s, 2s in one O(n) pass with O(1) auxiliary space.'
    },

    // 11 - 20: Linked Lists
    {
      title: 'Singly Linked List Deletion Complexity',
      description: 'Given a pointer to a node in a Singly Linked List (not the head node), what is the time complexity to delete that node without knowing head?',
      options: ['O(1) by copying next node value', 'O(n)', 'O(log n)', 'Impossible'],
      correctAnswer: 0,
      explanation: 'Copy the data of node->next into current node and update current->next = current->next->next in O(1) time.'
    },
    {
      title: 'Cycle Detection Floyds Algorithm',
      description: 'Floyd’s Cycle-Finding algorithm (Tortoise and Hare) uses how many pointers and what space complexity?',
      options: ['1 pointer, O(1) space', '2 pointers, O(1) space', '2 pointers, O(n) space', 'Hash set, O(n) space'],
      correctAnswer: 1,
      explanation: 'Floyd’s algorithm uses a slow pointer (1 step) and fast pointer (2 steps) taking O(1) auxiliary space.'
    },
    {
      title: 'Middle of Linked List',
      description: 'How can you find the middle node of a linked list in a single traversal?',
      options: ['Counting length then traversing', 'Using slow and fast pointers (slow moves 1, fast moves 2)', 'Reversing list', 'Using recursion only'],
      correctAnswer: 1,
      explanation: 'When the fast pointer reaches the end of the list, the slow pointer will be at the exact middle node.'
    },
    {
      title: 'Reversing a Singly Linked List',
      description: 'What is the minimum auxiliary space complexity to reverse a singly linked list iteratively?',
      options: ['O(n)', 'O(log n)', 'O(1)', 'O(n^2)'],
      correctAnswer: 2,
      explanation: 'Iterative reversal uses three pointers (`prev`, `curr`, `next`) requiring O(1) auxiliary space.'
    },
    {
      title: 'Merge Two Sorted Linked Lists',
      description: 'What is the time complexity to merge two sorted linked lists of sizes N and M?',
      options: ['O(N * M)', 'O(N + M)', 'O(N log M)', 'O(1)'],
      correctAnswer: 1,
      explanation: 'Comparing head nodes and advancing pointers merges both lists in O(N + M) linear time.'
    },
    {
      title: 'Doubly Linked List Insertion Advantage',
      description: 'What is the main advantage of a Doubly Linked List over a Singly Linked List during node deletion when given the node pointer?',
      options: ['Less memory per node', 'Deletion takes O(1) without needing node\'s predecessor', 'Random access in O(1)', 'Faster linear search'],
      correctAnswer: 1,
      explanation: 'Doubly linked list nodes store a `prev` pointer, allowing direct O(1) deletion without searching for predecessor.'
    },
    {
      title: 'Circular Linked List Property',
      description: 'Which condition identifies the end node in a circular singly linked list?',
      options: ['`node->next == NULL`', '`node->next == head`', '`node == NULL`', '`node->prev == head`'],
      correctAnswer: 1,
      explanation: 'In a circular linked list, the last node’s `next` pointer points back to the `head` node.'
    },
    {
      title: 'Skip List Expected Search Time',
      description: 'What is the expected time complexity for search, insertion, and deletion operations in a Skip List?',
      options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
      correctAnswer: 1,
      explanation: 'Skip Lists use probabilistic multi-level linked lists to achieve O(log n) expected time for operations.'
    },
    {
      title: 'LRU Cache Data Structure Combination',
      description: 'Which combination of data structures provides O(1) time complexity for `get` and `put` operations in an LRU Cache?',
      options: ['Array + Hash Map', 'Doubly Linked List + Hash Map', 'Stack + Binary Search Tree', 'Queue + Heap'],
      correctAnswer: 1,
      explanation: 'Hash Map gives O(1) key lookup to DLL nodes, while Doubly Linked List gives O(1) element removal and re-positioning.'
    },
    {
      title: 'Intersection Point of Two Linked Lists',
      description: 'What is the time and space complexity of finding the intersection node of two singly linked lists of lengths N and M using pointer realignment?',
      options: ['O(N + M) time, O(1) space', 'O(N * M) time, O(1) space', 'O(N + M) time, O(N) space', 'O(N log M) time, O(1) space'],
      correctAnswer: 0,
      explanation: 'Switching pointers to the opposite list head upon reaching NULL aligns distances in O(N + M) time and O(1) space.'
    },

    // 21 - 30: Stacks & Queues
    {
      title: 'Stack LIFO Principle',
      description: 'Which data structure operates on a Last-In, First-Out (LIFO) discipline?',
      options: ['Queue', 'Stack', 'Priority Queue', 'Deque'],
      correctAnswer: 1,
      explanation: 'Stack enforces LIFO ordering where the most recently added element is removed first.'
    },
    {
      title: 'Infix to Postfix Stack Evaluation',
      description: 'Which data structure is primarily used to evaluate or convert infix expressions to postfix (RPN) notation?',
      options: ['Queue', 'Tree', 'Stack', 'Graph'],
      correctAnswer: 2,
      explanation: 'Stack holds operators and parenthesis according to operator precedence during conversion.'
    },
    {
      title: 'Monotonic Stack Use Case',
      description: 'Which classic problem is efficiently solved in O(n) time using a Monotonic Stack?',
      options: ['Shortest path in graph', 'Next Greater Element for every array item', 'Level order traversal', 'Binary Search'],
      correctAnswer: 1,
      explanation: 'A monotonic stack maintains elements in sorted order to find the Next Greater Element for all items in O(n) time.'
    },
    {
      title: 'Queue Implementation using Two Stacks',
      description: 'What is the amortized cost of `dequeue()` when implementing a Queue using two Stacks?',
      options: ['O(n)', 'O(log n)', 'O(1)', 'O(n^2)'],
      correctAnswer: 2,
      explanation: 'Elements are pushed to Stack1 and popped from Stack2. Pushing/popping each element across stacks happens twice total, yielding O(1) amortized cost.'
    },
    {
      title: 'Circular Queue Empty vs Full',
      description: 'In an array-based Circular Queue of capacity C with `front` and `rear` pointers, what condition indicates the queue is FULL when 1 slot is left unused?',
      options: ['`front == rear`', '`(rear + 1) % C == front`', '`rear == C - 1`', '`front == 0`'],
      correctAnswer: 1,
      explanation: 'Leaving one slot empty distinguishes empty (`front == rear`) from full (`(rear + 1) % C == front`).'
    },
    {
      title: 'Priority Queue Underlying Data Structure',
      description: 'Which data structure is typically used to implement a Priority Queue to achieve O(log n) insertion and extraction?',
      options: ['Binary Search Tree', 'Binary Heap', 'Unsorted Array', 'Hash Table'],
      correctAnswer: 1,
      explanation: 'Binary Heaps maintain min/max heap properties efficiently in array layout with O(log n) push/pop operations.'
    },
    {
      title: 'Min Stack O(1) Min Operation',
      description: 'How can a Stack retrieve the minimum element in O(1) time?',
      options: ['Sorting stack on push', 'Maintaining an auxiliary stack of minimums', 'Scanning stack linearly', 'Using binary search on stack'],
      correctAnswer: 1,
      explanation: 'An auxiliary stack tracks the minimum value present at each stack height, enabling O(1) `getMin()` calls.'
    },
    {
      title: 'Sliding Window Maximum Deque',
      description: 'What data structure achieves O(n) overall time for finding maximums in all sliding windows of size K?',
      options: ['Max Heap', 'Monotonic Double-Ended Queue (Deque)', 'Balanced BST', 'Stack'],
      correctAnswer: 1,
      explanation: 'A monotonic deque stores indices of candidate maximums in decreasing order, yielding O(n) time.'
    },
    {
      title: 'Valid Parentheses Matching',
      description: 'What is the time and space complexity to check for balanced brackets `({[]})` in a string of length N?',
      options: ['O(N) time, O(N) space', 'O(N^2) time, O(1) space', 'O(N log N) time, O(N) space', 'O(1) time, O(1) space'],
      correctAnswer: 0,
      explanation: 'A stack pushes open brackets and pops matching closing brackets in O(N) time and space.'
    },
    {
      title: 'BFS Level Order Traversal Queue',
      description: 'Which data structure is essential for performing Breadth-First Search (BFS) on a tree or graph?',
      options: ['Stack', 'Queue', 'Heap', 'Trie'],
      correctAnswer: 1,
      explanation: 'A Queue enforces First-In, First-Out order needed to explore vertices level by level.'
    },

    // 31 - 40: Binary Trees & BST
    {
      title: 'Height of Balanced Binary Tree',
      description: 'What is the maximum height of a balanced binary tree with N nodes?',
      options: ['O(N)', 'O(log N)', 'O(N^2)', 'O(1)'],
      correctAnswer: 1,
      explanation: 'A balanced binary tree balances node distribution across both subtrees, ensuring height h = O(log N).'
    },
    {
      title: 'Inorder Traversal of BST',
      description: 'Which tree traversal produces values in sorted non-decreasing order for a Binary Search Tree (BST)?',
      options: ['Preorder Traversal', 'Inorder Traversal', 'Postorder Traversal', 'Level-order Traversal'],
      correctAnswer: 1,
      explanation: 'Inorder traversal visits Left -> Root -> Right, which naturally visits BST keys in ascending order.'
    },
    {
      title: 'Full vs Complete Binary Tree',
      description: 'Which statement accurately describes a Complete Binary Tree?',
      options: ['Every node has either 0 or 2 children', 'All levels are completely filled except possibly the last, which is filled from left to right', 'All leaves are at different levels', 'Every node has exactly 1 child'],
      correctAnswer: 1,
      explanation: 'A Complete Binary Tree fills all levels except possibly the last level, where leaves are positioned as far left as possible.'
    },
    {
      title: 'Worst Case Search in Skewed BST',
      description: 'What is the worst-case search time complexity in an unbalanced (skewed) Binary Search Tree with N nodes?',
      options: ['O(log N)', 'O(N)', 'O(N log N)', 'O(1)'],
      correctAnswer: 1,
      explanation: 'When keys are inserted in sorted order, the BST degenerates into a single linear chain with O(N) search time.'
    },
    {
      title: 'AVL Tree Balance Factor',
      description: 'In an AVL Tree, what are the allowed values for the balance factor of any node (`Height(Left) - Height(Right)`)?',
      options: ['-1, 0, 1', '-2, 0, 2', '0 only', 'Any integer <= 3'],
      correctAnswer: 0,
      explanation: 'AVL trees maintain strict balance by ensuring node balance factors remain within {-1, 0, 1}.'
    },
    {
      title: 'Lowest Common Ancestor in BST',
      description: 'Given nodes p and q in a BST, how do you locate their Lowest Common Ancestor (LCA)?',
      options: ['Traverse whole tree using BFS', 'Start at root; move left if both < root, move right if both > root; current node is LCA when split', 'Store parent pointers for all nodes', 'Use postorder recursion only'],
      correctAnswer: 1,
      explanation: 'In a BST, the first node whose value lies between p and q (inclusive) is their LCA.'
    },
    {
      title: 'Construct Tree from Traversals',
      description: 'Which pair of traversals uniquely reconstructs a Binary Tree (assuming unique keys)?',
      options: ['Preorder and Postorder', 'Inorder and Preorder', 'Level order and Postorder', 'Inorder only'],
      correctAnswer: 1,
      explanation: 'Inorder combined with either Preorder or Postorder uniquely defines the tree structure.'
    },
    {
      title: 'Diameter of Binary Tree',
      description: 'What is the diameter of a binary tree?',
      options: ['Number of leaf nodes', 'Length of the longest path between any two nodes', 'Total number of edges', 'Height of the root node'],
      correctAnswer: 1,
      explanation: 'Diameter (or width) is the number of edges along the longest path between any two vertices.'
    },
    {
      title: 'Segment Tree Range Query',
      description: 'What is the time complexity of range sum query and single element update in a Segment Tree of size N?',
      options: ['O(N) query, O(1) update', 'O(log N) query, O(log N) update', 'O(1) query, O(N) update', 'O(log N) query, O(1) update'],
      correctAnswer: 1,
      explanation: 'Segment trees perform both range aggregation queries and point updates in O(log N) time.'
    },
    {
      title: 'Trie Insert and Search Complexity',
      description: 'In a Trie (Prefix Tree), what is the time complexity to insert or search a word of length L?',
      options: ['O(N)', 'O(L)', 'O(log N)', 'O(L log N)'],
      correctAnswer: 1,
      explanation: 'Trie operations inspect one character per level, completing insert or search in O(L) time where L is word length.'
    },

    // 41 - 50: Graphs & Shortest Paths
    {
      title: 'Graph Representation Space Complexity',
      description: 'What is the space complexity of an Adjacency List for a graph with V vertices and E edges?',
      options: ['O(V^2)', 'O(V + E)', 'O(E^2)', 'O(V * E)'],
      correctAnswer: 1,
      explanation: 'Adjacency lists store V heads and E directed edge entries, requiring O(V + E) space.'
    },
    {
      title: 'BFS Time Complexity',
      description: 'What is the time complexity of Breadth-First Search (BFS) on an adjacency list graph with V vertices and E edges?',
      options: ['O(V^2)', 'O(V + E)', 'O(V log E)', 'O(E log V)'],
      correctAnswer: 1,
      explanation: 'BFS visits every vertex once and inspects every edge once, taking O(V + E) time.'
    },
    {
      title: 'Dijkstra Algorithm Limitation',
      description: 'What is the primary constraint of Dijkstra’s shortest path algorithm?',
      options: ['Does not work on directed graphs', 'Does not work correctly on graphs with negative edge weights', 'Only works on trees', 'Requires graph to be planar'],
      correctAnswer: 1,
      explanation: 'Greedy choices in Dijkstra fail when negative weight edges cause previously settled distances to decrease.'
    },
    {
      title: 'Bellman Ford Time Complexity',
      description: 'What is the time complexity of the Bellman-Ford algorithm for single-source shortest path?',
      options: ['O(V + E)', 'O(V * E)', 'O(V^3)', 'O(E log V)'],
      correctAnswer: 1,
      explanation: 'Bellman-Ford relaxes all E edges V - 1 times, running in O(V * E) time and detecting negative weight cycles.'
    },
    {
      title: 'Floyd Warshall All Pairs Shortest Path',
      description: 'What algorithm computes All-Pairs Shortest Paths in O(V^3) time using Dynamic Programming?',
      options: ['Dijkstra', 'Floyd-Warshall', 'Kruskal', 'Prim'],
      correctAnswer: 1,
      explanation: 'Floyd-Warshall uses a 3D/2D DP table over intermediate vertices k from 1 to V, running in O(V^3) time.'
    },
    {
      title: 'Topological Sort Applicability',
      description: 'Topological sorting is valid ONLY for which type of graph?',
      options: ['Undirected Acyclic Graph', 'Directed Acyclic Graph (DAG)', 'Complete Graph', 'Cyclic Directed Graph'],
      correctAnswer: 1,
      explanation: 'Topological sort linearizes dependencies and requires a Directed Acyclic Graph (DAG).'
    },
    {
      title: 'Kruskal Minimum Spanning Tree Data Structure',
      description: 'Which data structure is used by Kruskal’s algorithm to detect cycles efficiently while adding edges?',
      options: ['Stack', 'Disjoint Set Union (DSU / Union-Find)', 'Priority Queue only', 'Adjacency Matrix'],
      correctAnswer: 1,
      explanation: 'Union-Find (DSU) checks whether edge endpoints belong to the same connected component in near O(1) time.'
    },
    {
      title: 'Prim Algorithm vs Kruskal',
      description: 'Which Minimum Spanning Tree algorithm grows a single tree component starting from an arbitrary root vertex?',
      options: ['Kruskal\'s Algorithm', 'Prim\'s Algorithm', 'Bellman-Ford', 'Tarjan\'s Algorithm'],
      correctAnswer: 1,
      explanation: 'Prim’s algorithm greedily expands a single connected tree component by adding the cheapest connecting edge.'
    },
    {
      title: 'Bipartite Graph Chromatic Number',
      description: 'A graph is bipartite if and only if it contains:',
      options: ['No even cycles', 'No odd length cycles', 'No self-loops only', 'At least 3 cliques'],
      correctAnswer: 1,
      explanation: 'A graph can be 2-colored (bipartite) if and only if it contains no cycles of odd length.'
    },
    {
      title: 'Strongly Connected Components Tarjan Kosaraju',
      description: 'Kosaraju’s algorithm finds Strongly Connected Components (SCCs) in a directed graph using how many DFS passes?',
      options: ['1 DFS pass', '2 DFS passes (one on original, one on transposed graph)', 'V DFS passes', 'Binary Search + DFS'],
      correctAnswer: 1,
      explanation: 'Kosaraju runs 1st DFS to order vertices by finish time, transposes the graph, and runs 2nd DFS in reverse finish order.'
    },

    // 51 - 60: Dynamic Programming & Recursion
    {
      title: 'Dynamic Programming Requirements',
      description: 'Which two key properties must a problem possess to be efficiently solvable using Dynamic Programming?',
      options: ['Greedy choice property & Linear structure', 'Overlapping subproblems & Optimal substructure', 'Divide and conquer & Randomization', 'Monotonicity & Invariance'],
      correctAnswer: 1,
      explanation: 'Optimal substructure allows building solutions from subproblem solutions; overlapping subproblems enables memoization/tabulation.'
    },
    {
      title: '0 1 Knapsack Time Complexity',
      description: 'What is the time complexity of the 0/1 Knapsack problem with N items and maximum weight capacity W using Dynamic Programming?',
      options: ['O(2^N)', 'O(N * W)', 'O(N + W)', 'O(N^2)'],
      correctAnswer: 1,
      explanation: '0/1 Knapsack DP table has size (N+1) x (W+1), taking O(N * W) pseudo-polynomial time.'
    },
    {
      title: 'Longest Common Subsequence LCS Complexity',
      description: 'What is the DP time complexity to find the Longest Common Subsequence of two strings of lengths N and M?',
      options: ['O(N + M)', 'O(N * M)', 'O(2^(N+M))', 'O(N log M)'],
      correctAnswer: 1,
      explanation: 'LCS uses an N x M table where `dp[i][j]` depends on previous subproblem entries, giving O(N * M) time.'
    },
    {
      title: 'Coin Change Minimum Coins Problem',
      description: 'In the Unbounded Coin Change problem to form sum S using C coin denominations, what is the DP state recurrence for `dp[i]`?',
      options: ['`min(dp[i - coin] + 1)` for all valid coins', '`max(dp[i - 1])`', '`dp[i] = dp[i/2]`', '`sum(dp[i - coin])`'],
      correctAnswer: 0,
      explanation: 'To minimize coin count for sum `i`, we try taking each coin and add 1 to `dp[i - coin]`.'
    },
    {
      title: 'Matrix Chain Multiplication Complexity',
      description: 'What is the time complexity of the standard Dynamic Programming solution for Matrix Chain Multiplication of N matrices?',
      options: ['O(N^2)', 'O(N^3)', 'O(2^N)', 'O(N log N)'],
      correctAnswer: 1,
      explanation: 'Matrix Chain Multiplication evaluates subproblems for length L from 2 to N with split k from i to j, running in O(N^3) time.'
    },
    {
      title: 'Memoization vs Tabulation',
      description: 'What is the structural difference between Memoization and Tabulation in Dynamic Programming?',
      options: ['Memoization is bottom-up; Tabulation is top-down recursion', 'Memoization is top-down recursion with caching; Tabulation is bottom-up iterative table filling', 'Memoization uses no extra memory', 'Tabulation uses stacks'],
      correctAnswer: 1,
      explanation: 'Memoization caches recursive calls top-down; Tabulation fills DP tables iteratively from base cases bottom-up.'
    },
    {
      title: 'Longest Increasing Subsequence Patience Sorting',
      description: 'What is the optimal time complexity to find the length of the Longest Increasing Subsequence (LIS) using Binary Search + Tail array?',
      options: ['O(N^2)', 'O(N log N)', 'O(N)', 'O(N^3)'],
      correctAnswer: 1,
      explanation: 'Patience sorting maintains candidate end elements in a sorted array, using binary search `std::lower_bound` in O(N log N) time.'
    },
    {
      title: 'Edit Distance Levenshtein Operations',
      description: 'In Edit Distance DP, which three operations are allowed to convert string A into string B?',
      options: ['Insert, Delete, Replace', 'Swap, Reverse, Shift', 'Copy, Paste, Cut', 'Split, Merge, Append'],
      correctAnswer: 0,
      explanation: 'Levenshtein distance counts the minimum single-character insertions, deletions, and substitutions.'
    },
    {
      title: 'Tail Call Optimization',
      description: 'What is Tail Call Optimization (TCO) in recursive functions?',
      options: ['Removing base cases', 'Reusing current stack frame when recursive call is the final statement', 'Converting recursion to binary trees', 'Parallelizing calls'],
      correctAnswer: 1,
      explanation: 'TCO replaces current stack frame with target frame when recursive call is in tail position, preventing stack overflow O(1) space.'
    },
    {
      title: 'Subset Sum Problem NP Completeness',
      description: 'The Subset Sum problem is classified as:',
      options: ['P (Polynomial Time)', 'NP-Complete', 'Undecidable', 'O(1) trivial'],
      correctAnswer: 1,
      explanation: 'Subset Sum is a classic NP-complete decision problem with pseudo-polynomial DP solution O(N * Sum).'
    },

    // 61 - 70: Heaps, Hashing & Bit Manipulation
    {
      title: 'Build Heap Time Complexity',
      description: 'What is the time complexity to build a Min/Max Heap from an unsorted array of N elements using Bottom-Up Heapify (`buildHeap`)?',
      options: ['O(N log N)', 'O(N)', 'O(N^2)', 'O(log N)'],
      correctAnswer: 1,
      explanation: 'Sum of heights in a full binary tree converges to N, making bottom-up `buildHeap` run in O(N) linear time.'
    },
    {
      title: 'Hash Table Collision Resolution Chaining',
      description: 'What is the worst-case search time in a Hash Table with open hashing (chaining) if all keys hash to the same bucket?',
      options: ['O(1)', 'O(N)', 'O(log N)', 'O(N log N)'],
      correctAnswer: 1,
      explanation: 'When all keys collide in 1 bucket, the chain becomes a linked list requiring O(N) linear search time.'
    },
    {
      title: 'Load Factor in Hash Maps',
      description: 'What does the Load Factor (α = N / M) of a Hash Map represent?',
      options: ['Ratio of total elements N to hash table buckets M', 'Execution speed of hash function', 'Number of collisions per second', 'Memory size in kilobytes'],
      correctAnswer: 0,
      explanation: 'Load Factor α is the average number of elements stored per bucket. Resizing triggers when α exceeds threshold (e.g. 0.75).'
    },
    {
      title: 'Bitwise XOR Property',
      description: 'Which property of XOR (`a ^ a = 0` and `a ^ 0 = a`) allows finding the single non-repeating element in an array where every other element appears twice?',
      options: ['Associative & Commutative Inverse cancellation', 'Distributive Law', 'De Morgan\'s Law', 'Bit Shift Multiplication'],
      correctAnswer: 0,
      explanation: 'XORing all elements cancels paired numbers (`x ^ x = 0`), leaving only the unique number in O(N) time and O(1) space.'
    },
    {
      title: 'Checking Power of Two Bitwise',
      description: 'Which bitwise expression evaluates to true if integer n is a positive power of 2?',
      options: ['`(n & (n - 1)) == 0`', '`(n | (n - 1)) == 0`', '`(n ^ (n + 1)) == 0`', '`(n >> 1) == 0`'],
      correctAnswer: 0,
      explanation: 'A power of 2 has 1 set bit (e.g. 1000). `n - 1` flips set bit and trailing zeros (0111). `n & (n - 1)` equals 0.'
    },
    {
      title: 'Count Set Bits Kernighan Algorithm',
      description: 'Brian Kernighan’s bit counting algorithm counts set bits in O(K) time where K is:',
      options: ['Total bits 32/64', 'Number of set bits (1s)', 'Number of zero bits (0s)', 'Value of n'],
      correctAnswer: 1,
      explanation: '`n = n & (n - 1)` clears the lowest set bit in each iteration, running in K operations where K is number of set bits.'
    },
    {
      title: 'Median of Data Stream Dual Heap',
      description: 'Which combination of data structures maintains the median of a dynamic data stream in O(1) query time and O(log N) insertion time?',
      options: ['Max Heap for lower half + Min Heap for upper half', 'Two Stacks', 'Hash Map + Array', 'Segment Tree'],
      correctAnswer: 0,
      explanation: 'Max-heap holds lower half and Min-heap holds upper half; sizes differ by at most 1, making top elements yield median in O(1).'
    },
    {
      title: 'Trie Memory Optimization',
      description: 'What compact representation merges single-child chain nodes in a Trie to save memory?',
      options: ['Radix Tree (Patricia Trie)', 'Binary Search Tree', 'B-Tree', 'Splay Tree'],
      correctAnswer: 0,
      explanation: 'Radix Tree (Compressed Trie) compresses chains of nodes with single children into single multi-character edge labels.'
    },
    {
      title: 'Bloom Filter False Positives',
      description: 'A Bloom Filter provides space-efficient probabilistic set membership. Which outcome is IMPOSSIBLE in a Bloom Filter?',
      options: ['False Positive (element reported present when absent)', 'False Negative (element reported absent when present)', 'True Positive', 'True Negative'],
      correctAnswer: 1,
      explanation: 'Bloom filters never produce False Negatives. If a bloom filter says an item is absent, it is guaranteed 100% to be absent.'
    },
    {
      title: 'Disjoint Set Path Compression Complexity',
      description: 'With Path Compression and Rank/Size heuristic, what is the amortized time complexity per Union/Find operation on DSU?',
      options: ['O(log N)', 'O(α(N)) - Inverse Ackermann Function', 'O(1) exact', 'O(N)'],
      correctAnswer: 1,
      explanation: 'Path compression flattens tree paths during find, yielding near-constant O(α(N)) amortized time where α(N) <= 4 for all practical N.'
    },

    // 71 - 80: Sorting & Searching Deep Dive
    {
      title: 'QuickSort Pivot Selection Worst Case',
      description: 'When does QuickSort exhibit its worst-case O(N^2) time complexity if first element is chosen as pivot?',
      options: ['Random array', 'Already sorted or reverse sorted array', 'Array with all distinct elements', 'Array size is power of 2'],
      correctAnswer: 1,
      explanation: 'Choosing the first element as pivot on an already sorted array results in unbalanced partitions of size 0 and N - 1.'
    },
    {
      title: 'Counting Sort Applicability',
      description: 'Counting Sort runs in O(N + K) time. Under what condition is Counting Sort preferred over Comparison-Based sorting?',
      options: ['When array contains floating point numbers', 'When range of key values K is O(N) or small integers', 'When memory is extremely constrained', 'When sorting strings of arbitrary length'],
      correctAnswer: 1,
      explanation: 'Counting sort is a non-comparison algorithm that creates frequency buckets; it is optimal when value range K <= O(N).'
    },
    {
      title: 'Comparison Based Sorting Lower Bound',
      description: 'What is the theoretical lower bound for comparison-based sorting algorithms in worst-case time complexity?',
      options: ['Ω(N)', 'Ω(N log N)', 'Ω(N^2)', 'Ω(log N)'],
      correctAnswer: 1,
      explanation: 'Decision tree analysis proves that sorting N distinct elements by comparison requires at least log2(N!) = Ω(N log N) comparisons.'
    },
    {
      title: 'Radix Sort Digit Processing',
      description: 'LSD (Least Significant Digit) Radix Sort requires the inner bucket sorting algorithm to be:',
      options: ['In-place', 'Stable', 'Recursive', 'Comparison-based'],
      correctAnswer: 1,
      explanation: 'Stability ensures that sorting on higher-order digits preserves the previously sorted order of lower-order digits.'
    },
    {
      title: 'External Sort Algorithm',
      description: 'Which algorithm is used to sort datasets that are too large to fit into main memory (RAM)?',
      options: ['QuickSort', 'External Merge Sort', 'HeapSort', 'Bubble Sort'],
      correctAnswer: 1,
      explanation: 'External Merge Sort breaks large file data into RAM-sized chunks, sorts them, and merges sorted runs back to disk.'
    },
    {
      title: 'Binary Search Lower Bound Index',
      description: 'In C++ STL `std::lower_bound`, what index/iterator is returned for target value X in a sorted array?',
      options: ['First element greater than X', 'First element >= X (not less than X)', 'Last element <= X', 'Exact match or end'],
      correctAnswer: 1,
      explanation: '`lower_bound` finds the first element position that does not compare less than target X (i.e. >= X).'
    },
    {
      title: 'Ternary Search Unimodal Functions',
      description: 'Ternary Search finds maximum/minimum of a unimodal function by dividing search space into how many parts per step?',
      options: ['2 parts', '3 equal parts', '4 parts', 'N parts'],
      correctAnswer: 1,
      explanation: 'Ternary search evaluates two midpoints `m1` and `m2` to divide the range into 3 equal sub-segments.'
    },
    {
      title: 'Interpolation Search Best Case',
      description: 'What is the average time complexity of Interpolation Search on uniformly distributed sorted data?',
      options: ['O(N)', 'O(log log N)', 'O(log N)', 'O(1)'],
      correctAnswer: 1,
      explanation: 'Interpolation search uses linear interpolation formula to probe positions, achieving O(log log N) average time.'
    },
    {
      title: 'Bucket Sort Uniform Distribution',
      description: 'Bucket Sort achieves average O(N) time complexity when inputs are:',
      options: ['Uniformly distributed over interval [0, 1)', 'Sorted in reverse', 'All identical values', 'Exponentially distributed'],
      correctAnswer: 0,
      explanation: 'Uniform distribution ensures elements distribute evenly across buckets, leaving average O(1) elements per bucket.'
    },
    {
      title: 'ShellSort Gap Sequence',
      description: 'ShellSort is an optimization over which elementary sorting algorithm by comparing elements separated by a gap?',
      options: ['Selection Sort', 'Insertion Sort', 'Bubble Sort', 'Counting Sort'],
      correctAnswer: 1,
      explanation: 'ShellSort generalizes Insertion Sort by allowing exchanges of far-apart elements driven by gap sequences.'
    },

    // 81 - 100: Advanced DSA, Backtracking, System Concepts
    {
      title: 'N Queens Backtracking State Space',
      description: 'How does Backtracking solve the N-Queens problem efficiently compared to brute force search?',
      options: ['By evaluating all N^N placements', 'By pruning partial solutions that violate queen attack rules early', 'By using Dynamic Programming tables', 'By sorting board coordinates'],
      correctAnswer: 1,
      explanation: 'Backtracking prunes branches as soon as a queen conflict is detected on column or diagonals.'
    },
    {
      title: 'Sudoku Solver Time Complexity',
      description: 'What algorithm strategy is standard for solving Sudoku puzzles by placing digits 1-9?',
      options: ['Greedy Algorithm', 'Recursive Backtracking', 'Floyd-Warshall', 'Binary Search'],
      correctAnswer: 1,
      explanation: 'Sudoku solvers try valid digits recursively in empty cells and backtrack when constraints fail.'
    },
    {
      title: 'Hamiltonian Path vs Eulerian Path',
      description: 'Which problem visits every VERTEX in a graph exactly once?',
      options: ['Eulerian Path', 'Hamiltonian Path', 'Shortest Path', 'Spanning Tree'],
      correctAnswer: 1,
      explanation: 'Hamiltonian Path visits every vertex once (NP-complete); Eulerian Path visits every edge once (O(V+E)).'
    },
    {
      title: 'B Tree Database Indexing',
      description: 'Why are B-Trees / B+ Trees widely used in database indexing instead of Binary Search Trees?',
      options: ['B-Trees use less memory', 'B-Trees have high branching factor (node degree), minimizing disk I/O reads', 'B-Trees do not require sorting', 'B-Trees operate in O(1) time'],
      correctAnswer: 1,
      explanation: 'B-Trees store hundreds of keys per node, keeping tree height extremely low (2-3 levels) to minimize disk reads.'
    },
    {
      title: 'Fenwick Tree Binary Indexed Tree',
      description: 'In a Fenwick Tree (BIT) of size N, how is parent index calculated when updating frequency at index `i`?',
      options: ['`i = i + (i & -i)`', '`i = i - (i & -i)`', '`i = i / 2`', '`i = i * 2`'],
      correctAnswer: 0,
      explanation: 'Adding the lowest set bit `(i & -i)` propagates point updates up through Fenwick tree tree nodes in O(log N).'
    },
    {
      title: 'Red Black Tree Black Height Property',
      description: 'In a Red-Black Tree, every path from a given node to any of its descendant NIL leaves must contain:',
      options: ['Same total number of nodes', 'Same number of black nodes', 'Same number of red nodes', 'At most 2 red nodes'],
      correctAnswer: 1,
      explanation: 'Red-Black tree invariants require equal black-height on all root-to-leaf paths to guarantee height <= 2 log(N+1).'
    },
    {
      title: 'Master Theorem Case Identification',
      description: 'For recurrence `T(n) = 2 T(n/2) + O(n)` (MergeSort), what is the tight asymptotic solution by Master Theorem?',
      options: ['O(n)', 'O(n log n)', 'O(n^2)', 'O(log n)'],
      correctAnswer: 1,
      explanation: 'Here a = 2, b = 2, n^(log_b a) = n^1. f(n) = O(n) matches Case 2 of Master Theorem => T(n) = O(n log n).'
    },
    {
      title: 'Graph Cycle Detection Undirected Graph DSU',
      description: 'How can you detect a cycle in an undirected graph while building it edge by edge?',
      options: ['If both endpoints of new edge belong to same Set in DSU', 'By running Topological Sort', 'If edge count > V^2', 'If graph is connected'],
      correctAnswer: 0,
      explanation: 'If `find(u) == find(v)` before adding edge `(u, v)`, adding this edge creates a cycle.'
    },
    {
      title: 'Heavy Light Decomposition Purpose',
      description: 'What does Heavy-Light Decomposition (HLD) do on a Tree?',
      options: ['Converts tree into DAG', 'Decomposes tree paths into O(log N) contiguous chain segments for Segment Tree queries', 'Calculates tree diameter in O(1)', 'Balances tree height'],
      correctAnswer: 1,
      explanation: 'HLD partitions tree edges into heavy and light chains so path queries between any two nodes decompose into O(log N) array segments.'
    },
    {
      title: 'Splay Tree Amortized Complexity',
      description: 'Splay Trees move accessed nodes to the root using splay rotations. What is the amortized cost per operation?',
      options: ['O(1)', 'O(log N)', 'O(N)', 'O(N log N)'],
      correctAnswer: 1,
      explanation: 'Self-adjusting Splay trees guarantee O(log N) amortized time per lookup, insertion, and deletion.'
    }
  ];

  return dsaMcqData.map((q, idx) => ({
    id: `q-dsa-mcq-${idx + 1}`,
    categoryId: 'cat-dsa',
    categoryName: 'DSA',
    type: 'mcq',
    title: `${idx + 1}. ${q.title}`,
    description: q.description,
    createdAt: new Date().toISOString(),
    points: 10,
    mcqData: {
      options: q.options,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
    },
  }));
}
