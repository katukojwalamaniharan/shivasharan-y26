export interface SeedResource {
  id: string;
  title: string;
  category: string;
  typeFocus: string;
  priority: 'High' | 'Optional' | 'Reference' | 'Parked';
  recommendedUse: string;
  url: string;
  status: 'Not started' | 'In progress' | 'Completed' | 'Reference';
  notes: string;
}

export interface RoadmapTask {
  id: string;
  title: string;
  detail: string;
  tag: string;
  isCheckpoint?: boolean;
}

export interface RoadmapPhase {
  id: string;
  semester: number;
  semesterLabel: string;
  monthLabel: string;
  windowLabel: string;
  title: string;
  targetProblems: number;
  summary: string;
  tasks: RoadmapTask[];
}

export interface DsaProblemSeed {
  problemId: string;
  title: string;
  pattern: string;
  subPattern: string;
  striverStep: string;
  sourceSheet: 'Striver A2Z' | 'NeetCode 150' | 'Striver A2Z + NeetCode 150';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  recommendedMonth: string;
  url: string;
}

export interface CsFundamentalTopic {
  id: string;
  subject: 'Java & OOP' | 'Discrete Maths & Logic' | 'Operating Systems' | 'DBMS' | 'Computer Networks' | 'Aptitude & Puzzles';
  semesterTarget: string;
  title: string;
  keyConcepts: string;
  inClassNote: string;
}

// 1. Seeded Resource Library (verbatim from uploaded CSV + PDFs + Pattern-Organized Striver A2Z Modules)
export const INITIAL_RESOURCES: SeedResource[] = [
  {
    id: 'res_dsa_checklist',
    title: 'DSA Checklist (Google Drive)',
    category: 'Checklist',
    typeFocus: 'Google Drive checklist',
    priority: 'High',
    recommendedUse: 'Review weekly to verify topic coverage and milestone alignment',
    url: 'https://drive.google.com/file/d/1qcbwY3dl2tXPStJsVcoC2baf4qJGHEe2/view?usp=sharing',
    status: 'In progress',
    notes: 'Core master checklist shared in initial resource pack.'
  },
  {
    id: 'res_striver_a2z',
    title: 'Striver A2Z DSA Sheet — Master One-Stop Hub',
    category: 'DSA',
    typeFocus: 'Complete 18-Step Pattern-Based DSA Curriculum',
    priority: 'High',
    recommendedUse: 'Recommended primary DSA sheet — integrated directly into the DSA Tracker by pattern & sub-pattern',
    url: 'https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/',
    status: 'In progress',
    notes: 'All core Striver A2Z patterns are pre-loaded in the DSA Tracker tab.'
  },
  {
    id: 'res_striver_step1_3_arrays',
    title: 'Striver A2Z · Step 1–3: Complexity, Hashing & Array Patterns',
    category: 'Patterns',
    typeFocus: 'Two Pointers, Kadane, Prefix Sum + HashMap, Dutch National Flag, Matrix Traversal',
    priority: 'High',
    recommendedUse: 'Complete in Months 1–2 alongside Java Collections',
    url: 'https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/',
    status: 'In progress',
    notes: 'Covers Largest Element, Rotate Array, 2Sum, 3Sum, 4Sum, Kadane Max Subarray, Next Permutation, Merge Overlapping Subintervals.'
  },
  {
    id: 'res_striver_step4_bs',
    title: 'Striver A2Z · Step 4: Binary Search Patterns (1D, 2D & Search Space)',
    category: 'Patterns',
    typeFocus: 'Lower/Upper Bound, Rotated Sorted Array, Binary Search on Answer (Min-Max / Max-Min)',
    priority: 'High',
    recommendedUse: 'Complete in Month 3 — focus heavily on Binary Search on Answer (Koko, Aggressive Cows, Book Allocation)',
    url: 'https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/',
    status: 'Not started',
    notes: 'Includes 1D Arrays, Search on Answer Space, and 2D Matrix Binary Search.'
  },
  {
    id: 'res_striver_step5_10_strings_sw',
    title: 'Striver A2Z · Step 5 & 10: Two Pointers & Sliding Window Patterns',
    category: 'Patterns',
    typeFocus: 'Fixed Window, Dynamic Window, Count Subarrays with Exact K (atMost(K) - atMost(K-1))',
    priority: 'High',
    recommendedUse: 'Complete in Month 3 — write reusable template for variable window + frequency map',
    url: 'https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/',
    status: 'Not started',
    notes: 'Covers Longest Repeating Character Replacement, Max Consecutive Ones III, Subarrays with K Different Integers, Minimum Window Substring.'
  },
  {
    id: 'res_striver_step6_9_ll_stack',
    title: 'Striver A2Z · Step 6 & 9: Linked List & Monotonic Stack / Queue Patterns',
    category: 'Patterns',
    typeFocus: 'Fast & Slow Pointers, In-Place Reversal, Next Greater/Smaller Element, LRU/LFU Cache',
    priority: 'High',
    recommendedUse: 'Complete in Month 4 — draw pointer re-wiring and stack state transitions on paper',
    url: 'https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/',
    status: 'Not started',
    notes: 'Covers Tortoise & Hare cycle detection, Reverse in K-Group, Trapping Rain Water, Sum of Subarray Minimums, Asteroid Collision, Largest Rectangle in Histogram.'
  },
  {
    id: 'res_striver_step7_13_14_trees_bt',
    title: 'Striver A2Z · Step 7, 13 & 14: Recursion, Backtracking, Binary Trees & BST',
    category: 'Patterns',
    typeFocus: 'Pick / Not-Pick Subsequences, Tree Traversals, Views, LCA, Path Sums & BST Bounds',
    priority: 'High',
    recommendedUse: 'Complete in Month 5 — master recursive state passing and tree height/diameter templates',
    url: 'https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/',
    status: 'Not started',
    notes: 'Covers Combination Sum, N-Queens, M-Coloring, Boundary/Vertical Traversal, Max Path Sum, Burn Tree, Serialize/Deserialize, BST Iterator.'
  },
  {
    id: 'res_striver_step11_12_heaps_greedy',
    title: 'Striver A2Z · Step 11 & 12: Heaps / Priority Queue & Greedy Interval Patterns',
    category: 'Patterns',
    typeFocus: 'Top-K Elements, Merge K Sorted Lists, Two-Heap Median Stream, Interval Scheduling',
    priority: 'High',
    recommendedUse: 'Complete in Sem 2 (Months 7–8) — master Java PriorityQueue & custom Comparators',
    url: 'https://takeuforward.org/data-structures-and-algorithms/strivers-a2z-dsa-course/',
    status: 'Not started',
    notes: 'Covers Task Scheduler, Hand of Straights, Median from Data Stream, N Meetings in One Room, Minimum Platforms, Candy.'
  },
  {
    id: 'res_striver_step15_graphs',
    title: 'Striver A2Z · Step 15: Graph Patterns (BFS/DFS, Topo Sort, Shortest Path & DSU)',
    category: 'Patterns',
    typeFocus: 'Multi-Source BFS, Kahn Topo Sort, Dijkstra, Bellman-Ford, Floyd-Warshall, Disjoint Set Union',
    priority: 'High',
    recommendedUse: 'Complete in Sem 2 (Months 9–10) — build a reusable Java DisjointSet template',
    url: 'https://takeuforward.org/graph/striver-graph-series-top-graph-interview-questions/',
    status: 'Not started',
    notes: 'Covers Rotting Oranges, Word Ladder, Alien Dictionary, Cheapest Flights Within K Stops, Number of Provinces, Accounts Merge, Bridges in Graph (Tarjan).'
  },
  {
    id: 'res_striver_step16_dp',
    title: 'Striver A2Z · Step 16: Dynamic Programming (7 Core Sub-Patterns)',
    category: 'Patterns',
    typeFocus: '1D DP, 2D Grid DP, Subsequences/Knapsack, Strings DP, Stock DP, LIS DP, MCM/Partition DP',
    priority: 'High',
    recommendedUse: 'Complete in Sem 2 (Months 11–12) — always progress: Recursion → Memoization → Tabulation → Space Optimization',
    url: 'https://takeuforward.org/dynamic-programming/striver-dp-series-dynamic-programming-problems/',
    status: 'Not started',
    notes: 'Master all 7 Striver DP sub-patterns for Google & FAANG interviews.'
  },
  {
    id: 'res_mooc_java',
    title: 'MOOC.fi Java Programming (University of Helsinki)',
    category: 'Java',
    typeFocus: 'Structured Java course and hands-on exercises',
    priority: 'High',
    recommendedUse: 'Recommended main Java resource — complete alongside Month 1 & 2',
    url: 'https://java-programming.mooc.fi/',
    status: 'In progress',
    notes: 'Primary interactive exercise platform for solid Java syntax & OOP.'
  },
  {
    id: 'res_abdul_bari_java',
    title: 'Java Programming — Beginner to Master (Abdul Bari / Udemy)',
    category: 'Java',
    typeFocus: 'Comprehensive Java course (Main Programming Language)',
    priority: 'High',
    recommendedUse: 'Complete before Sem-1 ends (Month 1–2 checkpoint)',
    url: 'https://www.udemy.com/course/java-se-programming/',
    status: 'In progress',
    notes: 'Prescribed in both Roadmap PDFs: Finish the Abdul Bari course by Month 2.'
  },
  {
    id: 'res_neetcode_150',
    title: 'NeetCode 150 (Java Roadmap Edition)',
    category: 'DSA',
    typeFocus: 'Primary 150-problem pattern curriculum for Sem 1',
    priority: 'High',
    recommendedUse: 'Primary DSA problem set for Months 1–6 alongside Striver A2Z',
    url: 'https://neetcode.io/practice',
    status: 'In progress',
    notes: 'Combined with Striver A2Z in the built-in DSA Tracker.'
  },
  {
    id: 'res_codolio_tracker',
    title: 'Codolio Question Tracker',
    category: 'Tracking',
    typeFocus: 'All-rounder solved-question tracker',
    priority: 'High',
    recommendedUse: 'Use as the main external profile & contest progress tracker alongside this hub',
    url: 'https://codolio.com/question-tracker',
    status: 'In progress',
    notes: 'Highlighted in DSA-RESOURCES PDF as All-Rounder Tracker.'
  },
  {
    id: 'res_git_branching',
    title: 'Learn Git Branching + Pro Git (Ch. 1 to 3)',
    category: 'Git & Shell',
    typeFocus: 'Interactive Git visualization & foundational chapters',
    priority: 'High',
    recommendedUse: 'Complete during Month 2 Git Week; push every Java program to GitHub',
    url: 'https://learngitbranching.js.org/',
    status: 'Not started',
    notes: 'Pair with https://git-scm.com/book/en/v2 Chapters 1–3.'
  },
  {
    id: 'res_mit_missing_semester',
    title: 'MIT Missing Semester (Shell Tools & Terminal)',
    category: 'Git & Shell',
    typeFocus: 'Shell commands, file management & terminal fluency',
    priority: 'High',
    recommendedUse: 'Complete 1-week Shell Basics block in Month 3 at your own pace',
    url: 'https://missing.csail.mit.edu/',
    status: 'Not started',
    notes: 'Covers shell commands, piping, and file management from the terminal.'
  },
  {
    id: 'res_scrimba_html_css',
    title: 'Learn HTML and CSS: Free Hands-On Tutorial (Scrimba)',
    category: 'Web Dev',
    typeFocus: 'Frontend fundamentals for Portfolio Site (not full-stack yet)',
    priority: 'High',
    recommendedUse: 'Complete 2-week block in Month 4 to build Project 2 (GitHub Pages portfolio)',
    url: 'https://scrimba.com/learn/htmlandcss',
    status: 'Not started',
    notes: 'Prescribed in ROADMAP-f4 PDF for Web Dev basics.'
  },
  {
    id: 'res_indiabix_aptitude',
    title: 'IndiaBix Quantitative & Logical Aptitude',
    category: 'Aptitude',
    typeFocus: 'Daily 15-minute aptitude & placement reasoning drills',
    priority: 'High',
    recommendedUse: '15 min, 4 days a week (or cover during college class hours) + 1 paper puzzle/week',
    url: 'https://www.indiabix.com/',
    status: 'In progress',
    notes: 'Consistent low-stress habit so aptitude requires zero cramming in 2nd/3rd year.'
  },
  {
    id: 'res_codecademy_java',
    title: 'Codecademy — Learn Java',
    category: 'Java',
    typeFocus: 'Interactive browser-based Java course',
    priority: 'Optional',
    recommendedUse: 'Use for quick interactive syntax practice if preferred',
    url: 'https://www.codecademy.com/enrolled/courses/learn-java',
    status: 'Not started',
    notes: 'Optional supplement; do not duplicate if already progressing smoothly on MOOC.fi + Abdul Bari.'
  },
  {
    id: 'res_algomonster',
    title: 'AlgoMonster (Pattern-Based Problem Solving)',
    category: 'DSA',
    typeFocus: 'Structured templates & visual pattern explanations',
    priority: 'Reference',
    recommendedUse: 'Use for pattern explanations and templates when stuck after 30 minutes',
    url: 'https://algo.monster/',
    status: 'Reference',
    notes: 'Great for writing your 1 short written note per DSA pattern.'
  },
  {
    id: 'res_sean_prashad',
    title: "Sean Prashad's LeetCode Patterns",
    category: 'Patterns',
    typeFocus: 'Company & pattern-tagged problem list',
    priority: 'Reference',
    recommendedUse: 'Use as a pattern lookup reference, not a second mandatory sheet',
    url: 'https://seanprashad.com/leetcode-patterns/',
    status: 'Reference',
    notes: 'Helpful in Sem 2–4 when targeting specific pattern gaps.'
  },
  {
    id: 'res_tech_interview_handbook',
    title: 'Tech Interview Handbook',
    category: 'Handbook',
    typeFocus: 'End-to-end FAANG interview preparation guide & resume rules',
    priority: 'Reference',
    recommendedUse: 'Use in Month 6 for One-Page Resume v1, mock interviews, and behavioral prep',
    url: 'https://www.techinterviewhandbook.org/',
    status: 'Reference',
    notes: 'Created by Yangshun Tay (Meta Staff Engineer).'
  },
  {
    id: 'res_interviewbit',
    title: 'InterviewBit Coding Interview Questions (OG Website)',
    category: 'DSA',
    typeFocus: 'Timed interview problem reference',
    priority: 'Reference',
    recommendedUse: 'Use for extra timed interview practice when needed in Sem 2–4',
    url: 'https://www.interviewbit.com/coding-interview-questions/',
    status: 'Reference',
    notes: 'Classic interview-focused problem progression.'
  },
  {
    id: 'res_rising_brain',
    title: 'Rising Brain DSA Sheet',
    category: 'DSA',
    typeFocus: 'Pattern-based DSA practice',
    priority: 'Parked',
    recommendedUse: 'Parked until Month 6 — avoid duplicating the main sheet during Sem 1',
    url: 'https://www.risingbrain.org/sheet',
    status: 'Not started',
    notes: 'Parked per Quality over Quantity rule.'
  },
  {
    id: 'res_apna_college',
    title: 'Apna College DSA Sheet',
    category: 'DSA',
    typeFocus: 'Curated DSA problems',
    priority: 'Parked',
    recommendedUse: 'Parked until Month 6 — alternative practice list',
    url: 'https://dsa.apnacollege.in/sheet/dsa-sheet',
    status: 'Not started',
    notes: 'Parked until Month 6 consolidation is complete.'
  }
];

// 2. Weekly Routine & Core Operating Rules (from First-Year Roadmap PDF)
export const WEEKLY_ROUTINE_ITEMS = [
  {
    id: 'routine_mon_fri',
    dayLabel: 'Mon – Fri',
    title: '1 hr Learn + 45 min Problems + 15 min Aptitude',
    detail: '2 hours weekday baseline (cover Aptitude & CS Fundamentals during class hours when possible)'
  },
  {
    id: 'routine_sat',
    dayLabel: 'Saturday',
    title: '3 hr DSA (1 Pattern, 3–4 Problems) + 2 hr Java / Project',
    detail: 'Deep weekend block focused on pattern mastery and building GitHub projects'
  },
  {
    id: 'routine_sun',
    dayLabel: 'Sunday',
    title: 'Re-solve Last Week’s Problems + Explain 2 Aloud + Plan Next Week',
    detail: 'Consolidation day: record 1 spoken explanation and clear 7-day review queue'
  },
  {
    id: 'routine_rule_30m',
    dayLabel: 'Golden Rule',
    title: 'Try 25–30 Min Alone → Take Hint → Re-solve Cold After 7 Days',
    detail: 'Quality over Quantity: never read editorials immediately; log every problem for 7-day spaced repetition'
  },
  {
    id: 'routine_spoken',
    dayLabel: 'Communication',
    title: '2-Min Spoken Explanation After Each Problem + 1 Pattern Note',
    detail: 'Practice thinking aloud clearly as required in Google / FAANG technical interviews'
  }
];

// 3. Complete 4-Semester Roadmap (Sem 1 verbatim from Oct 2026 - Apr 2027 PDF + Sem 2-4 FAANG Path)
export const FOUR_SEMESTER_ROADMAP: RoadmapPhase[] = [
  {
    id: 'sem1_m1',
    semester: 1,
    semesterLabel: 'Sem 1 · Foundation (Oct 2026 – Apr 2027)',
    monthLabel: 'Month 1',
    windowLabel: 'Oct 19 – Nov 19, 2026',
    title: 'Java Basics, OOP & First 15 Array Problems',
    targetProblems: 15,
    summary: 'Validate baseline Java fluency, set up GitHub habit, master OOP & Big-O basics, and complete 15 easy array problems.',
    tasks: [
      { id: 's1_m1_t1', title: 'Week 1 Java Check: FizzBuzz, reverse an array, class with constructor', detail: 'Decides whether Month 1 Java syntax can be accelerated', tag: 'Diagnostic' },
      { id: 's1_m1_t2', title: 'Create GitHub account & push every single Java program', detail: 'Build daily green-square commit habit from Day 1', tag: 'Git & Portfolio' },
      { id: 's1_m1_t3', title: 'Java Fundamentals: syntax, loops, methods, arrays, strings', detail: 'Via Abdul Bari Udemy + MOOC.fi Part 1', tag: 'Java' },
      { id: 's1_m1_t4', title: 'Java OOP: classes, inheritance, interfaces, polymorphism', detail: 'Write clean modular classes with constructors and interfaces', tag: 'Java OOP' },
      { id: 's1_m1_t5', title: 'Master Big-O Time & Space Complexity basics', detail: 'Analyze every solution before and after coding', tag: 'DSA Theory' },
      { id: 's1_m1_t6', title: 'Solve 15 Easy Array problems (Striver Step 3.1 + NeetCode 150, in Java)', detail: 'Apply 25–30 min solo attempt rule + 2-min spoken explanation', tag: 'DSA Practice' },
      { id: 's1_m1_t7', title: 'Checkpoint: ~15 DSA Problems Solved & Re-Solvable', detail: 'End of Month 1 verification milestone', tag: 'Checkpoint', isCheckpoint: true }
    ]
  },
  {
    id: 'sem1_m2',
    semester: 1,
    semesterLabel: 'Sem 1 · Foundation (Oct 2026 – Apr 2027)',
    monthLabel: 'Month 2',
    windowLabel: 'Nov 19 – Dec 19, 2026',
    title: 'Java Collections, Arrays, Hashing & Git Workflow',
    targetProblems: 45,
    summary: 'Master Java Collections Framework, finish the Abdul Bari Java course, complete Git week, and start Project 1.',
    tasks: [
      { id: 's1_m2_t1', title: 'Java Collections & Core: exceptions, ArrayList, HashMap, HashSet, StringBuilder, file I/O', detail: 'Know internal time complexities of HashMap & ArrayList operations', tag: 'Java Collections' },
      { id: 's1_m2_t2', title: 'Finish the Abdul Bari Java Course', detail: 'Complete core language curriculum before Sem-1 exams', tag: 'Java Milestone' },
      { id: 's1_m2_t3', title: 'DSA: Striver Step 3.2/3.3 Arrays Medium/Hard & Strings (30 more problems)', detail: 'Write pattern notes for frequency maps, Kadane, Dutch Flag, prefix XOR/sum', tag: 'DSA Practice' },
      { id: 's1_m2_t4', title: 'Git Week: Learn Git Branching + Pro Git Chapters 1 to 3', detail: 'Practice branching, merging, rebasing, and clean commit messages', tag: 'Tools' },
      { id: 's1_m2_t5', title: 'Start Project 1 (Java Console Application)', detail: 'Design full architecture & data flow using OOP and file I/O', tag: 'Project 1' },
      { id: 's1_m2_t6', title: 'Checkpoint: ~45 Problems Solved & Java Course Done', detail: 'End of Month 2 verification milestone', tag: 'Checkpoint', isCheckpoint: true }
    ]
  },
  {
    id: 'sem1_m3',
    semester: 1,
    semesterLabel: 'Sem 1 · Foundation (Oct 2026 – Apr 2027)',
    monthLabel: 'Month 3',
    windowLabel: 'Dec 19, 2026 – Jan 19, 2027',
    title: 'Two Pointers, Sliding Window, Binary Search & Project 1 Ship',
    targetProblems: 80,
    summary: 'Master core linear & logarithmic search patterns, ship Project 1 on GitHub, learn Shell basics, and try a virtual contest.',
    tasks: [
      { id: 's1_m3_t1', title: 'DSA: Striver Step 4 (Binary Search) & Step 10 (Sliding Window / Two Pointers) (35 more problems)', detail: 'Document fixed vs dynamic window and Binary Search on Answer templates', tag: 'DSA Practice' },
      { id: 's1_m3_t2', title: 'Finish Project 1 + Polished README on GitHub', detail: 'Include architecture diagram, setup instructions, and full project flow', tag: 'Project 1' },
      { id: 's1_m3_t3', title: 'Shell Basics (1 Week — MIT Missing Semester)', detail: 'Master terminal navigation, grep, find, permissions, and pipes', tag: 'Tools' },
      { id: 's1_m3_t4', title: 'Complete 1 Practice LeetCode Contest (Virtual, No Pressure)', detail: 'Experience timed environment and post-contest upsolving', tag: 'Contest' },
      { id: 's1_m3_t5', title: 'Checkpoint: ~80 Problems Solved & Project 1 Live on GitHub', detail: 'End of Month 3 verification milestone', tag: 'Checkpoint', isCheckpoint: true }
    ]
  },
  {
    id: 'sem1_m4',
    semester: 1,
    semesterLabel: 'Sem 1 · Foundation (Oct 2026 – Apr 2027)',
    monthLabel: 'Month 4',
    windowLabel: 'Jan 19 – Feb 19, 2027',
    title: 'Stack, Queue, Linked List, Recursion & First Live Contest',
    targetProblems: 105,
    summary: 'Cross the 100-problem threshold, enter live LeetCode weekly contests, and learn HTML/CSS for your portfolio.',
    tasks: [
      { id: 's1_m4_t1', title: 'DSA: Striver Step 6 (Linked List) & Step 9 (Monotonic Stack / Queue) (25 more problems)', detail: 'Master fast/slow pointers, list reversal, NGE/NSE, and call-stack visualization', tag: 'DSA Practice' },
      { id: 's1_m4_t2', title: 'First Live LeetCode Weekly Contest (Aim Q1, Try Q2)', detail: 'Build composure under live timer conditions; always upsolve after', tag: 'Contest' },
      { id: 's1_m4_t3', title: 'HTML + CSS on Scrimba (2 Weeks Hands-On Tutorial)', detail: 'Learn semantic layout, Flexbox, Grid, and responsive styling', tag: 'Web Dev' },
      { id: 's1_m4_t4', title: 'Checkpoint: 100+ Problems Solved & Live Contest Debut', detail: 'End of Month 4 verification milestone', tag: 'Checkpoint', isCheckpoint: true }
    ]
  },
  {
    id: 'sem1_m5',
    semester: 1,
    semesterLabel: 'Sem 1 · Foundation (Oct 2026 – Apr 2027)',
    monthLabel: 'Month 5',
    windowLabel: 'Feb 19 – Mar 19, 2027',
    title: 'Trees, DFS/BFS, Simple Backtracking & Portfolio Site',
    targetProblems: 130,
    summary: 'Master hierarchical data structures and recursion trees while launching Project 2 on GitHub Pages.',
    tasks: [
      { id: 's1_m5_t1', title: 'DSA: Striver Step 7 (Backtracking) & Step 13–14 (Binary Trees & BST) (25 more problems)', detail: 'Master recursion state passing, level-order BFS, LCA, and subset/permutation trees', tag: 'DSA Practice' },
      { id: 's1_m5_t2', title: 'Build & Deploy Project 2: Developer Portfolio Site on GitHub Pages', detail: 'Showcase Project 1, GitHub links, and technical writeups', tag: 'Project 2' },
      { id: 's1_m5_t3', title: 'Participate in 1 Live LeetCode Contest Every 2 Weeks', detail: 'Consistently solve Q1+Q2 and attempt Q3', tag: 'Contest' },
      { id: 's1_m5_t4', title: 'Checkpoint: ~130 Problems Solved & Project 2 Live', detail: 'End of Month 5 verification milestone', tag: 'Checkpoint', isCheckpoint: true }
    ]
  },
  {
    id: 'sem1_m6',
    semester: 1,
    semesterLabel: 'Sem 1 · Foundation (Oct 2026 – Apr 2027)',
    monthLabel: 'Month 6',
    windowLabel: 'Mar 19 – Apr 19, 2027',
    title: 'Consolidate: 30 Cold Re-Solves, Mock Interviews & Resume v1',
    targetProblems: 150,
    summary: 'Prove true retention by re-solving 30 older problems cold, completing 2 live 45-min mock interviews, and drafting Resume v1.',
    tasks: [
      { id: 's1_m6_t1', title: 'Re-solve 30 Old Problems Cold (Zero Hints, Full Speed)', detail: 'Verify long-term retention across Arrays, Sliding Window, Binary Search, Lists, and Trees', tag: 'Revision' },
      { id: 's1_m6_t2', title: 'Complete 2 Mock Interviews (45 Min Each, Thinking Aloud)', detail: 'Conducted with mentor/brother: clarify constraints, propose brute force -> optimal, dry run', tag: 'Mock Interview' },
      { id: 's1_m6_t3', title: 'Draft One-Page FAANG-Format Resume v1', detail: 'Single-column clean layout highlighting Java, 150 DSA problems, and 2 shipped GitHub projects', tag: 'Career' },
      { id: 's1_m6_t4', title: 'Lock in Next 6-Month Plan (DP, Graphs, OS, DBMS)', detail: 'Transition from Foundation phase into Sem 2 Advanced DSA & CS Core', tag: 'Planning' },
      { id: 's1_m6_t5', title: 'Checkpoint: 150 Problems, 2 Projects, 6+ Contests Completed', detail: 'Sem 1 Foundation Complete!', tag: 'Checkpoint', isCheckpoint: true }
    ]
  },
  {
    id: 'sem2_m7_8',
    semester: 2,
    semesterLabel: 'Sem 2 · Advanced DSA & Core CS (May 2027 – Oct 2027)',
    monthLabel: 'Months 7–8',
    windowLabel: 'May – Jun 2027',
    title: 'Heaps, Tries, Backtracking Depth & DBMS Fundamentals',
    targetProblems: 185,
    summary: 'Conquer Priority Queues, Trie prefix trees, full Backtracking patterns, and Relational Database internals.',
    tasks: [
      { id: 's2_m7_t1', title: 'DSA: Striver Step 11 Heaps / Priority Queue & Top-K / Two-Heap Patterns (20 problems)', detail: 'Master PriorityQueue in Java, custom Comparators, and median stream patterns', tag: 'DSA Practice' },
      { id: 's2_m7_t2', title: 'DSA: Striver Step 17 Tries & Advanced Backtracking (15 problems)', detail: 'Word search, prefix trees, Max XOR, N-Queens, combination sum variations', tag: 'DSA Practice' },
      { id: 's2_m7_t3', title: 'CS Core — DBMS: ER Models, SQL Joins, Indexing (B+ Trees), Normalization & ACID', detail: 'Write complex SQL queries and understand transaction isolation levels', tag: 'CS Fundamentals' },
      { id: 's2_m7_t4', title: 'Checkpoint: 185+ Problems & DBMS Core Completed', detail: 'Mid-Sem 2 verification milestone', tag: 'Checkpoint', isCheckpoint: true }
    ]
  },
  {
    id: 'sem2_m9_10',
    semester: 2,
    semesterLabel: 'Sem 2 · Advanced DSA & Core CS (May 2027 – Oct 2027)',
    monthLabel: 'Months 9–10',
    windowLabel: 'Jul – Aug 2027',
    title: 'Graphs Mastery (Striver Step 15) & Operating Systems',
    targetProblems: 225,
    summary: 'Master Graph algorithms from Striver A2Z + NeetCode 150 alongside Operating Systems concepts.',
    tasks: [
      { id: 's2_m9_t1', title: 'DSA: Striver Step 15.1–15.3 Graph Traversals, Cycle Detection & Topo Sort (25 problems)', detail: 'Kahn’s algorithm, DFS coloring, bipartite graphs, course schedule patterns', tag: 'Graphs' },
      { id: 's2_m9_t2', title: 'DSA: Striver Step 15.4–15.5 Shortest Paths & MST — Dijkstra, Bellman-Ford, DSU (15 problems)', detail: 'Build reusable UnionFind class in Java with path compression and rank', tag: 'Advanced Graphs' },
      { id: 's2_m9_t3', title: 'CS Core — Operating Systems: Processes, Threads, CPU Scheduling, Deadlocks & Virtual Memory', detail: 'Cover during college classes + concise revision notes for technical interviews', tag: 'CS Fundamentals' },
      { id: 's2_m9_t4', title: 'Checkpoint: 225+ Problems & Graph Mastery Verified', detail: 'Graph module completion checkpoint', tag: 'Checkpoint', isCheckpoint: true }
    ]
  },
  {
    id: 'sem2_m11_12',
    semester: 2,
    semesterLabel: 'Sem 2 · Advanced DSA & Core CS (May 2027 – Oct 2027)',
    monthLabel: 'Months 11–12',
    windowLabel: 'Sep – Oct 2027',
    title: 'Striver Step 16 Dynamic Programming + Backend Project 3',
    targetProblems: 270,
    summary: 'Demystify Dynamic Programming (Recursion -> Memoization -> Tabulation -> Space Optimization) and ship Project 3.',
    tasks: [
      { id: 's2_m11_t1', title: 'DSA: Striver Step 16.1–16.4 (1D DP, 2D Grid DP, Subsequences/Knapsack) (25 problems)', detail: 'Always derive recurrence relation on paper before coding', tag: 'DP' },
      { id: 's2_m11_t2', title: 'DSA: Striver Step 16.5–16.8 (Strings DP, Stock DP, LIS & MCM Partition DP) (20 problems)', detail: 'Complete NeetCode 150 + Striver DP core patterns', tag: 'DP' },
      { id: 's2_m11_t3', title: 'Build & Deploy Project 3: Java Spring Boot / REST API + Database Application', detail: 'End-to-end backend project demonstrating SQL, authentication, and clean architecture', tag: 'Project 3' },
      { id: 's2_m11_t4', title: 'Checkpoint: End of Year 1 — NeetCode 150 + Striver A2Z Core Mastered + 3 Projects', detail: 'First Full Year Complete!', tag: 'Checkpoint', isCheckpoint: true }
    ]
  },
  {
    id: 'sem3_m13_15',
    semester: 3,
    semesterLabel: 'Sem 3 · Computer Networks, LLD & Contests (Nov 2027 – Apr 2028)',
    monthLabel: 'Months 13–15',
    windowLabel: 'Nov 2027 – Jan 2028',
    title: 'Greedy, Intervals, Bit Manipulation & Computer Networks',
    targetProblems: 320,
    summary: 'Finish all remaining algorithmic paradigms and master Computer Networks & Low-Level Object-Oriented Design.',
    tasks: [
      { id: 's3_m13_t1', title: 'DSA: Striver Step 8 (Bit Manipulation) & Step 12 (Greedy & Intervals) (50 problems)', detail: 'Sweep-line intervals, XOR properties, bitmasks, and greedy exchange proofs', tag: 'DSA Practice' },
      { id: 's3_m13_t2', title: 'CS Core — Computer Networks: OSI/TCP-IP, DNS, HTTP/HTTPS, TLS, Sockets & Congestion Control', detail: 'Understand exactly what happens when you type google.com in a browser', tag: 'CS Fundamentals' },
      { id: 's3_m13_t3', title: 'Low-Level Design (LLD): SOLID Principles, Design Patterns & Classic Machine Coding Problems', detail: 'Practice Parking Lot, LRU Cache, Rate Limiter, and Splitwise in Java', tag: 'LLD' },
      { id: 's3_m13_t4', title: 'Checkpoint: 320+ Problems + CN & LLD Foundations', detail: 'Mid-Sem 3 milestone', tag: 'Checkpoint', isCheckpoint: true }
    ]
  },
  {
    id: 'sem3_m16_18',
    semester: 3,
    semesterLabel: 'Sem 3 · Computer Networks, LLD & Contests (Nov 2027 – Apr 2028)',
    monthLabel: 'Months 16–18',
    windowLabel: 'Feb – Apr 2028',
    title: 'Striver A2Z Hard Problems, Contest Rating Push & Open-Source / Capstone',
    targetProblems: 375,
    summary: 'Solve Consistently 3/4 in Weekly Contests, complete advanced Striver topics (Segment Trees/String Algos), and polish Capstone.',
    tasks: [
      { id: 's3_m16_t1', title: 'Advanced DSA: Striver Step 18 Strings (KMP/Rabin-Karp/Z-Algo) & Segment Tree Basics (35 problems)', detail: 'Targeted preparation for Google & Rubrik high-bar OA questions', tag: 'Advanced DSA' },
      { id: 's3_m16_t2', title: 'Weekly LeetCode Contest Streak (Target 1750–1850+ Rating)', detail: 'Simulate OA speed and edge-case precision every weekend', tag: 'Contest' },
      { id: 's3_m16_t3', title: 'Complete 4 Timed Mock Interviews with Mentor', detail: 'Focus on optimal communication, complexity trade-offs, and bug-free Java code', tag: 'Mock Interview' },
      { id: 's3_m16_t4', title: 'Checkpoint: 375+ Problems, High Contest Readiness & Production Portfolio', detail: 'End of Sem 3 milestone', tag: 'Checkpoint', isCheckpoint: true }
    ]
  },
  {
    id: 'sem4_m19_24',
    semester: 4,
    semesterLabel: 'Sem 4 · FAANG Internship & Interview Sprint (May 2028 – Oct 2028)',
    monthLabel: 'Months 19–24',
    windowLabel: 'May – Oct 2028',
    title: 'FAANG Company-Tagged Sprint, System Design Basics & Internship Conversion',
    targetProblems: 450,
    summary: 'Peak interview readiness by 2nd Year: cold re-solve mastery, Google/FAANG tagged sprints, behavioral STAR stories, and applications.',
    tasks: [
      { id: 's4_m19_t1', title: 'Company-Tagged Sprint: 75 High-Frequency Google, Amazon & Meta Problems', detail: 'Timed 40-minute solves in a plain doc/IDE without autocomplete', tag: 'FAANG Sprint' },
      { id: 's4_m19_t2', title: 'System Design Essentials: Caching, Load Balancing, Sharding, Queues & CAP Theorem', detail: 'High-level architecture literacy for 2nd/3rd year interviews', tag: 'System Design' },
      { id: 's4_m19_t3', title: 'Behavioral & Leadership Matrix (STAR Format Stories for Each Project)', detail: 'Prepare clear stories on technical challenges, debugging, and teamwork', tag: 'Behavioral' },
      { id: 's4_m19_t4', title: 'Resume v2 Final Audit, Referrals & SWE / STEP Internship Applications', detail: 'Apply early with tailored referrals and cold-resolved DSA sharpness', tag: 'Career' },
      { id: 's4_m19_t5', title: 'Final 2nd-Year FAANG Readiness Checkpoint: 450+ Problems, 90%+ Cold Re-Solve Rate', detail: 'Complete 2-Year FAANG Mastery Achieved!', tag: 'Checkpoint', isCheckpoint: true }
    ]
  }
];

// 4. Pattern-Organized Striver A2Z + NeetCode 150 Problem Bank
export const CURATED_DSA_PROBLEMS: DsaProblemSeed[] = [
  // ============================================================================
  // PATTERN 1: ARRAYS & HASHING (Striver Step 3.1, 3.2, 3.3 + NeetCode)
  // ============================================================================
  {
    problemId: 'check-array-sorted-rotated',
    title: 'Check if Array Is Sorted and Rotated',
    pattern: 'Arrays & Hashing',
    subPattern: '1.1 Array Traversal & Invariants',
    striverStep: 'Step 3.1 · Arrays Easy',
    sourceSheet: 'Striver A2Z',
    difficulty: 'Easy',
    recommendedMonth: 'Month 1',
    url: 'https://leetcode.com/problems/check-if-array-is-sorted-and-rotated/'
  },
  {
    problemId: 'rotate-array-k',
    title: 'Rotate Array by K Places (Reversal Algorithm)',
    pattern: 'Arrays & Hashing',
    subPattern: '1.1 Array Traversal & Invariants',
    striverStep: 'Step 3.1 · Arrays Easy',
    sourceSheet: 'Striver A2Z',
    difficulty: 'Medium',
    recommendedMonth: 'Month 1',
    url: 'https://leetcode.com/problems/rotate-array/'
  },
  {
    problemId: 'single-number-xor',
    title: 'Single Number (Appears Once vs Twice)',
    pattern: 'Arrays & Hashing',
    subPattern: '1.1 Array Traversal & Invariants',
    striverStep: 'Step 3.1 · Arrays Easy',
    sourceSheet: 'Striver A2Z + NeetCode 150',
    difficulty: 'Easy',
    recommendedMonth: 'Month 1',
    url: 'https://leetcode.com/problems/single-number/'
  },
  {
    problemId: 'contains-duplicate',
    title: 'Contains Duplicate',
    pattern: 'Arrays & Hashing',
    subPattern: '1.2 HashSet & Frequency Maps',
    striverStep: 'Step 1.6 · Basic Hashing',
    sourceSheet: 'Striver A2Z + NeetCode 150',
    difficulty: 'Easy',
    recommendedMonth: 'Month 1',
    url: 'https://leetcode.com/problems/contains-duplicate/'
  },
  {
    problemId: 'valid-anagram',
    title: 'Valid Anagram',
    pattern: 'Arrays & Hashing',
    subPattern: '1.2 HashSet & Frequency Maps',
    striverStep: 'Step 5.1 · Strings & Hashing',
    sourceSheet: 'Striver A2Z + NeetCode 150',
    difficulty: 'Easy',
    recommendedMonth: 'Month 1',
    url: 'https://leetcode.com/problems/valid-anagram/'
  },
  {
    problemId: 'two-sum',
    title: 'Two Sum',
    pattern: 'Arrays & Hashing',
    subPattern: '1.2 HashSet & Frequency Maps',
    striverStep: 'Step 3.2 · Arrays Medium',
    sourceSheet: 'Striver A2Z + NeetCode 150',
    difficulty: 'Easy',
    recommendedMonth: 'Month 1',
    url: 'https://leetcode.com/problems/two-sum/'
  },
  {
    problemId: 'group-anagrams',
    title: 'Group Anagrams',
    pattern: 'Arrays & Hashing',
    subPattern: '1.2 HashSet & Frequency Maps',
    striverStep: 'Step 5.2 · Strings & Hashing',
    sourceSheet: 'NeetCode 150',
    difficulty: 'Medium',
    recommendedMonth: 'Month 2',
    url: 'https://leetcode.com/problems/group-anagrams/'
  },
  {
    problemId: 'top-k-frequent-elements',
    title: 'Top K Frequent Elements (Bucket Sort / Heap)',
    pattern: 'Arrays & Hashing',
    subPattern: '1.2 HashSet & Frequency Maps',
    striverStep: 'Step 11.2 · Heaps & Hashing',
    sourceSheet: 'Striver A2Z + NeetCode 150',
    difficulty: 'Medium',
    recommendedMonth: 'Month 2',
    url: 'https://leetcode.com/problems/top-k-frequent-elements/'
  },
  {
    problemId: 'majority-element-moore',
    title: 'Majority Element (> N/2 — Boyer-Moore Voting)',
    pattern: 'Arrays & Hashing',
    subPattern: '1.3 Boyer-Moore & Dutch Flag Voting',
    striverStep: 'Step 3.2 · Arrays Medium',
    sourceSheet: 'Striver A2Z',
    difficulty: 'Easy',
    recommendedMonth: 'Month 2',
    url: 'https://leetcode.com/problems/majority-element/'
  },
  {
    problemId: 'majority-element-ii',
    title: 'Majority Element II (> N/3 Extended Boyer-Moore)',
    pattern: 'Arrays & Hashing',
    subPattern: '1.3 Boyer-Moore & Dutch Flag Voting',
    striverStep: 'Step 3.3 · Arrays Hard',
    sourceSheet: 'Striver A2Z',
    difficulty: 'Medium',
    recommendedMonth: 'Month 2',
    url: 'https://leetcode.com/problems/majority-element-ii/'
  },
  {
    problemId: 'sort-colors-dutch-flag',
    title: 'Sort Colors (0s, 1s, 2s — Dutch National Flag)',
    pattern: 'Arrays & Hashing',
    subPattern: '1.3 Boyer-Moore & Dutch Flag Voting',
    striverStep: 'Step 3.2 · Arrays Medium',
    sourceSheet: 'Striver A2Z',
    difficulty: 'Medium',
    recommendedMonth: 'Month 2',
    url: 'https://leetcode.com/problems/sort-colors/'
  },
  {
    problemId: 'subarray-sum-equals-k',
    title: 'Subarray Sum Equals K (Prefix Sum + HashMap)',
    pattern: 'Arrays & Hashing',
    subPattern: '1.4 Prefix Sum / XOR & Subarray Hashing',
    striverStep: 'Step 3.2 · Arrays Medium',
    sourceSheet: 'Striver A2Z + NeetCode 150',
    difficulty: 'Medium',
    recommendedMonth: 'Month 2',
    url: 'https://leetcode.com/problems/subarray-sum-equals-k/'
  },
  {
    problemId: 'product-of-array-except-self',
    title: 'Product of Array Except Self (Prefix & Suffix)',
    pattern: 'Arrays & Hashing',
    subPattern: '1.4 Prefix Sum / XOR & Subarray Hashing',
    striverStep: 'Step 3.2 · Arrays Medium',
    sourceSheet: 'NeetCode 150',
    difficulty: 'Medium',
    recommendedMonth: 'Month 2',
    url: 'https://leetcode.com/problems/product-of-array-except-self/'
  },
  {
    problemId: 'longest-consecutive-sequence',
    title: 'Longest Consecutive Sequence (HashSet Start-of-Run)',
    pattern: 'Arrays & Hashing',
    subPattern: '1.4 Prefix Sum / XOR & Subarray Hashing',
    striverStep: 'Step 3.2 · Arrays Medium',
    sourceSheet: 'Striver A2Z + NeetCode 150',
    difficulty: 'Medium',
    recommendedMonth: 'Month 2',
    url: 'https://leetcode.com/problems/longest-consecutive-sequence/'
  },
  {
    problemId: 'next-permutation',
    title: 'Next Permutation (Break-Point & Suffix Reverse)',
    pattern: 'Arrays & Hashing',
    subPattern: '1.5 Permutations & Matrix Manipulation',
    striverStep: 'Step 3.2 · Arrays Medium',
    sourceSheet: 'Striver A2Z',
    difficulty: 'Medium',
    recommendedMonth: 'Month 2',
    url: 'https://leetcode.com/problems/next-permutation/'
  },
  {
    problemId: 'set-matrix-zeroes',
    title: 'Set Matrix Zeroes (In-Place First Row/Col Markers)',
    pattern: 'Arrays & Hashing',
    subPattern: '1.5 Permutations & Matrix Manipulation',
    striverStep: 'Step 3.2 · Arrays Medium',
    sourceSheet: 'Striver A2Z + NeetCode 150',
    difficulty: 'Medium',
    recommendedMonth: 'Month 2',
    url: 'https://leetcode.com/problems/set-matrix-zeroes/'
  },
  {
    problemId: 'rotate-image-matrix',
    title: 'Rotate Image by 90 Degrees (Transpose + Reverse)',
    pattern: 'Arrays & Hashing',
    subPattern: '1.5 Permutations & Matrix Manipulation',
    striverStep: 'Step 3.2 · Arrays Medium',
    sourceSheet: 'Striver A2Z + NeetCode 150',
    difficulty: 'Medium',
    recommendedMonth: 'Month 2',
    url: 'https://leetcode.com/problems/rotate-image/'
  },
  {
    problemId: 'spiral-matrix',
    title: 'Spiral Matrix (4-Boundary Simulation)',
    pattern: 'Arrays & Hashing',
    subPattern: '1.5 Permutations & Matrix Manipulation',
    striverStep: 'Step 3.2 · Arrays Medium',
    sourceSheet: 'Striver A2Z + NeetCode 150',
    difficulty: 'Medium',
    recommendedMonth: 'Month 2',
    url: 'https://leetcode.com/problems/spiral-matrix/'
  },
  {
    problemId: 'pascals-triangle',
    title: "Pascal's Triangle (nCr Row Generation)",
    pattern: 'Arrays & Hashing',
    subPattern: '1.5 Permutations & Matrix Manipulation',
    striverStep: 'Step 3.3 · Arrays Hard',
    sourceSheet: 'Striver A2Z',
    difficulty: 'Easy',
    recommendedMonth: 'Month 2',
    url: 'https://leetcode.com/problems/pascals-triangle/'
  },
  {
    problemId: 'valid-sudoku',
    title: 'Valid Sudoku',
    pattern: 'Arrays & Hashing',
    subPattern: '1.5 Permutations & Matrix Manipulation',
    striverStep: 'Step 3.2 · Matrix',
    sourceSheet: 'NeetCode 150',
    difficulty: 'Medium',
    recommendedMonth: 'Month 2',
    url: 'https://leetcode.com/problems/valid-sudoku/'
  },

  // ============================================================================
  // PATTERN 2: TWO POINTERS (Striver Step 3.1, 3.3 & Step 10 + NeetCode)
  // ============================================================================
  {
    problemId: 'remove-duplicates-sorted-array',
    title: 'Remove Duplicates from Sorted Array (Slow/Fast In-Place)',
    pattern: 'Two Pointers',
    subPattern: '2.1 In-Place Partition & Compaction',
    striverStep: 'Step 3.1 · Arrays Easy',
    sourceSheet: 'Striver A2Z',
    difficulty: 'Easy',
    recommendedMonth: 'Month 1',
    url: 'https://leetcode.com/problems/remove-duplicates-from-sorted-array/'
  },
  {
    problemId: 'move-zeroes',
    title: 'Move Zeroes to End',
    pattern: 'Two Pointers',
    subPattern: '2.1 In-Place Partition & Compaction',
    striverStep: 'Step 3.1 · Arrays Easy',
    sourceSheet: 'Striver A2Z',
    difficulty: 'Easy',
    recommendedMonth: 'Month 1',
    url: 'https://leetcode.com/problems/move-zeroes/'
  },
  {
    problemId: 'rearrange-array-by-sign',
    title: 'Rearrange Array Elements by Sign',
    pattern: 'Two Pointers',
    subPattern: '2.1 In-Place Partition & Compaction',
    striverStep: 'Step 3.2 · Arrays Medium',
    sourceSheet: 'Striver A2Z',
    difficulty: 'Medium',
    recommendedMonth: 'Month 2',
    url: 'https://leetcode.com/problems/rearrange-array-elements-by-sign/'
  },
  {
    problemId: 'valid-palindrome',
    title: 'Valid Palindrome',
    pattern: 'Two Pointers',
    subPattern: '2.2 Converging Opposite Ends',
    striverStep: 'Step 1.5 · Basic Recursion & Two Pointers',
    sourceSheet: 'Striver A2Z + NeetCode 150',
    difficulty: 'Easy',
    recommendedMonth: 'Month 3',
    url: 'https://leetcode.com/problems/valid-palindrome/'
  },
  {
    problemId: 'two-sum-ii',
    title: 'Two Sum II - Input Array Is Sorted',
    pattern: 'Two Pointers',
    subPattern: '2.2 Converging Opposite Ends',
    striverStep: 'Step 3.2 · Arrays Medium',
    sourceSheet: 'Striver A2Z + NeetCode 150',
    difficulty: 'Medium',
    recommendedMonth: 'Month 3',
    url: 'https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/'
  },
  {
    problemId: '3sum',
    title: '3Sum (Sort + Two Pointers Duplicate Skip)',
    pattern: 'Two Pointers',
    subPattern: '2.3 K-Sum & Duplicate Skipping',
    striverStep: 'Step 3.3 · Arrays Hard',
    sourceSheet: 'Striver A2Z + NeetCode 150',
    difficulty: 'Medium',
    recommendedMonth: 'Month 3',
    url: 'https://leetcode.com/problems/3sum/'
  },
  {
    problemId: '4sum',
    title: '4Sum (Quadruplets Sum to Target)',
    pattern: 'Two Pointers',
    subPattern: '2.3 K-Sum & Duplicate Skipping',
    striverStep: 'Step 3.3 · Arrays Hard',
    sourceSheet: 'Striver A2Z',
    difficulty: 'Medium',
    recommendedMonth: 'Month 3',
    url: 'https://leetcode.com/problems/4sum/'
  },
  {
    problemId: 'container-with-most-water',
    title: 'Container With Most Water',
    pattern: 'Two Pointers',
    subPattern: '2.4 Elevation & Water Bounds',
    striverStep: 'Step 10.1 · Two Pointers',
    sourceSheet: 'NeetCode 150',
    difficulty: 'Medium',
    recommendedMonth: 'Month 3',
    url: 'https://leetcode.com/problems/container-with-most-water/'
  },
  {
    problemId: 'trapping-rain-water',
    title: 'Trapping Rain Water (Two Pointers leftMax / rightMax)',
    pattern: 'Two Pointers',
    subPattern: '2.4 Elevation & Water Bounds',
    striverStep: 'Step 9.3 · Stack / Two Pointers Hard',
    sourceSheet: 'Striver A2Z + NeetCode 150',
    difficulty: 'Hard',
    recommendedMonth: 'Month 3',
    url: 'https://leetcode.com/problems/trapping-rain-water/'
  },

  // ============================================================================
  // PATTERN 3: SLIDING WINDOW (Striver Step 10.1 & 10.2 + NeetCode)
  // ============================================================================
  {
    problemId: 'best-time-to-buy-and-sell-stock',
    title: 'Best Time to Buy and Sell Stock',
    pattern: 'Sliding Window',
    subPattern: '3.1 Running Minimum & Fixed Window',
    striverStep: 'Step 3.2 · Arrays Medium',
    sourceSheet: 'Striver A2Z + NeetCode 150',
    difficulty: 'Easy',
    recommendedMonth: 'Month 3',
    url: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/'
  },
  {
    problemId: 'max-points-from-cards',
    title: 'Maximum Points You Can Obtain from Cards',
    pattern: 'Sliding Window',
    subPattern: '3.1 Running Minimum & Fixed Window',
    striverStep: 'Step 10.1 · Sliding Window Medium',
    sourceSheet: 'Striver A2Z',
    difficulty: 'Medium',
    recommendedMonth: 'Month 3',
    url: 'https://leetcode.com/problems/maximum-points-you-can-obtain-from-cards/'
  },
  {
    problemId: 'longest-substring-without-repeating',
    title: 'Longest Substring Without Repeating Characters',
    pattern: 'Sliding Window',
    subPattern: '3.2 Variable Window (Shrink on Violation)',
    striverStep: 'Step 10.1 · Sliding Window Medium',
    sourceSheet: 'Striver A2Z + NeetCode 150',
    difficulty: 'Medium',
    recommendedMonth: 'Month 3',
    url: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/'
  },
  {
    problemId: 'max-consecutive-ones-iii',
    title: 'Max Consecutive Ones III (Flip at Most K Zeros)',
    pattern: 'Sliding Window',
    subPattern: '3.2 Variable Window (Shrink on Violation)',
    striverStep: 'Step 10.1 · Sliding Window Medium',
    sourceSheet: 'Striver A2Z',
    difficulty: 'Medium',
    recommendedMonth: 'Month 3',
    url: 'https://leetcode.com/problems/max-consecutive-ones-iii/'
  },
  {
    problemId: 'longest-repeating-char-replacement',
    title: 'Longest Repeating Character Replacement',
    pattern: 'Sliding Window',
    subPattern: '3.2 Variable Window (Shrink on Violation)',
    striverStep: 'Step 10.1 · Sliding Window Medium',
    sourceSheet: 'Striver A2Z + NeetCode 150',
    difficulty: 'Medium',
    recommendedMonth: 'Month 3',
    url: 'https://leetcode.com/problems/longest-repeating-character-replacement/'
  },
  {
    problemId: 'permutation-in-string',
    title: 'Permutation in String',
    pattern: 'Sliding Window',
    subPattern: '3.2 Variable Window (Shrink on Violation)',
    striverStep: 'Step 10.1 · Sliding Window',
    sourceSheet: 'NeetCode 150',
    difficulty: 'Medium',
    recommendedMonth: 'Month 3',
    url: 'https://leetcode.com/problems/permutation-in-string/'
  },
  {
    problemId: 'binary-subarrays-with-sum',
    title: 'Binary Subarrays With Sum (atMost(S) - atMost(S-1))',
    pattern: 'Sliding Window',
    subPattern: '3.3 Exact K Count Trick: atMost(K) - atMost(K-1)',
    striverStep: 'Step 10.1 · Sliding Window Medium',
    sourceSheet: 'Striver A2Z',
    difficulty: 'Medium',
    recommendedMonth: 'Month 3',
    url: 'https://leetcode.com/problems/binary-subarrays-with-sum/'
  },
  {
    problemId: 'count-number-of-nice-subarrays',
    title: 'Count Number of Nice Subarrays (K Odd Numbers)',
    pattern: 'Sliding Window',
    subPattern: '3.3 Exact K Count Trick: atMost(K) - atMost(K-1)',
    striverStep: 'Step 10.1 · Sliding Window Medium',
    sourceSheet: 'Striver A2Z',
    difficulty: 'Medium',
    recommendedMonth: 'Month 3',
    url: 'https://leetcode.com/problems/count-number-of-nice-subarrays/'
  },
  {
    problemId: 'subarrays-with-k-different-integers',
    title: 'Subarrays with K Different Integers',
    pattern: 'Sliding Window',
    subPattern: '3.3 Exact K Count Trick: atMost(K) - atMost(K-1)',
    striverStep: 'Step 10.2 · Sliding Window Hard',
    sourceSheet: 'Striver A2Z',
    difficulty: 'Hard',
    recommendedMonth: 'Month 3',
    url: 'https://leetcode.com/problems/subarrays-with-k-different-integers/'
  },
  {
    problemId: 'minimum-window-substring',
    title: 'Minimum Window Substring',
    pattern: 'Sliding Window',
    subPattern: '3.4 Minimum Valid Window',
    striverStep: 'Step 10.2 · Sliding Window Hard',
    sourceSheet: 'Striver A2Z + NeetCode 150',
    difficulty: 'Hard',
    recommendedMonth: 'Month 3',
    url: 'https://leetcode.com/problems/minimum-window-substring/'
  },

  // ============================================================================
  // PATTERN 4: BINARY SEARCH (Striver Step 4.1, 4.2, 4.3 + NeetCode)
  // ============================================================================
  {
    problemId: 'binary-search',
    title: 'Binary Search (Iterative & Lower/Upper Bound)',
    pattern: 'Binary Search',
    subPattern: '4.1 1D Sorted & Rotated Array Search',
    striverStep: 'Step 4.1 · BS on 1D Arrays',
    sourceSheet: 'Striver A2Z + NeetCode 150',
    difficulty: 'Easy',
    recommendedMonth: 'Month 3',
    url: 'https://leetcode.com/problems/binary-search/'
  },
  {
    problemId: 'search-insert-position',
    title: 'Search Insert Position (Lower Bound Template)',
    pattern: 'Binary Search',
    subPattern: '4.1 1D Sorted & Rotated Array Search',
    striverStep: 'Step 4.1 · BS on 1D Arrays',
    sourceSheet: 'Striver A2Z',
    difficulty: 'Easy',
    recommendedMonth: 'Month 3',
    url: 'https://leetcode.com/problems/search-insert-position/'
  },
  {
    problemId: 'first-and-last-position-sorted',
    title: 'Find First and Last Position of Element in Sorted Array',
    pattern: 'Binary Search',
    subPattern: '4.1 1D Sorted & Rotated Array Search',
    striverStep: 'Step 4.1 · BS on 1D Arrays',
    sourceSheet: 'Striver A2Z',
    difficulty: 'Medium',
    recommendedMonth: 'Month 3',
    url: 'https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/'
  },
  {
    problemId: 'search-in-rotated-sorted-array',
    title: 'Search in Rotated Sorted Array',
    pattern: 'Binary Search',
    subPattern: '4.1 1D Sorted & Rotated Array Search',
    striverStep: 'Step 4.1 · BS on 1D Arrays',
    sourceSheet: 'Striver A2Z + NeetCode 150',
    difficulty: 'Medium',
    recommendedMonth: 'Month 3',
    url: 'https://leetcode.com/problems/search-in-rotated-sorted-array/'
  },
  {
    problemId: 'find-min-in-rotated-sorted-array',
    title: 'Find Minimum in Rotated Sorted Array',
    pattern: 'Binary Search',
    subPattern: '4.1 1D Sorted & Rotated Array Search',
    striverStep: 'Step 4.1 · BS on 1D Arrays',
    sourceSheet: 'Striver A2Z + NeetCode 150',
    difficulty: 'Medium',
    recommendedMonth: 'Month 3',
    url: 'https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/'
  },
  {
    problemId: 'single-element-in-sorted-array',
    title: 'Single Element in a Sorted Array (Even/Odd Index Pair)',
    pattern: 'Binary Search',
    subPattern: '4.1 1D Sorted & Rotated Array Search',
    striverStep: 'Step 4.1 · BS on 1D Arrays',
    sourceSheet: 'Striver A2Z',
    difficulty: 'Medium',
    recommendedMonth: 'Month 3',
    url: 'https://leetcode.com/problems/single-element-in-a-sorted-array/'
  },
  {
    problemId: 'find-peak-element',
    title: 'Find Peak Element (Monotonic Slope Search)',
    pattern: 'Binary Search',
    subPattern: '4.1 1D Sorted & Rotated Array Search',
    striverStep: 'Step 4.1 · BS on 1D Arrays',
    sourceSheet: 'Striver A2Z',
    difficulty: 'Medium',
    recommendedMonth: 'Month 3',
    url: 'https://leetcode.com/problems/find-peak-element/'
  },
  {
    problemId: 'koko-eating-bananas',
    title: 'Koko Eating Bananas (BS on Answer Space)',
    pattern: 'Binary Search',
    subPattern: '4.2 Binary Search on Answer (Min-Max / Max-Min)',
    striverStep: 'Step 4.2 · BS on Answers',
    sourceSheet: 'Striver A2Z + NeetCode 150',
    difficulty: 'Medium',
    recommendedMonth: 'Month 3',
    url: 'https://leetcode.com/problems/koko-eating-bananas/'
  },
  {
    problemId: 'min-days-to-make-m-bouquets',
    title: 'Minimum Number of Days to Make m Bouquets',
    pattern: 'Binary Search',
    subPattern: '4.2 Binary Search on Answer (Min-Max / Max-Min)',
    striverStep: 'Step 4.2 · BS on Answers',
    sourceSheet: 'Striver A2Z',
    difficulty: 'Medium',
    recommendedMonth: 'Month 3',
    url: 'https://leetcode.com/problems/minimum-number-of-days-to-make-m-bouquets/'
  },
  {
    problemId: 'capacity-to-ship-packages',
    title: 'Capacity To Ship Packages Within D Days',
    pattern: 'Binary Search',
    subPattern: '4.2 Binary Search on Answer (Min-Max / Max-Min)',
    striverStep: 'Step 4.2 · BS on Answers',
    sourceSheet: 'Striver A2Z',
    difficulty: 'Medium',
    recommendedMonth: 'Month 3',
    url: 'https://leetcode.com/problems/capacity-to-ship-packages-within-d-days/'
  },
  {
    problemId: 'split-array-largest-sum',
    title: 'Split Array Largest Sum / Book Allocation Problem',
    pattern: 'Binary Search',
    subPattern: '4.2 Binary Search on Answer (Min-Max / Max-Min)',
    striverStep: 'Step 4.2 · BS on Answers',
    sourceSheet: 'Striver A2Z',
    difficulty: 'Hard',
    recommendedMonth: 'Month 3',
    url: 'https://leetcode.com/problems/split-array-largest-sum/'
  },
  {
    problemId: 'median-of-two-sorted-arrays',
    title: 'Median of Two Sorted Arrays (Symmetry Partition)',
    pattern: 'Binary Search',
    subPattern: '4.2 Binary Search on Answer (Min-Max / Max-Min)',
    striverStep: 'Step 4.2 · BS on Answers',
    sourceSheet: 'Striver A2Z + NeetCode 150',
    difficulty: 'Hard',
    recommendedMonth: 'Month 3',
    url: 'https://leetcode.com/problems/median-of-two-sorted-arrays/'
  },
  {
    problemId: 'search-a-2d-matrix',
    title: 'Search a 2D Matrix (1D Flattened Index Mapping)',
    pattern: 'Binary Search',
    subPattern: '4.3 Binary Search on 2D Matrices',
    striverStep: 'Step 4.3 · BS on 2D Arrays',
    sourceSheet: 'Striver A2Z + NeetCode 150',
    difficulty: 'Medium',
    recommendedMonth: 'Month 3',
    url: 'https://leetcode.com/problems/search-a-2d-matrix/'
  },
  {
    problemId: 'search-a-2d-matrix-ii',
    title: 'Search a 2D Matrix II (Staircase Top-Right Search)',
    pattern: 'Binary Search',
    subPattern: '4.3 Binary Search on 2D Matrices',
    striverStep: 'Step 4.3 · BS on 2D Arrays',
    sourceSheet: 'Striver A2Z',
    difficulty: 'Medium',
    recommendedMonth: 'Month 3',
    url: 'https://leetcode.com/problems/search-a-2d-matrix-ii/'
  },

  // ============================================================================
  // PATTERN 5: STACK & MONOTONIC STACK (Striver Step 9.1–9.4 + NeetCode)
  // ============================================================================
  {
    problemId: 'valid-parentheses',
    title: 'Valid Parentheses',
    pattern: 'Stack',
    subPattern: '5.1 Stack Design & Expression Parsing',
    striverStep: 'Step 9.1 · Stack Learning',
    sourceSheet: 'Striver A2Z + NeetCode 150',
    difficulty: 'Easy',
    recommendedMonth: 'Month 4',
    url: 'https://leetcode.com/problems/valid-parentheses/'
  },
  {
    problemId: 'min-stack',
    title: 'Min Stack (O(1) Extra Space / Pair Stack)',
    pattern: 'Stack',
    subPattern: '5.1 Stack Design & Expression Parsing',
    striverStep: 'Step 9.1 · Stack Learning',
    sourceSheet: 'Striver A2Z + NeetCode 150',
    difficulty: 'Medium',
    recommendedMonth: 'Month 4',
    url: 'https://leetcode.com/problems/min-stack/'
  },
  {
    problemId: 'evaluate-reverse-polish-notation',
    title: 'Evaluate Reverse Polish Notation',
    pattern: 'Stack',
    subPattern: '5.1 Stack Design & Expression Parsing',
    striverStep: 'Step 9.2 · Postfix/Prefix Conversion',
    sourceSheet: 'NeetCode 150',
    difficulty: 'Medium',
    recommendedMonth: 'Month 4',
    url: 'https://leetcode.com/problems/evaluate-reverse-polish-notation/'
  },
  {
    problemId: 'next-greater-element-i',
    title: 'Next Greater Element I',
    pattern: 'Stack',
    subPattern: '5.2 Monotonic Stack (Next Greater / Smaller)',
    striverStep: 'Step 9.3 · Monotonic Stack',
    sourceSheet: 'Striver A2Z',
    difficulty: 'Easy',
    recommendedMonth: 'Month 4',
    url: 'https://leetcode.com/problems/next-greater-element-i/'
  },
  {
    problemId: 'next-greater-element-ii',
    title: 'Next Greater Element II (Circular Array 2N Modulo)',
    pattern: 'Stack',
    subPattern: '5.2 Monotonic Stack (Next Greater / Smaller)',
    striverStep: 'Step 9.3 · Monotonic Stack',
    sourceSheet: 'Striver A2Z',
    difficulty: 'Medium',
    recommendedMonth: 'Month 4',
    url: 'https://leetcode.com/problems/next-greater-element-ii/'
  },
  {
    problemId: 'daily-temperatures',
    title: 'Daily Temperatures',
    pattern: 'Stack',
    subPattern: '5.2 Monotonic Stack (Next Greater / Smaller)',
    striverStep: 'Step 9.3 · Monotonic Stack',
    sourceSheet: 'NeetCode 150',
    difficulty: 'Medium',
    recommendedMonth: 'Month 4',
    url: 'https://leetcode.com/problems/daily-temperatures/'
  },
  {
    problemId: 'asteroid-collision',
    title: 'Asteroid Collision',
    pattern: 'Stack',
    subPattern: '5.2 Monotonic Stack (Next Greater / Smaller)',
    striverStep: 'Step 9.3 · Monotonic Stack',
    sourceSheet: 'Striver A2Z',
    difficulty: 'Medium',
    recommendedMonth: 'Month 4',
    url: 'https://leetcode.com/problems/asteroid-collision/'
  },
  {
    problemId: 'sum-of-subarray-minimums',
    title: 'Sum of Subarray Minimums (NSE & PSE Contribution)',
    pattern: 'Stack',
    subPattern: '5.3 Subarray Contribution & Histogram Span',
    striverStep: 'Step 9.3 · Monotonic Stack',
    sourceSheet: 'Striver A2Z',
    difficulty: 'Medium',
    recommendedMonth: 'Month 4',
    url: 'https://leetcode.com/problems/sum-of-subarray-minimums/'
  },
  {
    problemId: 'remove-k-digits',
    title: 'Remove K Digits (Monotonic Increasing Stack)',
    pattern: 'Stack',
    subPattern: '5.3 Subarray Contribution & Histogram Span',
    striverStep: 'Step 9.3 · Monotonic Stack',
    sourceSheet: 'Striver A2Z',
    difficulty: 'Medium',
    recommendedMonth: 'Month 4',
    url: 'https://leetcode.com/problems/remove-k-digits/'
  },
  {
    problemId: 'largest-rectangle-in-histogram',
    title: 'Largest Rectangle in Histogram',
    pattern: 'Stack',
    subPattern: '5.3 Subarray Contribution & Histogram Span',
    striverStep: 'Step 9.3 · Monotonic Stack Hard',
    sourceSheet: 'Striver A2Z + NeetCode 150',
    difficulty: 'Hard',
    recommendedMonth: 'Month 4',
    url: 'https://leetcode.com/problems/largest-rectangle-in-histogram/'
  },
  {
    problemId: 'sliding-window-maximum',
    title: 'Sliding Window Maximum (Monotonic Deque)',
    pattern: 'Stack',
    subPattern: '5.3 Subarray Contribution & Histogram Span',
    striverStep: 'Step 9.4 · Implementation Problems',
    sourceSheet: 'Striver A2Z + NeetCode 150',
    difficulty: 'Hard',
    recommendedMonth: 'Month 4',
    url: 'https://leetcode.com/problems/sliding-window-maximum/'
  },

  // ============================================================================
  // PATTERN 6: LINKED LIST (Striver Step 6.1–6.5 + NeetCode)
  // ============================================================================
  {
    problemId: 'reverse-linked-list',
    title: 'Reverse Linked List (Iterative & Recursive)',
    pattern: 'Linked List',
    subPattern: '6.1 Fast & Slow Pointers (Tortoise & Hare)',
    striverStep: 'Step 6.3 · Medium Problems of LL',
    sourceSheet: 'Striver A2Z + NeetCode 150',
    difficulty: 'Easy',
    recommendedMonth: 'Month 4',
    url: 'https://leetcode.com/problems/reverse-linked-list/'
  },
  {
    problemId: 'middle-of-the-linked-list',
    title: 'Middle of the Linked List',
    pattern: 'Linked List',
    subPattern: '6.1 Fast & Slow Pointers (Tortoise & Hare)',
    striverStep: 'Step 6.3 · Medium Problems of LL',
    sourceSheet: 'Striver A2Z',
    difficulty: 'Easy',
    recommendedMonth: 'Month 4',
    url: 'https://leetcode.com/problems/middle-of-the-linked-list/'
  },
  {
    problemId: 'linked-list-cycle',
    title: 'Linked List Cycle I & II (Entry Node Detection)',
    pattern: 'Linked List',
    subPattern: '6.1 Fast & Slow Pointers (Tortoise & Hare)',
    striverStep: 'Step 6.3 · Medium Problems of LL',
    sourceSheet: 'Striver A2Z + NeetCode 150',
    difficulty: 'Easy',
    recommendedMonth: 'Month 4',
    url: 'https://leetcode.com/problems/linked-list-cycle/'
  },
  {
    problemId: 'palindrome-linked-list',
    title: 'Palindrome Linked List (Reverse Second Half)',
    pattern: 'Linked List',
    subPattern: '6.1 Fast & Slow Pointers (Tortoise & Hare)',
    striverStep: 'Step 6.3 · Medium Problems of LL',
    sourceSheet: 'Striver A2Z',
    difficulty: 'Easy',
    recommendedMonth: 'Month 4',
    url: 'https://leetcode.com/problems/palindrome-linked-list/'
  },
  {
    problemId: 'merge-two-sorted-lists',
    title: 'Merge Two Sorted Lists',
    pattern: 'Linked List',
    subPattern: '6.2 Pointer Re-Wiring & In-Place Reversal',
    striverStep: 'Step 6.3 · Medium Problems of LL',
    sourceSheet: 'Striver A2Z + NeetCode 150',
    difficulty: 'Easy',
    recommendedMonth: 'Month 4',
    url: 'https://leetcode.com/problems/merge-two-sorted-lists/'
  },
  {
    problemId: 'odd-even-linked-list',
    title: 'Odd Even Linked List',
    pattern: 'Linked List',
    subPattern: '6.2 Pointer Re-Wiring & In-Place Reversal',
    striverStep: 'Step 6.3 · Medium Problems of LL',
    sourceSheet: 'Striver A2Z',
    difficulty: 'Medium',
    recommendedMonth: 'Month 4',
    url: 'https://leetcode.com/problems/odd-even-linked-list/'
  },
  {
    problemId: 'remove-nth-node-from-end',
    title: 'Remove Nth Node From End of List',
    pattern: 'Linked List',
    subPattern: '6.2 Pointer Re-Wiring & In-Place Reversal',
    striverStep: 'Step 6.3 · Medium Problems of LL',
    sourceSheet: 'Striver A2Z + NeetCode 150',
    difficulty: 'Medium',
    recommendedMonth: 'Month 4',
    url: 'https://leetcode.com/problems/remove-nth-node-from-end-of-list/'
  },
  {
    problemId: 'reorder-list',
    title: 'Reorder List',
    pattern: 'Linked List',
    subPattern: '6.2 Pointer Re-Wiring & In-Place Reversal',
    striverStep: 'Step 6.3 · Medium Problems of LL',
    sourceSheet: 'NeetCode 150',
    difficulty: 'Medium',
    recommendedMonth: 'Month 4',
    url: 'https://leetcode.com/problems/reorder-list/'
  },
  {
    problemId: 'reverse-nodes-in-k-group',
    title: 'Reverse Nodes in k-Group',
    pattern: 'Linked List',
    subPattern: '6.3 Hard LL Manipulation & System Design',
    striverStep: 'Step 6.5 · Hard Problems of LL',
    sourceSheet: 'Striver A2Z + NeetCode 150',
    difficulty: 'Hard',
    recommendedMonth: 'Month 4',
    url: 'https://leetcode.com/problems/reverse-nodes-in-k-group/'
  },
  {
    problemId: 'copy-list-with-random-pointer',
    title: 'Copy List with Random Pointer (Interleaving Nodes)',
    pattern: 'Linked List',
    subPattern: '6.3 Hard LL Manipulation & System Design',
    striverStep: 'Step 6.5 · Hard Problems of LL',
    sourceSheet: 'Striver A2Z + NeetCode 150',
    difficulty: 'Medium',
    recommendedMonth: 'Month 4',
    url: 'https://leetcode.com/problems/copy-list-with-random-pointer/'
  },
  {
    problemId: 'lru-cache',
    title: 'LRU Cache (Doubly Linked List + HashMap)',
    pattern: 'Linked List',
    subPattern: '6.3 Hard LL Manipulation & System Design',
    striverStep: 'Step 9.4 · Implementation Problems',
    sourceSheet: 'Striver A2Z + NeetCode 150',
    difficulty: 'Medium',
    recommendedMonth: 'Month 4',
    url: 'https://leetcode.com/problems/lru-cache/'
  },

  // ============================================================================
  // PATTERN 7: TREES (BINARY TREES & BST) (Striver Step 13 & 14 + NeetCode)
  // ============================================================================
  {
    problemId: 'binary-tree-level-order-traversal',
    title: 'Binary Tree Level Order & Zigzag Level Order Traversal',
    pattern: 'Trees',
    subPattern: '7.1 BFS Level-Order & Boundary Views',
    striverStep: 'Step 13.1 & 13.2 · Traversals & Views',
    sourceSheet: 'Striver A2Z + NeetCode 150',
    difficulty: 'Medium',
    recommendedMonth: 'Month 5',
    url: 'https://leetcode.com/problems/binary-tree-level-order-traversal/'
  },
  {
    problemId: 'binary-tree-right-side-view',
    title: 'Binary Tree Right Side View',
    pattern: 'Trees',
    subPattern: '7.1 BFS Level-Order & Boundary Views',
    striverStep: 'Step 13.2 · Medium Problems of Trees',
    sourceSheet: 'Striver A2Z + NeetCode 150',
    difficulty: 'Medium',
    recommendedMonth: 'Month 5',
    url: 'https://leetcode.com/problems/binary-tree-right-side-view/'
  },
  {
    problemId: 'vertical-order-traversal-binary-tree',
    title: 'Vertical Order Traversal of a Binary Tree',
    pattern: 'Trees',
    subPattern: '7.1 BFS Level-Order & Boundary Views',
    striverStep: 'Step 13.2 · Medium Problems of Trees',
    sourceSheet: 'Striver A2Z',
    difficulty: 'Hard',
    recommendedMonth: 'Month 5',
    url: 'https://leetcode.com/problems/vertical-order-traversal-of-a-binary-tree/'
  },
  {
    problemId: 'invert-binary-tree',
    title: 'Invert Binary Tree',
    pattern: 'Trees',
    subPattern: '7.2 Height, Diameter & Path Sums',
    striverStep: 'Step 13.2 · Medium Problems of Trees',
    sourceSheet: 'NeetCode 150',
    difficulty: 'Easy',
    recommendedMonth: 'Month 5',
    url: 'https://leetcode.com/problems/invert-binary-tree/'
  },
  {
    problemId: 'maximum-depth-of-binary-tree',
    title: 'Maximum Depth & Balanced Binary Tree Check',
    pattern: 'Trees',
    subPattern: '7.2 Height, Diameter & Path Sums',
    striverStep: 'Step 13.2 · Medium Problems of Trees',
    sourceSheet: 'Striver A2Z + NeetCode 150',
    difficulty: 'Easy',
    recommendedMonth: 'Month 5',
    url: 'https://leetcode.com/problems/maximum-depth-of-binary-tree/'
  },
  {
    problemId: 'diameter-of-binary-tree',
    title: 'Diameter of Binary Tree',
    pattern: 'Trees',
    subPattern: '7.2 Height, Diameter & Path Sums',
    striverStep: 'Step 13.2 · Medium Problems of Trees',
    sourceSheet: 'Striver A2Z + NeetCode 150',
    difficulty: 'Easy',
    recommendedMonth: 'Month 5',
    url: 'https://leetcode.com/problems/diameter-of-binary-tree/'
  },
  {
    problemId: 'binary-tree-maximum-path-sum',
    title: 'Binary Tree Maximum Path Sum',
    pattern: 'Trees',
    subPattern: '7.2 Height, Diameter & Path Sums',
    striverStep: 'Step 13.2 · Medium Problems of Trees',
    sourceSheet: 'Striver A2Z + NeetCode 150',
    difficulty: 'Hard',
    recommendedMonth: 'Month 5',
    url: 'https://leetcode.com/problems/binary-tree-maximum-path-sum/'
  },
  {
    problemId: 'lowest-common-ancestor-binary-tree',
    title: 'Lowest Common Ancestor of a Binary Tree',
    pattern: 'Trees',
    subPattern: '7.3 Ancestors, Construction & Serialization',
    striverStep: 'Step 13.3 · Hard Problems of Trees',
    sourceSheet: 'Striver A2Z + NeetCode 150',
    difficulty: 'Medium',
    recommendedMonth: 'Month 5',
    url: 'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/'
  },
  {
    problemId: 'all-nodes-distance-k-in-binary-tree',
    title: 'All Nodes Distance K in Binary Tree (Parent Map + Radial BFS)',
    pattern: 'Trees',
    subPattern: '7.3 Ancestors, Construction & Serialization',
    striverStep: 'Step 13.3 · Hard Problems of Trees',
    sourceSheet: 'Striver A2Z',
    difficulty: 'Medium',
    recommendedMonth: 'Month 5',
    url: 'https://leetcode.com/problems/all-nodes-distance-k-in-binary-tree/'
  },
  {
    problemId: 'construct-bt-from-preorder-and-inorder',
    title: 'Construct Binary Tree from Preorder and Inorder Traversal',
    pattern: 'Trees',
    subPattern: '7.3 Ancestors, Construction & Serialization',
    striverStep: 'Step 13.3 · Hard Problems of Trees',
    sourceSheet: 'Striver A2Z + NeetCode 150',
    difficulty: 'Medium',
    recommendedMonth: 'Month 5',
    url: 'https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/'
  },
  {
    problemId: 'validate-binary-search-tree',
    title: 'Validate Binary Search Tree (Range Bounds)',
    pattern: 'Trees',
    subPattern: '7.4 Binary Search Tree (BST) Properties',
    striverStep: 'Step 14.2 · BST Practice Problems',
    sourceSheet: 'Striver A2Z + NeetCode 150',
    difficulty: 'Medium',
    recommendedMonth: 'Month 5',
    url: 'https://leetcode.com/problems/validate-binary-search-tree/'
  },
  {
    problemId: 'kth-smallest-element-in-a-bst',
    title: 'Kth Smallest Element in a BST',
    pattern: 'Trees',
    subPattern: '7.4 Binary Search Tree (BST) Properties',
    striverStep: 'Step 14.2 · BST Practice Problems',
    sourceSheet: 'Striver A2Z + NeetCode 150',
    difficulty: 'Medium',
    recommendedMonth: 'Month 5',
    url: 'https://leetcode.com/problems/kth-smallest-element-in-a-bst/'
  },
  {
    problemId: 'lowest-common-ancestor-bst',
    title: 'Lowest Common Ancestor of a BST',
    pattern: 'Trees',
    subPattern: '7.4 Binary Search Tree (BST) Properties',
    striverStep: 'Step 14.2 · BST Practice Problems',
    sourceSheet: 'Striver A2Z + NeetCode 150',
    difficulty: 'Medium',
    recommendedMonth: 'Month 5',
    url: 'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/'
  },

  // ============================================================================
  // PATTERN 8: RECURSION & BACKTRACKING (Striver Step 7.1–7.3 + NeetCode)
  // ============================================================================
  {
    problemId: 'subsets',
    title: 'Subsets I & II (Power Set / Pick & Not-Pick)',
    pattern: 'Backtracking',
    subPattern: '8.1 Subsequences & Combination Trees',
    striverStep: 'Step 7.2 · Subsequences Pattern',
    sourceSheet: 'Striver A2Z + NeetCode 150',
    difficulty: 'Medium',
    recommendedMonth: 'Month 5',
    url: 'https://leetcode.com/problems/subsets/'
  },
  {
    problemId: 'combination-sum',
    title: 'Combination Sum I & II',
    pattern: 'Backtracking',
    subPattern: '8.1 Subsequences & Combination Trees',
    striverStep: 'Step 7.2 · Subsequences Pattern',
    sourceSheet: 'Striver A2Z + NeetCode 150',
    difficulty: 'Medium',
    recommendedMonth: 'Month 5',
    url: 'https://leetcode.com/problems/combination-sum/'
  },
  {
    problemId: 'permutations',
    title: 'Permutations',
    pattern: 'Backtracking',
    subPattern: '8.1 Subsequences & Combination Trees',
    striverStep: 'Step 7.2 · Subsequences Pattern',
    sourceSheet: 'Striver A2Z + NeetCode 150',
    difficulty: 'Medium',
    recommendedMonth: 'Month 5',
    url: 'https://leetcode.com/problems/permutations/'
  },
  {
    problemId: 'palindrome-partitioning',
    title: 'Palindrome Partitioning',
    pattern: 'Backtracking',
    subPattern: '8.2 Constraint Satisfaction & Grid Search',
    striverStep: 'Step 7.3 · Trying Out All Combos / Hard',
    sourceSheet: 'Striver A2Z + NeetCode 150',
    difficulty: 'Medium',
    recommendedMonth: 'Month 5',
    url: 'https://leetcode.com/problems/palindrome-partitioning/'
  },
  {
    problemId: 'word-search',
    title: 'Word Search on 2D Grid',
    pattern: 'Backtracking',
    subPattern: '8.2 Constraint Satisfaction & Grid Search',
    striverStep: 'Step 7.3 · Trying Out All Combos / Hard',
    sourceSheet: 'Striver A2Z + NeetCode 150',
    difficulty: 'Medium',
    recommendedMonth: 'Month 5',
    url: 'https://leetcode.com/problems/word-search/'
  },
  {
    problemId: 'n-queens',
    title: 'N-Queens',
    pattern: 'Backtracking',
    subPattern: '8.2 Constraint Satisfaction & Grid Search',
    striverStep: 'Step 7.3 · Trying Out All Combos / Hard',
    sourceSheet: 'Striver A2Z + NeetCode 150',
    difficulty: 'Hard',
    recommendedMonth: 'Sem 2 (M7–8)',
    url: 'https://leetcode.com/problems/n-queens/'
  },

  // ============================================================================
  // PATTERN 9: HEAP / PRIORITY QUEUE & TRIES (Striver Step 11 & 17 + NeetCode)
  // ============================================================================
  {
    problemId: 'kth-largest-element-in-an-array',
    title: 'Kth Largest Element in an Array (Min-Heap / QuickSelect)',
    pattern: 'Heap / Priority Queue',
    subPattern: '9.1 Top-K, K-Way Merge & Two Heaps',
    striverStep: 'Step 11.2 · Heaps Medium',
    sourceSheet: 'Striver A2Z + NeetCode 150',
    difficulty: 'Medium',
    recommendedMonth: 'Sem 2 (M7–8)',
    url: 'https://leetcode.com/problems/kth-largest-element-in-an-array/'
  },
  {
    problemId: 'merge-k-sorted-lists',
    title: 'Merge k Sorted Lists',
    pattern: 'Heap / Priority Queue',
    subPattern: '9.1 Top-K, K-Way Merge & Two Heaps',
    striverStep: 'Step 11.2 · Heaps Medium',
    sourceSheet: 'Striver A2Z + NeetCode 150',
    difficulty: 'Hard',
    recommendedMonth: 'Sem 2 (M7–8)',
    url: 'https://leetcode.com/problems/merge-k-sorted-lists/'
  },
  {
    problemId: 'task-scheduler',
    title: 'Task Scheduler (Cooldown Greedy + Max-Heap)',
    pattern: 'Heap / Priority Queue',
    subPattern: '9.1 Top-K, K-Way Merge & Two Heaps',
    striverStep: 'Step 11.2 · Heaps Medium',
    sourceSheet: 'Striver A2Z + NeetCode 150',
    difficulty: 'Medium',
    recommendedMonth: 'Sem 2 (M7–8)',
    url: 'https://leetcode.com/problems/task-scheduler/'
  },
  {
    problemId: 'find-median-from-data-stream',
    title: 'Find Median from Data Stream (Max-Heap + Min-Heap)',
    pattern: 'Heap / Priority Queue',
    subPattern: '9.1 Top-K, K-Way Merge & Two Heaps',
    striverStep: 'Step 11.3 · Heaps Hard',
    sourceSheet: 'Striver A2Z + NeetCode 150',
    difficulty: 'Hard',
    recommendedMonth: 'Sem 2 (M7–8)',
    url: 'https://leetcode.com/problems/find-median-from-data-stream/'
  },
  {
    problemId: 'implement-trie-prefix-tree',
    title: 'Implement Trie (Prefix Tree)',
    pattern: 'Tries',
    subPattern: '9.2 Prefix Trees & Bitwise XOR Tries',
    striverStep: 'Step 17.1 · Tries Theory & Implementation',
    sourceSheet: 'Striver A2Z + NeetCode 150',
    difficulty: 'Medium',
    recommendedMonth: 'Sem 2 (M7–8)',
    url: 'https://leetcode.com/problems/implement-trie-prefix-tree/'
  },
  {
    problemId: 'maximum-xor-of-two-numbers',
    title: 'Maximum XOR of Two Numbers in an Array (Bitwise Trie)',
    pattern: 'Tries',
    subPattern: '9.2 Prefix Trees & Bitwise XOR Tries',
    striverStep: 'Step 17.2 · Tries Problems',
    sourceSheet: 'Striver A2Z',
    difficulty: 'Medium',
    recommendedMonth: 'Sem 2 (M7–8)',
    url: 'https://leetcode.com/problems/maximum-xor-of-two-numbers-in-an-array/'
  },

  // ============================================================================
  // PATTERN 10: GRAPHS (Striver Step 15.1–15.5 + NeetCode)
  // ============================================================================
  {
    problemId: 'number-of-provinces',
    title: 'Number of Provinces (Connected Components)',
    pattern: 'Graphs',
    subPattern: '10.1 BFS / DFS Grid & Component Traversals',
    striverStep: 'Step 15.2 · Problems on BFS/DFS',
    sourceSheet: 'Striver A2Z',
    difficulty: 'Medium',
    recommendedMonth: 'Sem 2 (M9–10)',
    url: 'https://leetcode.com/problems/number-of-provinces/'
  },
  {
    problemId: 'number-of-islands',
    title: 'Number of Islands',
    pattern: 'Graphs',
    subPattern: '10.1 BFS / DFS Grid & Component Traversals',
    striverStep: 'Step 15.2 · Problems on BFS/DFS',
    sourceSheet: 'Striver A2Z + NeetCode 150',
    difficulty: 'Medium',
    recommendedMonth: 'Sem 2 (M9–10)',
    url: 'https://leetcode.com/problems/number-of-islands/'
  },
  {
    problemId: 'rotting-oranges',
    title: 'Rotting Oranges (Multi-Source BFS)',
    pattern: 'Graphs',
    subPattern: '10.1 BFS / DFS Grid & Component Traversals',
    striverStep: 'Step 15.2 · Problems on BFS/DFS',
    sourceSheet: 'Striver A2Z + NeetCode 150',
    difficulty: 'Medium',
    recommendedMonth: 'Sem 2 (M9–10)',
    url: 'https://leetcode.com/problems/rotting-oranges/'
  },
  {
    problemId: '01-matrix-nearest-cell',
    title: '01 Matrix (Distance of Nearest Cell Having 0)',
    pattern: 'Graphs',
    subPattern: '10.1 BFS / DFS Grid & Component Traversals',
    striverStep: 'Step 15.2 · Problems on BFS/DFS',
    sourceSheet: 'Striver A2Z',
    difficulty: 'Medium',
    recommendedMonth: 'Sem 2 (M9–10)',
    url: 'https://leetcode.com/problems/01-matrix/'
  },
  {
    problemId: 'is-graph-bipartite',
    title: 'Is Graph Bipartite? (2-Coloring BFS/DFS)',
    pattern: 'Graphs',
    subPattern: '10.1 BFS / DFS Grid & Component Traversals',
    striverStep: 'Step 15.2 · Problems on BFS/DFS',
    sourceSheet: 'Striver A2Z',
    difficulty: 'Medium',
    recommendedMonth: 'Sem 2 (M9–10)',
    url: 'https://leetcode.com/problems/is-graph-bipartite/'
  },
  {
    problemId: 'clone-graph',
    title: 'Clone Graph',
    pattern: 'Graphs',
    subPattern: '10.1 BFS / DFS Grid & Component Traversals',
    striverStep: 'Step 15.2 · Problems on BFS/DFS',
    sourceSheet: 'NeetCode 150',
    difficulty: 'Medium',
    recommendedMonth: 'Sem 2 (M9–10)',
    url: 'https://leetcode.com/problems/clone-graph/'
  },
  {
    problemId: 'course-schedule',
    title: 'Course Schedule I & II (Kahn Topological Sort & Cycle Detection)',
    pattern: 'Graphs',
    subPattern: '10.2 Topological Sort & Directed Acyclic Graphs',
    striverStep: 'Step 15.3 · Topo Sort and Problems',
    sourceSheet: 'Striver A2Z + NeetCode 150',
    difficulty: 'Medium',
    recommendedMonth: 'Sem 2 (M9–10)',
    url: 'https://leetcode.com/problems/course-schedule/'
  },
  {
    problemId: 'find-eventual-safe-states',
    title: 'Find Eventual Safe States',
    pattern: 'Graphs',
    subPattern: '10.2 Topological Sort & Directed Acyclic Graphs',
    striverStep: 'Step 15.3 · Topo Sort and Problems',
    sourceSheet: 'Striver A2Z',
    difficulty: 'Medium',
    recommendedMonth: 'Sem 2 (M9–10)',
    url: 'https://leetcode.com/problems/find-eventual-safe-states/'
  },
  {
    problemId: 'word-ladder',
    title: 'Word Ladder I (Shortest Unweighted Transformation)',
    pattern: 'Graphs',
    subPattern: '10.3 Shortest Path (BFS, Dijkstra, Bellman-Ford)',
    striverStep: 'Step 15.2 · Problems on BFS/DFS',
    sourceSheet: 'Striver A2Z + NeetCode 150',
    difficulty: 'Hard',
    recommendedMonth: 'Sem 2 (M9–10)',
    url: 'https://leetcode.com/problems/word-ladder/'
  },
  {
    problemId: 'shortest-path-in-binary-matrix',
    title: 'Shortest Path in Binary Matrix (8-Directional Dijkstra/BFS)',
    pattern: 'Graphs',
    subPattern: '10.3 Shortest Path (BFS, Dijkstra, Bellman-Ford)',
    striverStep: 'Step 15.4 · Shortest Path Algorithms',
    sourceSheet: 'Striver A2Z',
    difficulty: 'Medium',
    recommendedMonth: 'Sem 2 (M9–10)',
    url: 'https://leetcode.com/problems/shortest-path-in-binary-matrix/'
  },
  {
    problemId: 'path-with-minimum-effort',
    title: 'Path With Minimum Effort (Minimax Dijkstra)',
    pattern: 'Graphs',
    subPattern: '10.3 Shortest Path (BFS, Dijkstra, Bellman-Ford)',
    striverStep: 'Step 15.4 · Shortest Path Algorithms',
    sourceSheet: 'Striver A2Z',
    difficulty: 'Medium',
    recommendedMonth: 'Sem 2 (M9–10)',
    url: 'https://leetcode.com/problems/path-with-minimum-effort/'
  },
  {
    problemId: 'cheapest-flights-within-k-stops',
    title: 'Cheapest Flights Within K Stops',
    pattern: 'Graphs',
    subPattern: '10.3 Shortest Path (BFS, Dijkstra, Bellman-Ford)',
    striverStep: 'Step 15.4 · Shortest Path Algorithms',
    sourceSheet: 'Striver A2Z + NeetCode 150',
    difficulty: 'Medium',
    recommendedMonth: 'Sem 2 (M9–10)',
    url: 'https://leetcode.com/problems/cheapest-flights-within-k-stops/'
  },
  {
    problemId: 'network-delay-time',
    title: 'Network Delay Time (Standard Dijkstra)',
    pattern: 'Graphs',
    subPattern: '10.3 Shortest Path (BFS, Dijkstra, Bellman-Ford)',
    striverStep: 'Step 15.4 · Shortest Path Algorithms',
    sourceSheet: 'Striver A2Z + NeetCode 150',
    difficulty: 'Medium',
    recommendedMonth: 'Sem 2 (M9–10)',
    url: 'https://leetcode.com/problems/network-delay-time/'
  },
  {
    problemId: 'accounts-merge-dsu',
    title: 'Accounts Merge (Disjoint Set Union-Find)',
    pattern: 'Graphs',
    subPattern: '10.4 Minimum Spanning Tree & Disjoint Set (Union-Find)',
    striverStep: 'Step 15.5 · MST and Disjoint Set',
    sourceSheet: 'Striver A2Z',
    difficulty: 'Medium',
    recommendedMonth: 'Sem 2 (M9–10)',
    url: 'https://leetcode.com/problems/accounts-merge/'
  },

  // ============================================================================
  // PATTERN 11: DYNAMIC PROGRAMMING (Striver Step 16.1–16.8 + NeetCode)
  // ============================================================================
  {
    problemId: 'climbing-stairs',
    title: 'Climbing Stairs (1D Fibonacci State)',
    pattern: 'Dynamic Programming',
    subPattern: '11.1 1D Linear DP',
    striverStep: 'Step 16.2 · 1D DP',
    sourceSheet: 'Striver A2Z + NeetCode 150',
    difficulty: 'Easy',
    recommendedMonth: 'Sem 2 (M11–12)',
    url: 'https://leetcode.com/problems/climbing-stairs/'
  },
  {
    problemId: 'house-robber',
    title: 'House Robber I & II (Non-Adjacent Circular Selection)',
    pattern: 'Dynamic Programming',
    subPattern: '11.1 1D Linear DP',
    striverStep: 'Step 16.2 · 1D DP',
    sourceSheet: 'Striver A2Z + NeetCode 150',
    difficulty: 'Medium',
    recommendedMonth: 'Sem 2 (M11–12)',
    url: 'https://leetcode.com/problems/house-robber/'
  },
  {
    problemId: 'unique-paths',
    title: 'Unique Paths I & II (2D Grid Combinatorics & Obstacles)',
    pattern: 'Dynamic Programming',
    subPattern: '11.2 2D & 3D Grid DP',
    striverStep: 'Step 16.3 · 2D/3D DP and DP on Grids',
    sourceSheet: 'Striver A2Z + NeetCode 150',
    difficulty: 'Medium',
    recommendedMonth: 'Sem 2 (M11–12)',
    url: 'https://leetcode.com/problems/unique-paths/'
  },
  {
    problemId: 'minimum-path-sum',
    title: 'Minimum Path Sum in Grid',
    pattern: 'Dynamic Programming',
    subPattern: '11.2 2D & 3D Grid DP',
    striverStep: 'Step 16.3 · 2D/3D DP and DP on Grids',
    sourceSheet: 'Striver A2Z',
    difficulty: 'Medium',
    recommendedMonth: 'Sem 2 (M11–12)',
    url: 'https://leetcode.com/problems/minimum-path-sum/'
  },
  {
    problemId: 'partition-equal-subset-sum',
    title: 'Partition Equal Subset Sum (0/1 Subset Sum Target)',
    pattern: 'Dynamic Programming',
    subPattern: '11.3 DP on Subsequences & Knapsack',
    striverStep: 'Step 16.4 · DP on Subsequences',
    sourceSheet: 'Striver A2Z + NeetCode 150',
    difficulty: 'Medium',
    recommendedMonth: 'Sem 2 (M11–12)',
    url: 'https://leetcode.com/problems/partition-equal-subset-sum/'
  },
  {
    problemId: 'coin-change',
    title: 'Coin Change I & II (Unbounded Knapsack)',
    pattern: 'Dynamic Programming',
    subPattern: '11.3 DP on Subsequences & Knapsack',
    striverStep: 'Step 16.4 · DP on Subsequences',
    sourceSheet: 'Striver A2Z + NeetCode 150',
    difficulty: 'Medium',
    recommendedMonth: 'Sem 2 (M11–12)',
    url: 'https://leetcode.com/problems/coin-change/'
  },
  {
    problemId: 'target-sum-dp',
    title: 'Target Sum (Count Partitions With Given Difference)',
    pattern: 'Dynamic Programming',
    subPattern: '11.3 DP on Subsequences & Knapsack',
    striverStep: 'Step 16.4 · DP on Subsequences',
    sourceSheet: 'Striver A2Z + NeetCode 150',
    difficulty: 'Medium',
    recommendedMonth: 'Sem 2 (M11–12)',
    url: 'https://leetcode.com/problems/target-sum/'
  },
  {
    problemId: 'longest-common-subsequence',
    title: 'Longest Common Subsequence (LCS)',
    pattern: 'Dynamic Programming',
    subPattern: '11.4 DP on Strings',
    striverStep: 'Step 16.5 · DP on Strings',
    sourceSheet: 'Striver A2Z + NeetCode 150',
    difficulty: 'Medium',
    recommendedMonth: 'Sem 2 (M11–12)',
    url: 'https://leetcode.com/problems/longest-common-subsequence/'
  },
  {
    problemId: 'edit-distance',
    title: 'Edit Distance (Insert / Delete / Replace)',
    pattern: 'Dynamic Programming',
    subPattern: '11.4 DP on Strings',
    striverStep: 'Step 16.5 · DP on Strings',
    sourceSheet: 'Striver A2Z + NeetCode 150',
    difficulty: 'Medium',
    recommendedMonth: 'Sem 2 (M11–12)',
    url: 'https://leetcode.com/problems/edit-distance/'
  },
  {
    problemId: 'best-time-to-buy-sell-stock-iii',
    title: 'Best Time to Buy and Sell Stock II, III, IV & Cooldown',
    pattern: 'Dynamic Programming',
    subPattern: '11.5 DP on Stocks & LIS & MCM Partition',
    striverStep: 'Step 16.6 · DP on Stocks',
    sourceSheet: 'Striver A2Z + NeetCode 150',
    difficulty: 'Hard',
    recommendedMonth: 'Sem 2 (M11–12)',
    url: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iii/'
  },
  {
    problemId: 'longest-increasing-subsequence',
    title: 'Longest Increasing Subsequence (DP & O(N log N) Binary Search)',
    pattern: 'Dynamic Programming',
    subPattern: '11.5 DP on Stocks & LIS & MCM Partition',
    striverStep: 'Step 16.7 · DP on LIS',
    sourceSheet: 'Striver A2Z + NeetCode 150',
    difficulty: 'Medium',
    recommendedMonth: 'Sem 2 (M11–12)',
    url: 'https://leetcode.com/problems/longest-increasing-subsequence/'
  },
  {
    problemId: 'burst-balloons-mcm',
    title: 'Burst Balloons (Matrix Chain Multiplication / Partition DP)',
    pattern: 'Dynamic Programming',
    subPattern: '11.5 DP on Stocks & LIS & MCM Partition',
    striverStep: 'Step 16.8 · MCM / Partition DP',
    sourceSheet: 'Striver A2Z + NeetCode 150',
    difficulty: 'Hard',
    recommendedMonth: 'Sem 2 (M11–12)',
    url: 'https://leetcode.com/problems/burst-balloons/'
  },

  // ============================================================================
  // PATTERN 12: GREEDY, INTERVALS & BIT MANIPULATION (Striver Step 8 & 12)
  // ============================================================================
  {
    problemId: 'maximum-subarray',
    title: 'Maximum Subarray (Kadane’s Algorithm)',
    pattern: 'Greedy & Intervals',
    subPattern: '12.1 Kadane & Greedy Reachability',
    striverStep: 'Step 3.2 & Step 12 · Kadane / Greedy',
    sourceSheet: 'Striver A2Z + NeetCode 150',
    difficulty: 'Medium',
    recommendedMonth: 'Month 2',
    url: 'https://leetcode.com/problems/maximum-subarray/'
  },
  {
    problemId: 'jump-game',
    title: 'Jump Game I & II',
    pattern: 'Greedy & Intervals',
    subPattern: '12.1 Kadane & Greedy Reachability',
    striverStep: 'Step 12.2 · Greedy Medium/Hard',
    sourceSheet: 'Striver A2Z + NeetCode 150',
    difficulty: 'Medium',
    recommendedMonth: 'Sem 3',
    url: 'https://leetcode.com/problems/jump-game/'
  },
  {
    problemId: 'merge-intervals',
    title: 'Merge Intervals',
    pattern: 'Greedy & Intervals',
    subPattern: '12.2 Interval Sweep-Line & Scheduling',
    striverStep: 'Step 3.3 & Step 12.2 · Intervals',
    sourceSheet: 'Striver A2Z + NeetCode 150',
    difficulty: 'Medium',
    recommendedMonth: 'Month 2',
    url: 'https://leetcode.com/problems/merge-intervals/'
  },
  {
    problemId: 'insert-interval',
    title: 'Insert Interval',
    pattern: 'Greedy & Intervals',
    subPattern: '12.2 Interval Sweep-Line & Scheduling',
    striverStep: 'Step 12.2 · Greedy Intervals',
    sourceSheet: 'Striver A2Z + NeetCode 150',
    difficulty: 'Medium',
    recommendedMonth: 'Sem 3',
    url: 'https://leetcode.com/problems/insert-interval/'
  },
  {
    problemId: 'non-overlapping-intervals',
    title: 'Non-overlapping Intervals (Earliest End-Time Greedy)',
    pattern: 'Greedy & Intervals',
    subPattern: '12.2 Interval Sweep-Line & Scheduling',
    striverStep: 'Step 12.2 · Greedy Intervals',
    sourceSheet: 'Striver A2Z + NeetCode 150',
    difficulty: 'Medium',
    recommendedMonth: 'Sem 3',
    url: 'https://leetcode.com/problems/non-overlapping-intervals/'
  }
];

export const DSA_PATTERNS_LIST = [
  'Arrays & Hashing',
  'Two Pointers',
  'Sliding Window',
  'Binary Search',
  'Stack',
  'Linked List',
  'Trees',
  'Backtracking',
  'Heap / Priority Queue',
  'Tries',
  'Graphs',
  'Dynamic Programming',
  'Greedy & Intervals',
  'Bit Manipulation & Math'
];

// 5. CS Fundamentals & Aptitude Modules
export const CS_FUNDAMENTALS_TOPICS: CsFundamentalTopic[] = [
  {
    id: 'cs_java_memory',
    subject: 'Java & OOP',
    semesterTarget: 'Sem 1 (Months 1–2)',
    title: 'JVM Architecture, Stack vs Heap Memory & Garbage Collection',
    keyConcepts: 'Bytecode execution, reference vs primitive storage, String pool immutability',
    inClassNote: 'Pair with Abdul Bari lectures & Week 1 Java check'
  },
  {
    id: 'cs_java_oop_pillars',
    subject: 'Java & OOP',
    semesterTarget: 'Sem 1 (Months 1–2)',
    title: 'Four Pillars of OOP: Encapsulation, Inheritance, Polymorphism, Abstraction',
    keyConcepts: 'Abstract classes vs Interfaces, method overloading vs overriding, dynamic dispatch',
    inClassNote: 'Apply directly inside Project 1 (Java console app)'
  },
  {
    id: 'cs_java_collections',
    subject: 'Java & OOP',
    semesterTarget: 'Sem 1 (Month 2)',
    title: 'Java Collections Internals: HashMap Hashing, Collision Handling & Fail-Fast Iterators',
    keyConcepts: 'hashCode() & equals() contract, load factor 0.75, red-black tree bucket threshold',
    inClassNote: 'Favourite FAANG Java interview deep-dive question'
  },
  {
    id: 'cs_math_logic',
    subject: 'Discrete Maths & Logic',
    semesterTarget: 'Sem 1 (Class Hours)',
    title: 'Propositional Logic, Set Theory, Permutations & Combinations',
    keyConcepts: 'Truth tables, De Morgan’s laws, pigeonhole principle, counting & probability',
    inClassNote: 'Master during college syllabus lectures — zero extra time needed outside class'
  },
  {
    id: 'cs_math_induction',
    subject: 'Discrete Maths & Logic',
    semesterTarget: 'Sem 1–2 (Class Hours)',
    title: 'Mathematical Induction, Recurrence Relations & Master Theorem',
    keyConcepts: 'Bounding recursion tree complexity for Merge Sort, Binary Search, and Backtracking',
    inClassNote: 'Directly reinforces DSA time complexity analysis'
  },
  {
    id: 'cs_os_processes',
    subject: 'Operating Systems',
    semesterTarget: 'Sem 2 (Months 9–10)',
    title: 'Processes, Threads, Context Switching & Concurrency Primitives',
    keyConcepts: 'Process PCB, user vs kernel threads, mutex, semaphores, race conditions',
    inClassNote: 'Cover in college OS classes + test with Java multithreading basics'
  },
  {
    id: 'cs_os_deadlocks_mem',
    subject: 'Operating Systems',
    semesterTarget: 'Sem 2 (Months 9–10)',
    title: 'Deadlocks (Coffman Conditions) & Virtual Memory (Paging, TLB, Thrashing)',
    keyConcepts: 'Page replacement algorithms (LRU, Optimal), segmentation, demand paging',
    inClassNote: 'Connect LRU page replacement directly to your LeetCode 146 LRU Cache implementation'
  },
  {
    id: 'cs_dbms_acid_index',
    subject: 'DBMS',
    semesterTarget: 'Sem 2 (Months 7–8)',
    title: 'ACID Properties, Transaction Isolation Levels & B+ Tree Indexing',
    keyConcepts: 'Dirty reads, phantom reads, clustered vs non-clustered indexes, query execution plans',
    inClassNote: 'Apply in Project 3 backend database schema design'
  },
  {
    id: 'cs_dbms_norm_sql',
    subject: 'DBMS',
    semesterTarget: 'Sem 2 (Months 7–8)',
    title: 'Relational Normalization (1NF–BCNF) & Analytical SQL Queries',
    keyConcepts: 'Functional dependencies, lossless joins, window functions, GROUP BY & HAVING',
    inClassNote: 'Cover during DBMS lab hours'
  },
  {
    id: 'cs_cn_tcp_http',
    subject: 'Computer Networks',
    semesterTarget: 'Sem 3 (Months 13–15)',
    title: 'TCP 3-Way Handshake, UDP, HTTP/1.1 vs HTTP/2 vs HTTP/3 & TLS Handshake',
    keyConcepts: 'Flow control, congestion control, stateless vs stateful protocols, REST semantics',
    inClassNote: 'Essential for FAANG internship technical screens'
  },
  {
    id: 'cs_cn_dns_routing',
    subject: 'Computer Networks',
    semesterTarget: 'Sem 3 (Months 13–15)',
    title: 'DNS Resolution, IP Addressing, Subnetting, NAT & Load Balancers',
    keyConcepts: 'Recursive vs iterative DNS lookup, ARP, Layer 4 vs Layer 7 load balancing',
    inClassNote: 'Bridges Computer Networks with System Design basics'
  },
  {
    id: 'cs_apt_quant',
    subject: 'Aptitude & Puzzles',
    semesterTarget: 'Ongoing (15m 4x/week)',
    title: 'IndiaBix Core Quantitative: Percentages, Ratios, Time & Work, Speed & Distance',
    keyConcepts: 'Mental math speed, relative speed, work efficiency ratios',
    inClassNote: '15 minutes 4 days a week or during free college periods'
  },
  {
    id: 'cs_apt_logic',
    subject: 'Aptitude & Puzzles',
    semesterTarget: 'Ongoing (1 Puzzle/week)',
    title: 'Weekly Paper Logic Puzzles & Syllogisms / Seating / Blood Relations',
    keyConcepts: 'Constraint satisfaction on paper without jumping to trial-and-error',
    inClassNote: 'Sharpens raw problem-solving intuition for novel interview questions'
  }
];
