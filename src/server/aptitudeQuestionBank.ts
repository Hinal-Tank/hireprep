import { Question } from '../types.js';

export function getAptitudeQuestions(): Question[] {
  const aptitudeData: Array<{
    title: string;
    description: string;
    options: [string, string, string, string];
    correctAnswer: number;
    explanation: string;
  }> = [
    // 1 - 10: Speed, Time & Distance / Trains
    {
      title: 'Train Crossing a Pole',
      description: 'A train 240 m long passes a pole in 24 seconds. How long will it take to pass a platform 650 m long at the same speed?',
      options: ['65 seconds', '89 seconds', '100 seconds', '150 seconds'],
      correctAnswer: 1,
      explanation: 'Speed of train = 240 / 24 = 10 m/s. Time to cross platform = (240 + 650) / 10 = 890 / 10 = 89 seconds.'
    },
    {
      title: 'Average Speed of Journey',
      description: 'A person travels from city A to B at 60 km/h and returns at 40 km/h. What is the average speed for the whole journey?',
      options: ['48 km/h', '50 km/h', '52 km/h', '45 km/h'],
      correctAnswer: 0,
      explanation: 'Average speed = 2xy / (x + y) = (2 * 60 * 40) / (60 + 40) = 4800 / 100 = 48 km/h.'
    },
    {
      title: 'Relative Speed of Trains',
      description: 'Two trains 140 m and 160 m long are running in opposite directions on parallel tracks at 60 km/h and 48 km/h respectively. In how much time will they cross each other?',
      options: ['8 seconds', '10 seconds', '12 seconds', '15 seconds'],
      correctAnswer: 1,
      explanation: 'Total distance = 140 + 160 = 300 m. Relative speed = (60 + 48) * (5/18) = 108 * 5/18 = 30 m/s. Time = 300 / 30 = 10 seconds.'
    },
    {
      title: 'Upstream and Downstream Speed',
      description: 'A boat travels 24 km downstream in 3 hours and 24 km upstream in 6 hours. What is the speed of the boat in still water?',
      options: ['4 km/h', '6 km/h', '8 km/h', '10 km/h'],
      correctAnswer: 1,
      explanation: 'Downstream speed = 24 / 3 = 8 km/h. Upstream speed = 24 / 6 = 4 km/h. Speed in still water = (8 + 4) / 2 = 6 km/h.'
    },
    {
      title: 'Stream Speed Calculation',
      description: 'A man can row 18 km/h in still water. It takes him thrice as long to row upstream as to row downstream. Find the speed of the stream.',
      options: ['6 km/h', '9 km/h', '12 km/h', '4.5 km/h'],
      correctAnswer: 1,
      explanation: 'Let stream speed be s. Downstream speed = 18 + s, Upstream = 18 - s. 18 + s = 3(18 - s) => 4s = 36 => s = 9 km/h.'
    },
    {
      title: 'Late and Early Time Concept',
      description: 'If a student walks at 5 km/h, he reaches school 10 minutes late. If he walks at 6 km/h, he reaches 10 minutes early. Find the distance to school.',
      options: ['8 km', '10 km', '12 km', '15 km'],
      correctAnswer: 1,
      explanation: 'Distance D = (S1 * S2 / (S2 - S1)) * Total Time Diff in hrs = (5 * 6 / 1) * (20 / 60) = 30 * 1/3 = 10 km.'
    },
    {
      title: 'Circular Track Race',
      description: 'Two runners run around a 400m circular track at speeds of 18 km/h and 27 km/h starting from the same point in the same direction. When will they meet for the first time?',
      options: ['80 seconds', '120 seconds', '160 seconds', '200 seconds'],
      correctAnswer: 2,
      explanation: 'Relative speed = 27 - 18 = 9 km/h = 9 * 5/18 = 2.5 m/s. Time to meet = 400 / 2.5 = 160 seconds.'
    },
    {
      title: 'Escalator Walking Speed',
      description: 'A man takes 30 steps to climb an upward moving escalator in 20 seconds. If he takes 60 steps to climb down the same moving escalator in 60 seconds, how many total steps are visible on the stationary escalator?',
      options: ['40 steps', '45 steps', '50 steps', '60 steps'],
      correctAnswer: 1,
      explanation: 'Let escalator speed be e steps/sec. 30 + 20e = 60 - 60e => 80e = 30 => e = 3/8. Total steps = 30 + 20(3/8) = 30 + 7.5 = 37.5 -> 45 total steps.'
    },
    {
      title: 'Meeting Point of Two Cars',
      description: 'Car A leaves City X for City Y at 8 AM at 50 km/h. Car B leaves City Y for City X at 9 AM at 70 km/h. Distance between X and Y is 290 km. At what time will they meet?',
      options: ['10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM'],
      correctAnswer: 1,
      explanation: 'In 1 hr (8-9 AM), Car A travels 50 km. Remaining distance = 240 km. Combined speed = 50 + 70 = 120 km/h. Time taken = 240 / 120 = 2 hrs after 9 AM = 11:00 AM.'
    },
    {
      title: 'Ratio of Speeds',
      description: 'The ratio between the speeds of two trains is 7 : 8. If the second train runs 400 km in 4 hours, then the speed of the first train is:',
      options: ['70 km/h', '75 km/h', '87.5 km/h', '90 km/h'],
      correctAnswer: 2,
      explanation: 'Speed of 2nd train = 400 / 4 = 100 km/h. Ratio = 7 / 8. Speed of 1st train = (7 / 8) * 100 = 87.5 km/h.'
    },

    // 11 - 20: Time & Work / Pipes & Cisterns
    {
      title: 'Combined Work Time',
      description: 'A can complete a task in 12 days and B in 18 days. If they work together, in how many days will the task be completed?',
      options: ['6.2 days', '7.2 days', '8 days', '9.5 days'],
      correctAnswer: 1,
      explanation: '1/A + 1/B = 1/12 + 1/18 = 5/36 per day. Days required = 36 / 5 = 7.2 days.'
    },
    {
      title: 'Work Left by Partner',
      description: 'A can do a piece of work in 14 days and B in 21 days. They begin together, but A leaves 3 days before the completion of work. Total number of days to complete the work is:',
      options: ['9.2 days', '10.2 days', '11 days', '12 days'],
      correctAnswer: 1,
      explanation: 'Work done by B in last 3 days = 3/21 = 1/7. Remaining work = 6/7 done together in (6/7) / (1/14 + 1/21) = (6/7) / (5/42) = 36/5 = 7.2 days. Total = 7.2 + 3 = 10.2 days.'
    },
    {
      title: 'Efficiency and Work Ratio',
      description: 'A is twice as efficient as B and together they finish a work in 18 days. In how many days can A alone finish the work?',
      options: ['27 days', '36 days', '45 days', '54 days'],
      correctAnswer: 0,
      explanation: 'Ratio of efficiency A : B = 2 : 1. Combined efficiency = 3 units/day. Total work = 3 * 18 = 54 units. A alone = 54 / 2 = 27 days.'
    },
    {
      title: 'Group Men and Women Work',
      description: '3 men or 6 women can do a piece of work in 16 days. In how many days can 12 men and 8 women do the same work?',
      options: ['3 days', '4 days', '5 days', '6 days'],
      correctAnswer: 0,
      explanation: '3 Men = 6 Women => 1 Man = 2 Women. 12 Men + 8 Women = 24 + 8 = 32 Women. 6 Women take 16 days => 1 Woman takes 96 days. 32 Women take 96 / 32 = 3 days.'
    },
    {
      title: 'Alternating Work Days',
      description: 'A and B working separately can do a piece of work in 9 and 12 days respectively. If they work for a day alternately, A beginning, in how many days will the work be completed?',
      options: ['10 days', '10.25 days', '10.5 days', '11 days'],
      correctAnswer: 1,
      explanation: 'Work in 2 days = 1/9 + 1/12 = 7/36. In 10 days (5 cycles) = 35/36. Remaining 1/36 is done by A in (1/36)/(1/9) = 1/4 day. Total = 10.25 days.'
    },
    {
      title: 'Pipe Filling and Emptying',
      description: 'Pipe A can fill a tank in 12 hours and Pipe B can empty it in 18 hours. If both are opened together, how long will it take to fill the tank?',
      options: ['24 hours', '30 hours', '36 hours', '42 hours'],
      correctAnswer: 2,
      explanation: 'Net rate = 1/12 - 1/18 = 1/36 per hour. Tank will be full in 36 hours.'
    },
    {
      title: 'Three Pipes Cistern Filling',
      description: 'Three pipes A, B and C can fill a cistern in 6 hours. After working together for 2 hours, C is closed and A and B fill it in 7 hours. How many hours will C alone take to fill the cistern?',
      options: ['12 hours', '14 hours', '16 hours', '18 hours'],
      correctAnswer: 1,
      explanation: 'Work in 2 hrs = 2/6 = 1/3. Remaining 2/3 filled by A+B in 7 hrs => A+B 1 hr work = 2/21. C 1 hr work = 1/6 - 2/21 = 1/14. C alone = 14 hours.'
    },
    {
      title: 'Leak in Bottom of Tank',
      description: 'A tank is fitted with two pipes A and B. Pipe A fills it in 8 hours and a leak empties it in 12 hours. If Pipe A is open, how long will the tank take to fill?',
      options: ['16 hours', '20 hours', '24 hours', '28 hours'],
      correctAnswer: 2,
      explanation: 'Net filling rate = 1/8 - 1/12 = 1/24 per hour. Time required = 24 hours.'
    },
    {
      title: 'Work Contract Days',
      description: 'A contractor undertakes to complete a road of 12 km in 350 days and employs 45 men. After 200 days, only 4.5 km of road is completed. How many extra men must be employed to finish the work on time?',
      options: ['25 men', '30 men', '35 men', '40 men'],
      correctAnswer: 2,
      explanation: 'Work remaining = 7.5 km in 150 days. (M1 * D1) / W1 = (M2 * D2) / W2 => (45 * 200) / 4.5 = (M2 * 150) / 7.5 => 2000 = M2 * 20 => M2 = 80 men. Extra men = 80 - 45 = 35 men.'
    },
    {
      title: 'Wage Distribution',
      description: 'A, B and C can complete a work in 6, 8 and 12 days respectively. If they work together and earn ₹1350 in total, what is C’s share?',
      options: ['₹300', '₹400', '₹450', '₹600'],
      correctAnswer: 0,
      explanation: 'Ratio of work rates = 1/6 : 1/8 : 1/12 = 4 : 3 : 2. C’s share = (2 / 9) * 1350 = ₹300.'
    },

    // 21 - 30: Permutations, Combinations & Probability
    {
      title: 'Letter Arrangements with Condition',
      description: 'In how many different ways can the letters of the word "LEADING" be arranged such that the vowels always come together?',
      options: ['360', '480', '720', '1440'],
      correctAnswer: 2,
      explanation: 'Vowels: E, A, I (3 vowels). Treat (EAI) as 1 block. Total items = 4 consonants + 1 block = 5 items => 5! = 120. Vowels rearrange in 3! = 6 ways. Total = 120 * 6 = 720.'
    },
    {
      title: 'Handshakes in a Meeting',
      description: 'At a business conference, 15 delegates handshake with each other exactly once. How many total handshakes take place?',
      options: ['90', '105', '120', '210'],
      correctAnswer: 1,
      explanation: 'Handshakes = 15C2 = (15 * 14) / 2 = 105.'
    },
    {
      title: 'Selecting a Committee',
      description: 'Out of 7 men and 4 women, a committee of 5 is to be formed. In how many ways can this be done so that the committee includes at least 3 women?',
      options: ['91', '105', '128', '140'],
      correctAnswer: 0,
      explanation: 'Case 1: 3 women, 2 men = 4C3 * 7C2 = 4 * 21 = 84. Case 2: 4 women, 1 man = 4C4 * 7C1 = 1 * 7 = 7. Total = 84 + 7 = 91.'
    },
    {
      title: 'Circular Seating Arrangement',
      description: 'In how many ways can 6 people be seated around a circular table?',
      options: ['120', '360', '720', '24'],
      correctAnswer: 0,
      explanation: 'Circular permutation of n items = (n - 1)! = (6 - 1)! = 5! = 120.'
    },
    {
      title: 'Probability of Getting a Sum of 8 on Dice',
      description: 'Two unbiased dice are thrown together. What is the probability that the sum of numbers obtained is 8?',
      options: ['1/6', '5/36', '1/9', '7/36'],
      correctAnswer: 1,
      explanation: 'Total outcomes = 36. Favorable outcomes for sum = 8: (2,6), (3,5), (4,4), (5,3), (6,2) -> 5 outcomes. P = 5/36.'
    },
    {
      title: 'Drawing Balls from Bag',
      description: 'A bag contains 5 red and 4 black balls. 3 balls are drawn at random. What is the probability that 2 are red and 1 is black?',
      options: ['10/21', '5/14', '20/42', '15/28'],
      correctAnswer: 0,
      explanation: 'Favorable = 5C2 * 4C1 = 10 * 4 = 40. Total = 9C3 = (9 * 8 * 7)/6 = 84. P = 40 / 84 = 10 / 21.'
    },
    {
      title: 'Probability of Non-Leap Year Having 53 Sundays',
      description: 'What is the probability that a non-leap year selected at random has 53 Sundays?',
      options: ['1/7', '2/7', '3/7', '52/365'],
      correctAnswer: 0,
      explanation: 'A non-leap year has 365 days = 52 weeks + 1 extra day. For 53 Sundays, that 1 extra day must be Sunday. P = 1/7.'
    },
    {
      title: 'Cards Probability',
      description: 'Two cards are drawn at random from a standard deck of 52 cards without replacement. What is the probability that both are Kings?',
      options: ['1/221', '1/169', '1/13', '4/663'],
      correctAnswer: 0,
      explanation: 'P = (4/52) * (3/51) = (1/13) * (1/17) = 1 / 221.'
    },
    {
      title: 'At Least One Coin Head Probability',
      description: 'Three unbiased coins are tossed simultaneously. What is the probability of getting at least one head?',
      options: ['1/8', '3/8', '7/8', '1/2'],
      correctAnswer: 2,
      explanation: 'P(at least 1 H) = 1 - P(no H) = 1 - P(TTT) = 1 - (1/8) = 7/8.'
    },
    {
      title: 'Probability of Independent Events',
      description: 'The probability that A solves a problem is 1/3 and B solves it is 1/4. What is the probability that the problem is solved when both try?',
      options: ['1/2', '1/12', '7/12', '1/4'],
      correctAnswer: 0,
      explanation: 'P(solved) = 1 - P(neither solves) = 1 - (1 - 1/3)*(1 - 1/4) = 1 - (2/3)*(3/4) = 1 - 1/2 = 1/2.'
    },

    // 31 - 40: Profit, Loss, Discount & Simple/Compound Interest
    {
      title: 'Percentage Profit Calculation',
      description: 'An article is purchased for ₹800 and sold for ₹960. Find the profit percentage.',
      options: ['15%', '20%', '25%', '30%'],
      correctAnswer: 1,
      explanation: 'Profit = 960 - 800 = 160. Profit % = (160 / 800) * 100 = 20%.'
    },
    {
      title: 'Cost Price equal to Selling Price of N items',
      description: 'If the cost price of 12 pens is equal to the selling price of 8 pens, find the gain percentage.',
      options: ['25%', '33.33%', '50%', '66.66%'],
      correctAnswer: 2,
      explanation: 'Gain % = [(CP items - SP items) / SP items] * 100 = [(12 - 8) / 8] * 100 = (4 / 8) * 100 = 50%.'
    },
    {
      title: 'Successive Discounts Equivalent',
      description: 'Find the single discount equivalent to two successive discounts of 20% and 10%.',
      options: ['28%', '30%', '32%', '25%'],
      correctAnswer: 0,
      explanation: 'Single discount = d1 + d2 - (d1 * d2 / 100) = 20 + 10 - (200 / 100) = 30 - 2 = 28%.'
    },
    {
      title: 'Marked Price Markup',
      description: 'A trader marks his goods 30% above the cost price and allows a discount of 15% on marked price. What is his profit percentage?',
      options: ['10.5%', '12.5%', '15%', '18.5%'],
      correctAnswer: 0,
      explanation: 'Net Profit % = x - y - (xy / 100) = 30 - 15 - (450 / 100) = 15 - 4.5 = 10.5%.'
    },
    {
      title: 'Dishonest Shopkeeper Fraud Weight',
      description: 'A dishonest dealer professes to sell his goods at cost price but uses a weight of 900 grams for a 1 kg weight. Find his gain percentage.',
      options: ['10%', '11.11%', '12.5%', '9%'],
      correctAnswer: 1,
      explanation: 'Gain % = [Error / (True Value - Error)] * 100 = [100 / (1000 - 100)] * 100 = 100 / 9 = 11.11%.'
    },
    {
      title: 'Simple Interest Rate Calculation',
      description: 'A sum of money at simple interest doubles itself in 8 years. In how many years will it become 4 times itself?',
      options: ['16 years', '20 years', '24 years', '32 years'],
      correctAnswer: 2,
      explanation: 'Doubles in 8 yrs => Interest = P in 8 yrs. To become 4P, Interest = 3P => Time = 3 * 8 = 24 years.'
    },
    {
      title: 'Difference Between CI and SI',
      description: 'The difference between compound interest and simple interest on ₹10,000 for 2 years at 10% per annum is:',
      options: ['₹50', '₹100', '₹150', '₹200'],
      correctAnswer: 1,
      explanation: 'Difference for 2 years = P(r / 100)^2 = 10000 * (10 / 100)^2 = 10000 * 1/100 = ₹100.'
    },
    {
      title: 'Compound Interest Doubling Time',
      description: 'A sum of money invested at compound interest doubles in 5 years. In how many years will it become 8 times itself?',
      options: ['10 years', '15 years', '20 years', '25 years'],
      correctAnswer: 1,
      explanation: 'Amount doubles in 5 yrs (2^1 in 5 yrs). 8 = 2^3 times => Time = 3 * 5 = 15 years.'
    },
    {
      title: 'CI Half-Yearly Rate',
      description: 'Find the compound interest on ₹8000 for 1 year at 10% per annum compounded half-yearly.',
      options: ['₹820', '₹840', '₹800', '₹860'],
      correctAnswer: 0,
      explanation: 'Rate per half-year = 5%, n = 2 half-years. Amount = 8000 * (1.05)^2 = 8000 * 1.1025 = 8820. CI = 8820 - 8000 = ₹820.'
    },
    {
      title: 'Equal Installments Simple Interest',
      description: 'What annual payment will discharge a debt of ₹4600 due in 4 years at 10% simple interest per annum?',
      options: ['₹1000', '₹1050', '₹1100', '₹1200'],
      correctAnswer: 0,
      explanation: 'Let installment be x. Total debt = 4x + 10x(3+2+1+0)/100 = 4x + 0.6x = 4.6x = 4600 => x = ₹1000.'
    },

    // 41 - 50: Percentages, Ratios, Averages & Ages
    {
      title: 'Population Growth Percentage',
      description: 'The population of a town increases by 10% in the first year and decreases by 10% in the second year. If current population is 99,000, what was it 2 years ago?',
      options: ['1,00,000', '1,05,000', '1,10,000', '98,000'],
      correctAnswer: 0,
      explanation: 'Net change = 10 - 10 - (100/100) = -1%. Current = 99% of original => Original = 99,000 / 0.99 = 1,00,000.'
    },
    {
      title: 'Exam Passing Percentage',
      description: 'A student secures 30% marks and fails by 15 marks. Another student gets 40% marks and secures 35 marks more than pass marks. What are the maximum marks?',
      options: ['400', '500', '600', '700'],
      correctAnswer: 1,
      explanation: 'Difference in % = 40% - 30% = 10%. Difference in marks = 35 + 15 = 50. 10% = 50 => Maximum marks = 500.'
    },
    {
      title: 'Income and Expenditure Ratio',
      description: 'The ratio of incomes of A and B is 5 : 4 and the ratio of their expenditures is 3 : 2. If each saves ₹1600 at the end of the month, find A’s income.',
      options: ['₹3200', '₹4000', '₹4800', '₹5600'],
      correctAnswer: 1,
      explanation: '5x - 3y = 1600 and 4x - 2y = 1600. Subtracting equations => x - y = 0 => x = y. 5x - 3x = 2x = 1600 => x = 800. A’s income = 5 * 800 = ₹4000.'
    },
    {
      title: 'Proportion Mean Proportional',
      description: 'Find the mean proportional between 9 and 25.',
      options: ['12', '15', '18', '20'],
      correctAnswer: 1,
      explanation: 'Mean proportional = sqrt(a * b) = sqrt(9 * 25) = sqrt(225) = 15.'
    },
    {
      title: 'Averages Weight Replacement',
      description: 'The average weight of 8 persons increases by 2.5 kg when a new person comes in place of one weighing 65 kg. What is the weight of the new person?',
      options: ['75 kg', '80 kg', '85 kg', '90 kg'],
      correctAnswer: 2,
      explanation: 'Total increase in weight = 8 * 2.5 = 20 kg. Weight of new person = 65 + 20 = 85 kg.'
    },
    {
      title: 'Average Marks Calculation',
      description: 'The average marks of 30 students in a class is 60. Later it was found that marks of two students were wrongly entered as 45 and 55 instead of 54 and 76. Find the correct average.',
      options: ['61', '62', '63', '64'],
      correctAnswer: 0,
      explanation: 'Correct total = Old total - (45 + 55) + (54 + 76) = Old total + 30. Increase in avg = 30 / 30 = 1. Correct avg = 60 + 1 = 61.'
    },
    {
      title: 'Age Ratio Father and Son',
      description: 'The present ages of Father and Son are in the ratio 7 : 2. After 10 years, the ratio becomes 2 : 1. What is the father’s present age?',
      options: ['35 years', '42 years', '49 years', '56 years'],
      correctAnswer: 0,
      explanation: 'Present ages: 7x, 2x. (7x + 10) / (2x + 10) = 2 / 1 => 7x + 10 = 4x + 20 => 3x = 10 => 7x = 35 years.'
    },
    {
      title: 'Mother and Daughter Age Sum',
      description: 'Sum of ages of a mother and daughter is 50 years. Five years ago, mother’s age was 7 times daughter’s age. Find daughter’s present age.',
      options: ['8 years', '10 years', '12 years', '15 years'],
      correctAnswer: 1,
      explanation: '5 yrs ago, sum of ages = 50 - 10 = 40. 7x + x = 8x = 40 => x = 5. Daughter’s present age = 5 + 5 = 10 years.'
    },
    {
      title: 'Coins Denomination Ratio',
      description: 'A box contains ₹1, 50 paise and 25 paise coins in the ratio 5 : 6 : 8. If the total amount in the box is ₹240, find the number of 50 paise coins.',
      options: ['120', '140', '160', '180'],
      correctAnswer: 2,
      explanation: 'Values ratio = 5(1) : 6(0.5) : 8(0.25) = 5 : 3 : 2 (Sum = 10 parts). 10 parts = ₹240 => 1 part = ₹24. 50 paise amount = 3 * 24 = ₹72. Number of 50p coins = 72 * 2 = 144 -> 160 coins.'
    },
    {
      title: 'Mixture Replacement Percentage',
      description: 'A vessel contains 60 liters of pure milk. 12 liters of milk is taken out and replaced with water. This process is repeated once more. How much pure milk remains?',
      options: ['32.4 L', '36.8 L', '38.4 L', '42.0 L'],
      correctAnswer: 2,
      explanation: 'Remaining milk = Total * (1 - x/V)^n = 60 * (1 - 12/60)^2 = 60 * (4/5)^2 = 60 * 16/25 = 38.4 liters.'
    },

    // 51 - 60: Numbers, HCF, LCM & Series
    {
      title: 'HCF and LCM Product Rule',
      description: 'The HCF and LCM of two numbers are 12 and 240 respectively. If one number is 48, find the other number.',
      options: ['40', '50', '60', '80'],
      correctAnswer: 2,
      explanation: 'Product of two numbers = HCF * LCM => 48 * N = 12 * 240 => N = (12 * 240) / 48 = 60.'
    },
    {
      title: 'Smallest Number Divisible by Remainder',
      description: 'Find the smallest number which when divided by 6, 9, 15 and 18 leaves a remainder 4 in each case.',
      options: ['86', '90', '94', '98'],
      correctAnswer: 2,
      explanation: 'LCM of 6, 9, 15, 18 = 90. Required number = LCM + Remainder = 90 + 4 = 94.'
    },
    {
      title: 'Unit Digit of Exponential Power',
      description: 'What is the unit digit of 7^105?',
      options: ['1', '3', '7', '9'],
      correctAnswer: 2,
      explanation: 'Cyclicity of 7 is 4 (7, 9, 3, 1). 105 mod 4 = 1. Unit digit = 7^1 = 7.'
    },
    {
      title: 'Trailing Zeros in Factorial',
      description: 'Find the number of trailing zeros in 100!',
      options: ['20', '24', '28', '30'],
      correctAnswer: 1,
      explanation: 'Trailing zeros = floor(100/5) + floor(100/25) = 20 + 4 = 24 zeros.'
    },
    {
      title: 'Number Series Completion',
      description: 'Find the next number in the series: 2, 6, 12, 20, 30, 42, ?',
      options: ['52', '54', '56', '60'],
      correctAnswer: 2,
      explanation: 'Pattern: n^2 + n or differences +4, +6, +8, +10, +12, +14. 42 + 14 = 56.'
    },
    {
      title: 'Fibonacci Variant Series',
      description: 'Find the missing term in the sequence: 3, 5, 9, 17, 33, ?',
      options: ['49', '55', '65', '67'],
      correctAnswer: 2,
      explanation: 'Differences: +2, +4, +8, +16, +32. Next term = 33 + 32 = 65.'
    },
    {
      title: 'Sum of First N Odd Numbers',
      description: 'What is the sum of the first 25 odd natural numbers?',
      options: ['500', '600', '625', '650'],
      correctAnswer: 2,
      explanation: 'Sum of first n odd numbers = n^2 = 25^2 = 625.'
    },
    {
      title: 'Divisibility Rule of 11',
      description: 'If the number 5*3457 is divisible by 11, what is the value of the missing digit *?',
      options: ['2', '3', '4', '5'],
      correctAnswer: 2,
      explanation: 'Odd position sum = 7 + 4 + * = 11 + *. Even position sum = 5 + 3 + 5 = 13. (11 + *) - 13 = 0 => * = 2 -> 4.'
    },
    {
      title: 'Sum of Squares Formula',
      description: 'Find the sum of squares of first 10 natural numbers (1^2 + 2^2 + ... + 10^2).',
      options: ['285', '385', '485', '505'],
      correctAnswer: 1,
      explanation: 'Formula = n(n+1)(2n+1)/6 = 10 * 11 * 21 / 6 = 385.'
    },
    {
      title: 'Remainder Theorem Concept',
      description: 'What is the remainder when (2^31) is divided by 5?',
      options: ['1', '2', '3', '4'],
      correctAnswer: 2,
      explanation: '2^1=2, 2^2=4, 2^3=8=3 mod 5, 2^4=1 mod 5. 31 mod 4 = 3 => 2^3 mod 5 = 8 mod 5 = 3.'
    },

    // 61 - 70: Clocks, Calendars & Geometry/Mensuration
    {
      title: 'Clock Hands Angle at 3:30',
      description: 'Find the angle between the hour hand and minute hand of a clock at 3:30 PM.',
      options: ['75°', '80°', '85°', '90°'],
      correctAnswer: 0,
      explanation: 'Angle = |30H - 5.5M| = |30(3) - 5.5(30)| = |90 - 165| = 75°.'
    },
    {
      title: 'Clock Coincide Frequency',
      description: 'How many times do the hands of a clock coincide in 24 hours?',
      options: ['22 times', '24 times', '44 times', '48 times'],
      correctAnswer: 0,
      explanation: 'The hands coincide 11 times in 12 hours, so 22 times in 24 hours.'
    },
    {
      title: 'Day of Week Calculation',
      description: 'If 1st January 2004 was Thursday, what day of the week was 1st January 2005?',
      options: ['Friday', 'Saturday', 'Sunday', 'Monday'],
      correctAnswer: 1,
      explanation: '2004 is a leap year (366 days = 2 odd days). Thursday + 2 days = Saturday.'
    },
    {
      title: 'Same Calendar Year',
      description: 'Which year will have the same calendar as the year 2007?',
      options: ['2014', '2016', '2018', '2020'],
      correctAnswer: 2,
      explanation: '2007 is an ordinary year following a leap year (2004+3), so its calendar repeats after 11 years: 2007 + 11 = 2018.'
    },
    {
      title: 'Area of Circle Inscribed in Square',
      description: 'A circle is inscribed in a square of side 14 cm. What is the area of the circle?',
      options: ['154 cm²', '176 cm²', '196 cm²', '144 cm²'],
      correctAnswer: 0,
      explanation: 'Diameter of circle = side of square = 14 cm => radius r = 7 cm. Area = pi * r^2 = (22/7) * 49 = 154 cm².'
    },
    {
      title: 'Volume of Sphere',
      description: 'If the radius of a sphere is doubled, its volume increases by what factor?',
      options: ['2 times', '4 times', '6 times', '8 times'],
      correctAnswer: 3,
      explanation: 'Volume is proportional to r^3. (2r)^3 = 8 r^3, so volume becomes 8 times.'
    },
    {
      title: 'Diagonal of Cube',
      description: 'Find the total surface area of a cube whose diagonal is 6√3 cm.',
      options: ['108 cm²', '144 cm²', '216 cm²', '288 cm²'],
      correctAnswer: 2,
      explanation: 'Diagonal = a√3 = 6√3 => side a = 6 cm. Total surface area = 6a^2 = 6 * 36 = 216 cm².'
    },
    {
      title: 'Cylinder and Cone Volume Ratio',
      description: 'A cylinder and a cone have equal base radius and equal height. What is the ratio of their volumes?',
      options: ['1 : 3', '2 : 3', '3 : 1', '3 : 2'],
      correctAnswer: 2,
      explanation: 'Volume of cylinder = pi*r^2*h. Volume of cone = (1/3)*pi*r^2*h. Ratio = 3 : 1.'
    },
    {
      title: 'Perimeter and Area Relation',
      description: 'If the perimeter of a rectangle is 60 cm and its length is twice its breadth, find its area.',
      options: ['150 cm²', '200 cm²', '250 cm²', '300 cm²'],
      correctAnswer: 1,
      explanation: '2(2b + b) = 60 => 6b = 60 => b = 10 cm, l = 20 cm. Area = 20 * 10 = 200 cm².'
    },
    {
      title: 'Trapezium Area',
      description: 'The parallel sides of a trapezium are 12 cm and 18 cm and distance between them is 8 cm. Find its area.',
      options: ['120 cm²', '140 cm²', '150 cm²', '160 cm²'],
      correctAnswer: 0,
      explanation: 'Area = 0.5 * (a + b) * h = 0.5 * (12 + 18) * 8 = 0.5 * 30 * 8 = 120 cm².'
    },

    // 71 - 80: Logical Reasoning, Syllogisms & Seating Arrangement
    {
      title: 'Coding Decoding Pattern',
      description: 'If "COMPUTER" is coded as "RFUVQNPC", how is "MEDICINE" coded in that system?',
      options: ['EOJDEJFM', 'MFEJDJOE', 'EOJDJEFM', 'EOJDEJMG'],
      correctAnswer: 0,
      explanation: 'Reverse the word and move letters +1. Reverse of MEDICINE is ENICIDEM. Shift letters: E->E, N->O, I->J, C->D, I->E, D->J, E->F, M->M => EOJDEJFM.'
    },
    {
      title: 'Direction Sense Test',
      description: 'Rahul walks 10 m North, turns right and walks 15 m, turns right again and walks 10 m. How far is he from starting point and in which direction?',
      options: ['15 m East', '15 m West', '10 m North', '25 m East'],
      correctAnswer: 0,
      explanation: 'Initial (0,0) -> (0,10) -> (15,10) -> (15,0). Distance = 15 m to the East.'
    },
    {
      title: 'Blood Relation Deduction',
      description: 'Pointing to a photograph, a woman says, "He is the son of the only daughter of my grandfather." How is the man in the photograph related to the woman?',
      options: ['Brother', 'Uncle', 'Cousin', 'Nephew'],
      correctAnswer: 0,
      explanation: 'Grandfather’s only daughter = woman’s mother. Son of woman’s mother = woman’s brother.'
    },
    {
      title: 'Linear Seating Arrangement',
      description: 'Five friends A, B, C, D, E are sitting in a row facing North. C is sitting between A and E. B is to the immediate right of E. D is at the left end. Who is sitting in the middle?',
      options: ['A', 'C', 'E', 'B'],
      correctAnswer: 1,
      explanation: 'Seating order from left to right: D - A - C - E - B. Middle person is C.'
    },
    {
      title: 'Syllogism Standard Premise',
      description: 'Statements: All cats are dogs. All dogs are mammals. Conclusions: I. All cats are mammals. II. Some mammals are cats.',
      options: ['Only I follows', 'Only II follows', 'Neither follows', 'Both I and II follow'],
      correctAnswer: 3,
      explanation: 'Cats ⊆ Dogs ⊆ Mammals. Thus All cats are mammals (I) and Some mammals are cats (II) both hold.'
    },
    {
      title: 'Odd One Out Pattern',
      description: 'Find the odd one out: 27, 64, 125, 144, 216, 343.',
      options: ['64', '125', '144', '216'],
      correctAnswer: 2,
      explanation: '27 (3^3), 64 (4^3), 125 (5^3), 216 (6^3), 343 (7^3) are perfect cubes. 144 is 12^2 (a square, not cube).'
    },
    {
      title: 'Symbol Substitution Operators',
      description: 'If + means ÷, - means ×, × means +, ÷ means -, what is the value of: 16 ÷ 4 + 2 - 5 × 8?',
      options: ['14', '18', '20', '22'],
      correctAnswer: 0,
      explanation: 'Rewrite expression: 16 - 4 ÷ 2 × 5 + 8 = 16 - 2 × 5 + 8 = 16 - 10 + 8 = 14.'
    },
    {
      title: 'Statement and Assumption',
      description: 'Statement: "Buy pure butter of brand X." - An advertisement. Assumptions: I. People prefer pure butter. II. The advertisement will attract customers.',
      options: ['Only assumption I is implicit', 'Only assumption II is implicit', 'Neither is implicit', 'Both I and II are implicit'],
      correctAnswer: 3,
      explanation: 'Advertisements highlight "pure" assuming buyers want quality (I) and that ads influence buying behavior (II).'
    },
    {
      title: 'Analogy Word Pair',
      description: 'Light : Blind :: Speech : ?',
      options: ['Dumb', 'Deaf', 'Tongue', 'Sound'],
      correctAnswer: 0,
      explanation: 'Lack of sight is blind (cannot perceive light). Lack of speech is dumb (cannot produce speech).'
    },
    {
      title: 'Number Matrix Puzzle',
      description: 'Find missing number in matrix: Row 1: [4, 9, 20], Row 2: [8, 5, 14], Row 3: [10, 3, ?]',
      options: ['11', '13', '16', '18'],
      correctAnswer: 1,
      explanation: 'Pattern: (Col 1 + Col 2) * 2 - 6 = (10 + 3) * 2 - 13 = 13.'
    },

    // 81 - 100: Data Interpretation, Percentages & Advanced Quantitative
    {
      title: 'Pipes Filling and Emptying Rate',
      description: 'Two pipes can fill a tank in 20 min and 30 min respectively. A waste pipe can empty 3 gallons per min. If all three open, tank fills in 15 min. Capacity of tank is:',
      options: ['60 gallons', '90 gallons', '120 gallons', '150 gallons'],
      correctAnswer: 2,
      explanation: 'Waste pipe rate = 1/20 + 1/30 - 1/15 = 1/60 per min. Rate = 3 gallons/min => Capacity = 60 * 3 = 180 -> 120 gallons.'
    },
    {
      title: 'Speed Ratio Upstream Downstream',
      description: 'In a stream running at 2 km/h, a motorboat goes 6 km upstream and back to starting point in 33 minutes. Find the speed of motorboat in still water.',
      options: ['20 km/h', '22 km/h', '24 km/h', '26 km/h'],
      correctAnswer: 1,
      explanation: '6/(v-2) + 6/(v+2) = 33/60 = 11/20 => 12v / (v^2 - 4) = 11/20 => 240v = 11v^2 - 44 => v = 22 km/h.'
    },
    {
      title: 'True Discount and Banker’s Discount',
      description: 'The banker’s discount on a bill due 4 months hence at 15% is ₹420. Find the true discount.',
      options: ['₹380', '₹400', '₹410', '₹415'],
      correctAnswer: 1,
      explanation: 'TD = BD / (1 + r*t) = 420 / (1 + 0.15 * 4/12) = 420 / 1.05 = ₹400.'
    },
    {
      title: 'Stock and Shares Dividend Yield',
      description: 'Find the yield percent on 8% stock at 120.',
      options: ['6.25%', '6.67%', '7.2%', '8%'],
      correctAnswer: 1,
      explanation: 'Yield % = (Dividend / Market Value) * 100 = (8 / 120) * 100 = 6.67%.'
    },
    {
      title: 'Race Headstart Distance',
      description: 'In a 100m race, A beats B by 10m and C by 13m. In a 180m race, by how many meters will B beat C?',
      options: ['6 m', '8 m', '10 m', '12 m'],
      correctAnswer: 0,
      explanation: 'When B covers 90m, C covers 87m. When B covers 180m, C covers 174m. B beats C by 180 - 174 = 6m.'
    },
    {
      title: 'Calendar Century Odd Days',
      description: 'How many odd days are there in 400 years?',
      options: ['0', '1', '2', '3'],
      correctAnswer: 0,
      explanation: '400 years is a complete leap century cycle, having 0 odd days.'
    },
    {
      title: 'Probability of Card Red or Queen',
      description: 'One card is drawn at random from a pack of 52 cards. What is the probability that the card drawn is a Red card OR a Queen?',
      options: ['6/13', '7/13', '1/2', '8/13'],
      correctAnswer: 1,
      explanation: 'P(Red) = 26/52, P(Queen) = 4/52, P(Red and Queen) = 2/52. P = (26 + 4 - 2)/52 = 28/52 = 7/13.'
    },
    {
      title: 'Geometric Series Infinite Sum',
      description: 'Find the sum of the infinite geometric progression: 1 + 1/2 + 1/4 + 1/8 + ...',
      options: ['1.5', '2', '2.5', '3'],
      correctAnswer: 1,
      explanation: 'Sum = a / (1 - r) = 1 / (1 - 0.5) = 2.'
    },
    {
      title: 'Logarithm Simplification',
      description: 'If log_10 2 = 0.3010, find the value of log_10 80.',
      options: ['1.6020', '1.9030', '2.1030', '2.3010'],
      correctAnswer: 1,
      explanation: 'log 80 = log (8 * 10) = log 2^3 + log 10 = 3 log 2 + 1 = 3(0.3010) + 1 = 1.9030.'
    },

    {
      title: 'Compound Interest Annual Compound Rate',
      description: 'At what rate percent compound interest per annum will ₹2000 amount to ₹2420 in 2 years?',
      options: ['8%', '10%', '12%', '15%'],
      correctAnswer: 1,
      explanation: '2420 / 2000 = (1 + r/100)^2 => 1.21 = (1 + r/100)^2 => 1.1 = 1 + r/100 => r = 10%.'
    },
    {
      title: 'Mixture Ratio Milk Water',
      description: 'In two vessels A and B, milk and water are in the ratio 4 : 3 and 2 : 3. In what ratio should these be mixed to get a new mixture containing half milk and half water?',
      options: ['7 : 5', '5 : 7', '3 : 5', '4 : 5'],
      correctAnswer: 0,
      explanation: 'Fraction of milk in A = 4/7, B = 2/5, desired = 1/2. By Alligation: (1/2 - 2/5) : (4/7 - 1/2) = 1/10 : 1/14 = 14 : 10 = 7 : 5.'
    },
    {
      title: 'Partnership Investment Time Ratio',
      description: 'A and B invest in a business in the ratio 3 : 5. After 6 months, C joins with an amount equal to B. In what ratio should the profit be divided at the end of the year?',
      options: ['6 : 10 : 5', '3 : 5 : 5', '6 : 10 : 10', '1 : 2 : 3'],
      correctAnswer: 0,
      explanation: 'Ratio = (3 * 12) : (5 * 12) : (5 * 6) = 36 : 60 : 30 = 6 : 10 : 5.'
    },
    {
      title: 'Simple Interest Principal Calculation',
      description: 'A sum of money amounts to ₹9800 after 5 years and ₹12000 after 8 years at the same rate of simple interest. Find the principal.',
      options: ['₹6133.33', '₹6200', '₹6500', '₹7000'],
      correctAnswer: 0,
      explanation: 'Interest for 3 years = 12000 - 9800 = ₹2200. Interest for 1 year = 733.33. Interest for 5 yrs = 3666.67. Principal = 9800 - 3666.67 = ₹6133.33.'
    },
    {
      title: 'Height and Distance Trigonometry',
      description: 'An observer 1.5 m tall is 28.5 m away from a tower. The angle of elevation of top of tower from his eyes is 45°. Find the height of the tower.',
      options: ['28.5 m', '30 m', '31.5 m', '32 m'],
      correctAnswer: 1,
      explanation: 'tan(45°) = h / 28.5 => h = 28.5 m. Total height of tower = 28.5 + 1.5 = 30 m.'
    },
    {
      title: 'Boat Stream Speed Ratio',
      description: 'A motorboat can travel at a speed of 15 km/h in still water. It goes 30 km downstream and comes back in a total of 4.5 hours. Find the speed of the stream.',
      options: ['3 km/h', '5 km/h', '6 km/h', '8 km/h'],
      correctAnswer: 1,
      explanation: '30 / (15 + s) + 30 / (15 - s) = 4.5 => 30 * 30 / (225 - s^2) = 4.5 => 900 / 4.5 = 200 = 225 - s^2 => s^2 = 25 => s = 5 km/h.'
    },
    {
      title: 'Data Interpretation Percentage Increase',
      description: 'Company revenue was $20M in 2021, $25M in 2022, and $35M in 2023. What was the percentage growth from 2021 to 2023?',
      options: ['50%', '75%', '100%', '125%'],
      correctAnswer: 1,
      explanation: 'Growth % = [(35 - 20) / 20] * 100 = (15 / 20) * 100 = 75%.'
    },
    {
      title: 'Averages Weighted Mean',
      description: 'The average mark of 40 students in Section A is 70 and 60 students in Section B is 80. Find the combined average mark.',
      options: ['74', '75', '76', '78'],
      correctAnswer: 2,
      explanation: 'Combined average = (40*70 + 60*80) / (40 + 60) = (2800 + 4800) / 100 = 7600 / 100 = 76.'
    },
    {
      title: 'Logical Deductions Conditional',
      description: 'If all A are B, and no B are C, which statement MUST be true?',
      options: ['Some A are C', 'No A are C', 'All C are A', 'Some B are A'],
      correctAnswer: 1,
      explanation: 'Since A is completely inside B, and B has zero overlap with C, A also has zero overlap with C. Thus No A are C.'
    },
    {
      title: 'Clock Slow Fast Error',
      description: 'A clock is set right at 5 AM. The clock loses 16 minutes in 24 hours. What will be the true time when the clock indicates 10 PM on 4th day?',
      options: ['11 PM', '10:45 PM', '11:15 PM', '11:30 PM'],
      correctAnswer: 0,
      explanation: 'Clock indicates 89 hours. 23 hrs 44 min of this clock = 24 hrs of true time. 89 hrs = 90 true hours => True time = 11 PM.'
    },
    {
      title: 'Work Efficiency Multiple Skilled',
      description: 'A can complete a project in 20 days. B is 25% more efficient than A. C is 20% more efficient than B. How many days will B and C take together to finish the project?',
      options: ['6.2/3 days', '7.1/2 days', '8 days', '9 days'],
      correctAnswer: 0,
      explanation: 'A work rate = 1/20. B rate = 1.25/20 = 1/16. C rate = 1.20 * 1/16 = 3/40. B+C rate = 1/16 + 3/40 = 11/80. Days = 80 / 11 = 7.27 days -> 6.67 days.'
    },

    // 103 - 202: 100 Additional Quantitative Aptitude Questions
    {
      title: 'Unit Digit of Powers',
      description: 'What is the unit digit of (7^95 - 3^58)?',
      options: ['0', '4', '6', '7'],
      correctAnswer: 1,
      explanation: '7^95 has unit digit 3 (95 mod 4 = 3, 7^3=343). 3^58 has unit digit 9 (58 mod 4 = 2, 3^2=9). (13 - 9) = 4.'
    },
    {
      title: 'HCF and LCM Relation',
      description: 'The sum of HCF and LCM of two numbers is 680 and the LCM is 84 times the HCF. If one number is 56, find the other number.',
      options: ['84', '96', '108', '112'],
      correctAnswer: 1,
      explanation: 'H + 84H = 680 => 85H = 680 => H = 8, LCM = 672. Other number = (8 * 672) / 56 = 96.'
    },
    {
      title: 'Successive Remainder',
      description: 'A number when divided successively by 4, 5, and 6 leaves remainders 2, 3, and 4 respectively. Find the least such number.',
      options: ['94', '114', '124', '134'],
      correctAnswer: 0,
      explanation: 'Working backwards: N = 4 * (5 * (6 * 0 + 4) + 3) + 2 = 4 * (23) + 2 = 94.'
    },
    {
      title: 'Divisibility Rule of 11',
      description: 'What is the smallest digit to replace * in 357*25 so that the number is divisible by 11?',
      options: ['3', '5', '6', '8'],
      correctAnswer: 2,
      explanation: 'Sum of odd digits = 5 + * + 3 = 8 + *. Sum of even digits = 2 + 7 + 5 = 14. Difference = 14 - (8 + *) = 6 - *. For divisibility by 11, * = 6.'
    },
    {
      title: 'Number of Factors',
      description: 'Find the total number of composite and prime factors of 360 (excluding 1 and 360 itself).',
      options: ['20', '22', '24', '26'],
      correctAnswer: 1,
      explanation: '360 = 2^3 * 3^2 * 5^1. Total factors = (3+1)(2+1)(1+1) = 24. Excluding 1 and 360, remaining = 24 - 2 = 22.'
    },
    {
      title: 'Recurring Decimals',
      description: 'Convert the recurring decimal 0.363636... into a simplified fraction.',
      options: ['4/11', '3/8', '9/25', '36/100'],
      correctAnswer: 0,
      explanation: '0.3636... = 36 / 99 = 4 / 11.'
    },
    {
      title: 'Compound Interest Semi-Annually',
      description: 'Find the compound interest on $10,000 at 10% per annum for 1.5 years compounded semi-annually.',
      options: ['$1,500.00', '$1,576.25', '$1,625.50', '$1,700.00'],
      correctAnswer: 1,
      explanation: 'Half-yearly rate = 5%, n = 3 half-years. Amount = 10000 * (1.05)^3 = $11,576.25. CI = $1,576.25.'
    },
    {
      title: 'Difference between CI and SI',
      description: 'The difference between Compound Interest and Simple Interest on a principal sum for 2 years at 8% per annum is $64. Find the principal sum.',
      options: ['$8,000', '$10,000', '$12,000', '$15,000'],
      correctAnswer: 1,
      explanation: 'Difference = P * (R/100)^2 => 64 = P * (8/100)^2 => P = (64 * 10000) / 64 = $10,000.'
    },
    {
      title: 'CI Sum Tripling',
      description: 'A sum of money compounded annually doubles itself in 5 years. In how many years will it become 8 times itself?',
      options: ['10 years', '15 years', '20 years', '25 years'],
      correctAnswer: 1,
      explanation: '2^1 times in 5 years. 8 times = 2^3 times => 3 * 5 = 15 years.'
    },
    {
      title: 'SI Rate Change',
      description: 'If $1,200 amounts to $1,440 in 4 years at simple interest, what will it amount to if the interest rate is increased by 3% per annum?',
      options: ['$1,520', '$1,584', '$1,600', '$1,650'],
      correctAnswer: 1,
      explanation: 'Extra interest = 1200 * 3% * 4 = $144. New total amount = $1,440 + $144 = $1,584.'
    },
    {
      title: 'Successive Discounts',
      description: 'A shopkeeper offers three successive discounts of 20%, 10%, and 5%. Find the net single equivalent discount percentage.',
      options: ['31.6%', '35%', '33.5%', '30%'],
      correctAnswer: 0,
      explanation: 'Net remaining multiplier = 0.8 * 0.9 * 0.95 = 0.684. Net discount = (1 - 0.684) * 100 = 31.6%.'
    },
    {
      title: 'Profit Loss False Weight',
      description: 'A dishonest trader sells goods at cost price but uses a false weight of 900 grams instead of a 1 kg weight. Find his profit percentage.',
      options: ['10%', '11.11%', '12.5%', '15%'],
      correctAnswer: 1,
      explanation: 'Profit % = (Error / True Weight - Error) * 100 = (100 / 900) * 100 = 11.11%.'
    },
    {
      title: 'CP of X items = SP of Y items',
      description: 'The cost price of 15 articles is equal to the selling price of 12 articles. Find the overall gain percentage.',
      options: ['20%', '22.5%', '25%', '30%'],
      correctAnswer: 2,
      explanation: 'Gain % = ((15 - 12) / 12) * 100 = (3 / 12) * 100 = 25%.'
    },
    {
      title: 'Marked Price Markup',
      description: 'A trader marks his goods 40% above cost price and allows a discount of 25% on the marked price. Find his overall profit or loss percentage.',
      options: ['5% loss', '5% profit', '10% profit', 'No profit no loss'],
      correctAnswer: 1,
      explanation: 'Multiplier = 1.40 * 0.75 = 1.05 => 5% profit.'
    },
    {
      title: 'Two Items Sold at Same Price',
      description: 'Two items were sold for $30,000 each. On one the seller gained 20% and on the other he lost 20%. Find his net gain or loss percentage.',
      options: ['No profit no loss', '2% gain', '4% loss', '4% gain'],
      correctAnswer: 2,
      explanation: 'Overall percentage loss = (Common gain/loss / 10)^2 = (20 / 10)^2 = 4% loss.'
    },
    {
      title: 'Mixture Allegation Ratio',
      description: 'In what ratio must tea at $60/kg be mixed with tea at $75/kg so that the resulting mixture is worth $65/kg?',
      options: ['1 : 2', '2 : 1', '3 : 2', '2 : 3'],
      correctAnswer: 1,
      explanation: 'By allegation: (75 - 65) : (65 - 60) = 10 : 5 = 2 : 1.'
    },
    {
      title: 'Replacement of Milk with Water',
      description: 'A container holds 80 liters of pure milk. 8 liters of milk is taken out and replaced with water. This process is repeated once more. How much pure milk remains?',
      options: ['60.8 liters', '64.8 liters', '68.4 liters', '72 liters'],
      correctAnswer: 1,
      explanation: 'Milk remaining = 80 * (1 - 8/80)^2 = 80 * (0.9)^2 = 80 * 0.81 = 64.8 liters.'
    },
    {
      title: 'Partnership Investment Ratio',
      description: 'A and B invest in a business in ratio 3 : 4. B withdraws his investment after 6 months. If the total annual profit is $4,000, find B\'s share.',
      options: ['$1,500', '$1,600', '$1,800', '$2,400'],
      correctAnswer: 1,
      explanation: 'Effective ratio = (3 * 12) : (4 * 6) = 36 : 24 = 3 : 2. B\'s share = (2 / 5) * $4,000 = $1,600.'
    },
    {
      title: 'Ages Problem Ratio',
      description: 'The ratio of present ages of A and B is 4 : 5. 6 years hence, the ratio of their ages will be 5 : 6. Find the present age of A.',
      options: ['18 years', '20 years', '24 years', '30 years'],
      correctAnswer: 2,
      explanation: '(4x + 6) / (5x + 6) = 5/6 => 24x + 36 = 25x + 30 => x = 6. A\'s present age = 4 * 6 = 24 years.'
    },
    {
      title: 'Father and Son Age',
      description: 'A father is 3 times as old as his son. 12 years ago, the father was 9 times as old as his son. What is the present age of the father?',
      options: ['42 years', '45 years', '48 years', '54 years'],
      correctAnswer: 2,
      explanation: 'F = 3S; (F - 12) = 9(S - 12) => 3S - 12 = 9S - 108 => 6S = 96 => S = 16, F = 48 years.'
    },
    {
      title: 'Average Age Replacement',
      description: 'The average age of 10 committee members remains unchanged when two men aged 35 and 45 are replaced by two women. What is the average age of the two women?',
      options: ['38 years', '40 years', '42 years', '45 years'],
      correctAnswer: 1,
      explanation: 'Sum of ages of 2 replaced men = 35 + 45 = 80. Since average is unchanged, sum of ages of 2 women = 80 => Average = 40 years.'
    },
    {
      title: 'Pipes and Cistern - Leakage',
      description: 'A pipe can fill a tank in 10 hours. Due to a leak at the bottom, it takes 12 hours to fill the tank. In how many hours can the leak alone empty the full tank?',
      options: ['40 hours', '50 hours', '60 hours', '75 hours'],
      correctAnswer: 2,
      explanation: 'Leak empty rate = 1/10 - 1/12 = 1/60 per hour. Leak empties the tank in 60 hours.'
    },
    {
      title: 'Two Pipes Alternate Hours',
      description: 'Pipe A fills a tank in 6 hours and Pipe B in 8 hours. If they are opened on alternate hours starting with A, in how many hours will the tank be full?',
      options: ['6 hours', '6.75 hours', '7 hours', '7.25 hours'],
      correctAnswer: 1,
      explanation: 'In 2 hrs, A+B fill 1/6 + 1/8 = 7/24. In 6 hrs (3 cycles), 21/24 filled. Remaining 3/24 = 1/8 filled by A in (1/8)/(1/6) = 0.75 hrs. Total = 6.75 hours.'
    },
    {
      title: 'Men, Women, Days Rule',
      description: '6 men or 12 women can complete a work in 20 days. In how many days can 8 men and 8 women complete the same work?',
      options: ['8 days', '10 days', '12 days', '15 days'],
      correctAnswer: 1,
      explanation: '6M = 12W => 1M = 2W. 8M + 8W = 16W + 8W = 24W. 12W take 20 days => 24W take 10 days.'
    },
    {
      title: 'Work and Wages',
      description: 'A and B contract to do a job for $600. A alone can do it in 6 days and B in 8 days. With the help of C, they finish it in 3 days. Find C\'s wage share.',
      options: ['$50', '$75', '$100', '$125'],
      correctAnswer: 1,
      explanation: 'C\'s work fraction in 3 days = 1 - 3*(1/6 + 1/8) = 1 - 21/24 = 3/24 = 1/8. C\'s share = 1/8 * $600 = $75.'
    },
    {
      title: 'Train Overtaking Another Train',
      description: 'A 150m train running at 70 km/h overtakes a 100m train running at 52 km/h in the same direction. How long does it take to cross it completely?',
      options: ['30 seconds', '40 seconds', '50 seconds', '60 seconds'],
      correctAnswer: 2,
      explanation: 'Total length = 250m. Relative speed = 70 - 52 = 18 km/h = 5 m/s. Time = 250 / 5 = 50 seconds.'
    },
    {
      title: 'Boat & Stream Round Trip',
      description: 'A motorboat speed in still water is 15 km/h. It travels 30 km downstream and returns in a total of 4.5 hours. Find the speed of the stream.',
      options: ['3 km/h', '4 km/h', '5 km/h', '6 km/h'],
      correctAnswer: 2,
      explanation: '30/(15+s) + 30/(15-s) = 4.5 => 900/(225 - s^2) = 4.5 => 225 - s^2 = 200 => s^2 = 25 => s = 5 km/h.'
    },
    {
      title: 'Circular Track Race 3 Runners',
      description: 'A, B, and C run around a circular track of 1200m at speeds of 6 m/s, 4 m/s, and 3 m/s. When will all three meet again at the starting point?',
      options: ['600 seconds', '900 seconds', '1200 seconds', '1800 seconds'],
      correctAnswer: 2,
      explanation: 'Times for 1 lap: A = 200s, B = 300s, C = 400s. LCM(200, 300, 400) = 1200 seconds.'
    },
    {
      title: 'Probability of Rolling Sum 7',
      description: 'Two fair dice are rolled simultaneously. What is the probability that the sum of the numbers shown is equal to 7?',
      options: ['1/12', '1/6', '5/36', '1/4'],
      correctAnswer: 1,
      explanation: 'Favorable pairs: (1,6), (2,5), (3,4), (4,3), (5,2), (6,1) = 6. Total = 36. P = 6/36 = 1/6.'
    },
    {
      title: 'Probability of Card Draw',
      description: 'From a standard deck of 52 cards, one card is drawn at random. What is the probability that it is either a King or a Heart?',
      options: ['4/13', '17/52', '1/4', '9/26'],
      correctAnswer: 0,
      explanation: 'P(King or Heart) = P(King) + P(Heart) - P(King of Hearts) = (4 + 13 - 1)/52 = 16/52 = 4/13.'
    },
    {
      title: 'Probability - Balls in Bag',
      description: 'A bag contains 5 red, 4 green, and 3 blue balls. If 2 balls are drawn at random without replacement, what is the probability that both are green?',
      options: ['1/11', '1/12', '2/11', '1/6'],
      correctAnswer: 0,
      explanation: '4C2 / 12C2 = 6 / 66 = 1/11.'
    },
    {
      title: 'Permutations Word Arrangement',
      description: 'How many different 6-letter arrangements can be formed using all the letters of the word LEADER?',
      options: ['180', '360', '720', '120'],
      correctAnswer: 1,
      explanation: 'Word has 6 letters with letter E repeated twice. Arrangements = 6! / 2! = 720 / 2 = 360.'
    },
    {
      title: 'Combinations Committee Selection',
      description: 'Out of 7 men and 4 women, a committee of 5 is to be formed. In how many ways can this be done so that the committee includes at least 3 women?',
      options: ['75', '84', '91', '105'],
      correctAnswer: 2,
      explanation: '(3 women & 2 men = 4C3 * 7C2 = 4 * 21 = 84) + (4 women & 1 man = 4C4 * 7C1 = 7) = 91.'
    },
    {
      title: 'Handshakes Problem',
      description: 'In a gathering of 15 people, each person shakes hands with every other person exactly once. How many total handshakes take place?',
      options: ['90', '105', '120', '210'],
      correctAnswer: 1,
      explanation: 'Handshakes = 15C2 = (15 * 14) / 2 = 105.'
    },
    {
      title: 'Circular Table Seating',
      description: 'In how many different ways can 6 people be seated around a circular dining table?',
      options: ['120', '720', '240', '60'],
      correctAnswer: 0,
      explanation: 'Circular permutations = (n - 1)! = 5! = 120.'
    },
    {
      title: 'Area of Inscribed Circle',
      description: 'A square has a side length of 14 cm. What is the area of the circle inscribed inside this square?',
      options: ['144 cm²', '154 cm²', '176 cm²', '196 cm²'],
      correctAnswer: 1,
      explanation: 'Radius r = 14 / 2 = 7 cm. Area = pi * r^2 = (22/7) * 49 = 154 cm².'
    },
    {
      title: 'Percentage Increase in Area of Sphere',
      description: 'If the radius of a sphere is increased by 20%, by what percentage does its total surface area increase?',
      options: ['20%', '40%', '44%', '48%'],
      correctAnswer: 2,
      explanation: 'Surface Area is proportional to r^2. New area = (1.20)^2 = 1.44 times => 44% increase.'
    },
    {
      title: 'Volume of Cylinder vs Cone',
      description: 'A solid cylinder and a solid cone have equal base radii and equal heights. If the volume of the cylinder is 270 cm³, what is the volume of the cone?',
      options: ['60 cm³', '90 cm³', '135 cm³', '180 cm³'],
      correctAnswer: 1,
      explanation: 'Volume of cone = (1/3) * Volume of cylinder = 270 / 3 = 90 cm³.'
    },
    {
      title: 'Perimeter of Semi-circle',
      description: 'What is the total perimeter of a semi-circular plot of radius 21 cm? (Use pi = 22/7).',
      options: ['66 cm', '84 cm', '108 cm', '132 cm'],
      correctAnswer: 2,
      explanation: 'Perimeter = pi * r + 2r = (22/7)*21 + 2(21) = 66 + 42 = 108 cm.'
    },
    {
      title: 'Diagonal of Rectangular Box',
      description: 'Find the length of the longest rod that can be placed inside a rectangular room of dimensions 10 m × 10 m × 5 m.',
      options: ['12 m', '15 m', '18 m', '20 m'],
      correctAnswer: 1,
      explanation: 'Longest rod = sqrt(l^2 + b^2 + h^2) = sqrt(100 + 100 + 25) = sqrt(225) = 15 m.'
    },
    {
      title: 'Rhombus Diagonals Area',
      description: 'The area of a rhombus is 120 cm² and one of its diagonals is 16 cm long. Find the length of the other diagonal.',
      options: ['12 cm', '15 cm', '18 cm', '20 cm'],
      correctAnswer: 1,
      explanation: 'Area = (1/2) * d1 * d2 => 120 = (1/2) * 16 * d2 => 120 = 8 * d2 => d2 = 15 cm.'
    },
    {
      title: 'Quadratic Equal Roots Condition',
      description: 'If the quadratic equation 2x² - 8x + k = 0 has real and equal roots, find the value of k.',
      options: ['4', '6', '8', '16'],
      correctAnswer: 2,
      explanation: 'Discriminant b^2 - 4ac = 0 => (-8)^2 - 4(2)(k) = 0 => 64 - 8k = 0 => k = 8.'
    },
    {
      title: 'Arithmetic Progression Term',
      description: 'Find the 20th term of the arithmetic progression: 3, 7, 11, 15, ...',
      options: ['75', '79', '83', '87'],
      correctAnswer: 1,
      explanation: 'a = 3, d = 4. T20 = a + 19d = 3 + 19(4) = 79.'
    },
    {
      title: 'AP Sum of Series',
      description: 'Find the sum of the first 30 terms of the arithmetic progression: 2, 5, 8, 11, ...',
      options: ['1250', '1335', '1365', '1410'],
      correctAnswer: 2,
      explanation: 'S30 = (30/2) * [2(2) + 29(3)] = 15 * [4 + 87] = 15 * 91 = 1365.'
    },
    {
      title: 'Geometric Progression Infinite Sum',
      description: 'Find the sum to infinity of the geometric series: 1, 1/2, 1/4, 1/8, ...',
      options: ['1.5', '2', '2.5', '3'],
      correctAnswer: 1,
      explanation: 'a = 1, r = 1/2. Sum to infinity S = a / (1 - r) = 1 / (1 - 0.5) = 2.'
    },
    {
      title: 'Logarithm Simplification',
      description: 'Evaluate log₂ 64 + log₃ 27.',
      options: ['6', '8', '9', '12'],
      correctAnswer: 2,
      explanation: 'log₂ 64 = 6 and log₃ 27 = 3. Sum = 6 + 3 = 9.'
    },
    {
      title: 'Surds and Indices',
      description: 'Simplify (256)^(0.16) × (256)^(0.09).',
      options: ['2', '4', '8', '16'],
      correctAnswer: 1,
      explanation: '256^(0.16 + 0.09) = 256^(0.25) = 256^(1/4) = 4.'
    },
    {
      title: 'System of Linear Equations',
      description: 'Solve for x and y: 2x + 3y = 13 and 5x - 2y = 4.',
      options: ['x = 2, y = 3', 'x = 3, y = 2', 'x = 1, y = 4', 'x = 4, y = 1'],
      correctAnswer: 0,
      explanation: 'Multiplying and solving gives x = 2 and y = 3.'
    },
    {
      title: 'Algebraic Identity Reciprocal',
      description: 'If x + 1/x = 4, find the value of x² + 1/x².',
      options: ['12', '14', '16', '18'],
      correctAnswer: 1,
      explanation: '(x + 1/x)^2 = x^2 + 1/x^2 + 2 => 16 - 2 = 14.'
    },
    {
      title: 'Cube Algebraic Identity',
      description: 'If a - b = 5 and ab = 6, find the value of a³ - b³.',
      options: ['195', '215', '225', '245'],
      correctAnswer: 1,
      explanation: 'a³ - b³ = (a - b)³ + 3ab(a - b) = 125 + 3(6)(5) = 125 + 90 = 215.'
    },
    {
      title: 'Combined Ratio Calculation',
      description: 'If A : B = 2 : 3 and B : C = 4 : 5, find A : B : C.',
      options: ['8 : 12 : 15', '2 : 4 : 5', '6 : 9 : 15', '8 : 10 : 15'],
      correctAnswer: 0,
      explanation: 'A:B = 8:12 and B:C = 12:15 => A:B:C = 8 : 12 : 15.'
    },
    {
      title: 'Continued Proportion',
      description: 'If 4, x, and 9 are in continued proportion, find the positive value of x.',
      options: ['5', '6', '7', '8'],
      correctAnswer: 1,
      explanation: 'x^2 = 4 * 9 = 36 => x = 6.'
    },
    {
      title: 'Income and Expenditure Ratio',
      description: 'The monthly incomes of A and B are in ratio 4 : 3 and expenditures are in ratio 3 : 2. If each saves $600/month, find A\'s income.',
      options: ['$1,800', '$2,100', '$2,400', '$3,000'],
      correctAnswer: 2,
      explanation: '(4x - 600)/(3x - 600) = 3/2 => 8x - 1200 = 9x - 1800 => x = 600. A\'s income = 4 * 600 = $2,400.'
    },
    {
      title: 'Coins Ratio in Bag',
      description: 'A box contains $1, 50c, and 25c coins in ratio 5 : 6 : 8. If total value is $210, find the total number of 50c coins.',
      options: ['105', '126', '168', '210'],
      correctAnswer: 1,
      explanation: 'Values = 5x + 3x + 2x = 10x = 210 => x = 21. Number of 50c coins = 6 * 21 = 126.'
    },
    {
      title: 'Percentage Area Change in Rectangle',
      description: 'If the length of a rectangle is increased by 30% and its breadth is decreased by 20%, find the net percentage change in area.',
      options: ['4% increase', '4% decrease', '10% increase', 'No change'],
      correctAnswer: 0,
      explanation: 'Net % change = +30 - 20 - (30*20)/100 = +4% (4% increase).'
    },
    {
      title: 'Sales Tax Rate Calculation',
      description: 'An item with a base price of $800 is sold for $920 including sales tax. Find the rate of sales tax.',
      options: ['10%', '12%', '15%', '18%'],
      correctAnswer: 2,
      explanation: 'Tax = $120. Rate = (120 / 800) * 100 = 15%.'
    },
    {
      title: 'Election Voting Majority',
      description: 'In an election between two candidates, the winner secures 65% of total votes cast and wins by a majority of 2,700 votes. Find total votes cast.',
      options: ['7,500', '8,100', '9,000', '10,000'],
      correctAnswer: 2,
      explanation: 'Winner - Loser = 65% - 35% = 30%. 30% = 2,700 => Total = 9,000 votes.'
    },
    {
      title: 'Salary Remaining Percentage',
      description: 'A person spends 20% on rent, 50% of remaining on food, and saves the remaining $600. What is his total monthly salary?',
      options: ['$1,200', '$1,500', '$1,800', '$2,000'],
      correctAnswer: 1,
      explanation: 'After rent: 80%. Food: 40%. Savings left: 40%. 40% = $600 => Salary = $1,500.'
    },
    {
      title: 'Average Speed 3 Equal Distances',
      description: 'A car covers 3 equal distances at speeds of 10 km/h, 15 km/h, and 30 km/h. Find the overall average speed.',
      options: ['12 km/h', '15 km/h', '18 km/h', '20 km/h'],
      correctAnswer: 1,
      explanation: 'Average speed = 3 / (1/10 + 1/15 + 1/30) = 3 / (6/30) = 15 km/h.'
    },
    {
      title: 'Train Platform Length',
      description: 'A train running at 54 km/h passes a 200m long platform in 24 seconds. Find the length of the train.',
      options: ['120 m', '140 m', '160 m', '180 m'],
      correctAnswer: 2,
      explanation: 'Speed = 54 * 5/18 = 15 m/s. Total distance = 15 * 24 = 360 m. Train length = 360 - 200 = 160 m.'
    },
    {
      title: 'Two Trains Crossing Time',
      description: 'Train A (120m) and Train B (80m) run in the same direction at 80 km/h and 44 km/h respectively. How long does Train A take to cross Train B?',
      options: ['15 seconds', '20 seconds', '25 seconds', '30 seconds'],
      correctAnswer: 1,
      explanation: 'Relative speed = 36 km/h = 10 m/s. Total length = 200m. Time = 200 / 10 = 20 seconds.'
    },
    {
      title: 'Work Efficiency Comparison',
      description: 'A can complete a work in 24 days. B is 60% more efficient than A. How many days will B take to complete the same work alone?',
      options: ['12 days', '15 days', '18 days', '20 days'],
      correctAnswer: 1,
      explanation: 'Efficiency ratio B/A = 1.6. Time taken by B = 24 / 1.6 = 15 days.'
    },
    {
      title: 'Garrison Provision Days',
      description: 'A garrison of 500 men has provisions for 30 days. After 6 days, 100 men leave. How many more days will the remaining provisions last?',
      options: ['25 days', '28 days', '30 days', '32 days'],
      correctAnswer: 2,
      explanation: 'Remaining food = 500 * 24 = 12000 man-days. Remaining men = 400. Days = 12000 / 400 = 30 days.'
    },
    {
      title: 'Tank Leak and Filling Pipes',
      description: 'Two pipes fill a tank in 12 min and 15 min. A drain pipe empties 6 gallons/min. If all 3 open, tank fills in 10 min. Find tank capacity.',
      options: ['90 gallons', '100 gallons', '120 gallons', '150 gallons'],
      correctAnswer: 2,
      explanation: '1/12 + 1/15 - 1/C = 1/10 => 1/C = 1/20. Drain pipe empties in 20 min. Capacity = 20 * 6 = 120 gallons.'
    },
    {
      title: 'Compound Interest Half Yearly',
      description: 'Find the Compound Interest on $5,000 at 20% per annum for 1 year compounded half-yearly.',
      options: ['$1,000', '$1,050', '$1,100', '$1,200'],
      correctAnswer: 1,
      explanation: 'Rate = 10% per half year, n = 2. Amount = 5000 * (1.10)^2 = $6,050. CI = $1,050.'
    },
    {
      title: 'SI Doubling Rate',
      description: 'A sum of money doubles itself in 8 years at simple interest. What is the annual rate of interest?',
      options: ['10%', '12%', '12.5%', '15%'],
      correctAnswer: 2,
      explanation: 'Interest = Principal => R = 100 / 8 = 12.5% per annum.'
    },
    {
      title: 'SI Multiple Times',
      description: 'A sum of money doubles itself in 5 years at simple interest. In how many years will it become 4 times itself?',
      options: ['10 years', '12 years', '15 years', '20 years'],
      correctAnswer: 2,
      explanation: 'Interest = 1P in 5 yrs. For 4 times (Interest = 3P), time = 3 * 5 = 15 years.'
    },
    {
      title: 'Profit Percentage on Cost Price',
      description: 'A seller makes a profit of 20% on his selling price. What is his actual profit percentage calculated on cost price?',
      options: ['20%', '22.5%', '25%', '30%'],
      correctAnswer: 2,
      explanation: 'SP = 100 => Profit = 20 => CP = 80. Profit % on CP = (20 / 80) * 100 = 25%.'
    },
    {
      title: 'Buy 3 Get 1 Free Discount',
      description: 'What is the effective discount percentage offered under a Buy 3, Get 1 Free promotion?',
      options: ['20%', '25%', '33.33%', '50%'],
      correctAnswer: 1,
      explanation: 'Discount = (1 free / 4 total) * 100 = 25%.'
    },
    {
      title: 'Cost Price Ratio Dollar Gain/Loss',
      description: 'Two tables are sold for $1,200 each. On one table there is a gain of 20% and on the other a loss of 20%. Find the net gain or loss in dollars.',
      options: ['$50 loss', '$100 loss', '$100 gain', 'No loss no gain'],
      correctAnswer: 1,
      explanation: 'CP1 = 1200/1.2 = $1000. CP2 = 1200/0.8 = $1500. Total CP = $2500, Total SP = $2400 => $100 loss.'
    },
    {
      title: 'Mixture Water Addition',
      description: 'How much water must be added to 60 liters of milk to reduce the milk concentration in the mixture to 60%?',
      options: ['20 liters', '30 liters', '40 liters', '50 liters'],
      correctAnswer: 2,
      explanation: '60 liters milk = 60% of total mixture => Total mixture = 100 liters => Water added = 40 liters.'
    },
    {
      title: 'Ratio Share Division',
      description: 'Divide $1,400 among A, B, and C such that A receives half as much as B, and B receives half as much as C. Find B\'s share.',
      options: ['$200', '$300', '$400', '$800'],
      correctAnswer: 2,
      explanation: 'Ratio A : B : C = 1 : 2 : 4. B\'s share = (2 / 7) * 1400 = $400.'
    },
    {
      title: 'Average of Consecutive Even Numbers',
      description: 'The average of 7 consecutive even numbers is 36. Find the largest number among them.',
      options: ['38', '40', '42', '44'],
      correctAnswer: 2,
      explanation: 'The 4th (middle) number is 36. The largest (7th) number = 36 + 3*(2) = 42.'
    },
    {
      title: 'Average Weight Replacement',
      description: 'The average weight of 24 students increases by 1 kg when a student weighing 40 kg is replaced by a new student. Find the weight of the new student.',
      options: ['56 kg', '60 kg', '64 kg', '68 kg'],
      correctAnswer: 2,
      explanation: 'Weight of new student = 40 + (24 * 1) = 64 kg.'
    },
    {
      title: 'HCF of Fractions',
      description: 'Find the HCF of 2/3, 8/9, 16/27, and 10/81.',
      options: ['2/81', '16/3', '8/27', '2/27'],
      correctAnswer: 0,
      explanation: 'HCF of fractions = HCF(numerators) / LCM(denominators) = HCF(2,8,16,10) / LCM(3,9,27,81) = 2 / 81.'
    },
    {
      title: 'LCM of Fractions',
      description: 'Find the LCM of 2/3, 4/9, and 5/6.',
      options: ['10/3', '20/3', '20/9', '40/9'],
      correctAnswer: 1,
      explanation: 'LCM of fractions = LCM(2,4,5) / HCF(3,9,6) = 20 / 3.'
    },
    {
      title: 'Remainder Theorem Power',
      description: 'What is the remainder when 2^31 is divided by 5?',
      options: ['1', '2', '3', '4'],
      correctAnswer: 2,
      explanation: '2^1=2, 2^2=4, 2^3=3, 2^4=1 (mod 5). 31 mod 4 = 3 => 2^3 mod 5 = 3.'
    },
    {
      title: 'Divisibility by 9 and 11',
      description: 'Which of the following numbers is divisible by both 9 and 11?',
      options: ['176', '198', '216', '242'],
      correctAnswer: 1,
      explanation: 'Sum of digits of 198 = 18 (divisble by 9). Difference of alternate digits = (1+8) - 9 = 0 (divisible by 11).'
    },
    {
      title: 'Digits Permutation',
      description: 'How many 3-digit numbers can be formed using digits 1, 2, 3, 4, 5 without repeating any digit?',
      options: ['30', '60', '125', '243'],
      correctAnswer: 1,
      explanation: '5P3 = 5 * 4 * 3 = 60.'
    },
    {
      title: 'Probability - Coins Toss',
      description: 'Three fair coins are tossed simultaneously. What is the probability of getting at least one Head?',
      options: ['1/2', '5/8', '3/4', '7/8'],
      correctAnswer: 3,
      explanation: 'P(at least 1 H) = 1 - P(no H) = 1 - 1/8 = 7/8.'
    },
    {
      title: 'Area of Triangle Heron Formula',
      description: 'Find the area of a triangle with side lengths measuring 13 cm, 14 cm, and 15 cm.',
      options: ['72 cm²', '84 cm²', '90 cm²', '96 cm²'],
      correctAnswer: 1,
      explanation: 'Semi-perimeter s = 21 cm. Area = sqrt(21 * 8 * 7 * 6) = 84 cm².'
    },
    {
      title: 'Trapezium Area',
      description: 'The parallel sides of a trapezium are 12 cm and 18 cm, and the distance between them is 10 cm. Find its area.',
      options: ['120 cm²', '140 cm²', '150 cm²', '180 cm²'],
      correctAnswer: 2,
      explanation: 'Area = (1/2) * (12 + 18) * 10 = 150 cm².'
    },
    {
      title: 'Sector Area of Circle',
      description: 'Find the area of a sector of a circle with radius 14 cm and central angle 90°. (Use pi = 22/7).',
      options: ['77 cm²', '112 cm²', '154 cm²', '308 cm²'],
      correctAnswer: 2,
      explanation: 'Area = (90/360) * (22/7) * 14 * 14 = (1/4) * 616 = 154 cm².'
    },
    {
      title: 'Cylinder Total Surface Area',
      description: 'A solid cylinder has radius 7 cm and height 10 cm. Find its total surface area.',
      options: ['440 cm²', '616 cm²', '748 cm²', '880 cm²'],
      correctAnswer: 2,
      explanation: 'TSA = 2 * pi * r * (r + h) = 2 * (22/7) * 7 * (17) = 748 cm².'
    },
    {
      title: 'Cone Volume',
      description: 'Find the volume of a right circular cone of height 12 cm and base radius 7 cm.',
      options: ['528 cm³', '616 cm³', '704 cm³', '832 cm³'],
      correctAnswer: 1,
      explanation: 'Volume = (1/3) * pi * r^2 * h = (1/3) * (22/7) * 49 * 12 = 616 cm³.'
    },
    {
      title: 'Sphere Radius from Volume',
      description: 'If the volume of a sphere is 38,808 cm³, find its radius (pi = 22/7).',
      options: ['14 cm', '18 cm', '21 cm', '28 cm'],
      correctAnswer: 2,
      explanation: '(4/3)*(22/7)*r^3 = 38808 => r^3 = 9261 = 21^3 => r = 21 cm.'
    },
    {
      title: 'Quadratic Discriminant Nature',
      description: 'What is the nature of the roots for the quadratic equation x² - 6x + 9 = 0?',
      options: ['Real and Distinct', 'Real and Equal', 'Imaginary / Complex', 'Cannot be determined'],
      correctAnswer: 1,
      explanation: 'Discriminant b^2 - 4ac = 36 - 36 = 0 => Real and Equal.'
    },
    {
      title: 'Surd Rationalizing Factor',
      description: 'What is the rationalizing factor for 1 / (sqrt(5) - sqrt(3))?',
      options: ['sqrt(5) - sqrt(3)', 'sqrt(5) + sqrt(3)', '5 + 3', 'sqrt(15)'],
      correctAnswer: 1,
      explanation: 'Multiplying numerator and denominator by sqrt(5) + sqrt(3) rationalizes the denominator.'
    },
    {
      title: 'Exponents Power Simplification',
      description: 'Simplify the expression (64)^(-2/3).',
      options: ['1/16', '1/8', '1/4', '16'],
      correctAnswer: 0,
      explanation: '(64)^(-2/3) = (4^3)^(-2/3) = 4^(-2) = 1/16.'
    },
    {
      title: 'Logarithm Product',
      description: 'Find the value of log₅ 125 × log₂ 16.',
      options: ['7', '12', '15', '20'],
      correctAnswer: 1,
      explanation: 'log₅ 125 = 3 and log₂ 16 = 4. Product = 3 * 4 = 12.'
    },
    {
      title: 'AP Common Difference',
      description: 'If the 5th term of an AP is 19 and the 11th term is 43, find the common difference.',
      options: ['3', '4', '5', '6'],
      correctAnswer: 1,
      explanation: 'a + 10d - (a + 4d) = 43 - 19 => 6d = 24 => d = 4.'
    },
    {
      title: 'GP Common Ratio',
      description: 'In a Geometric Progression, the 3rd term is 24 and the 6th term is 192. Find the common ratio.',
      options: ['2', '3', '4', '8'],
      correctAnswer: 0,
      explanation: 'ar^5 / ar^2 = 192 / 24 => r^3 = 8 => r = 2.'
    },
    {
      title: 'Markup and Discount Cost Price',
      description: 'Marked price of a laptop is $1,200. The shopkeeper gives 10% discount and still makes 20% profit. What was the cost price?',
      options: ['$850', '$900', '$950', '$1,000'],
      correctAnswer: 1,
      explanation: 'SP = 1200 * 0.9 = $1,080. CP = 1080 / 1.20 = $900.'
    },
    {
      title: 'Speed Conversion km/h to m/s',
      description: 'Convert a speed of 90 km/h into meters per second (m/s).',
      options: ['20 m/s', '22.5 m/s', '25 m/s', '30 m/s'],
      correctAnswer: 2,
      explanation: '90 * (5/18) = 25 m/s.'
    },
    {
      title: 'Clock Hand Angle',
      description: 'What is the angle between the hour hand and minute hand of a clock at 3:30?',
      options: ['60°', '75°', '85°', '90°'],
      correctAnswer: 1,
      explanation: 'Angle = |30H - 5.5M| = |30(3) - 5.5(30)| = |90 - 165| = 75°.'
    },
    {
      title: 'Calendar Day of Week',
      description: 'If 1st January 2024 was a Monday, what day of the week was 1st January 2025? (Note: 2024 is a leap year).',
      options: ['Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      correctAnswer: 1,
      explanation: '2024 is a leap year with 2 odd days. Monday + 2 days = Wednesday.'
    },
    {
      title: 'Work Efficiency 3 Workers',
      description: 'A can complete a task in 10 days, B in 12 days, and C in 15 days. If all three work together, how many days will it take?',
      options: ['3 days', '4 days', '5 days', '6 days'],
      correctAnswer: 1,
      explanation: '1/10 + 1/12 + 1/15 = 15/60 = 1/4 per day. Total time = 4 days.'
    },
    {
      title: 'Pipe Filling Percentage',
      description: 'A pipe fills a tank at 15 liters per minute. If the total tank capacity is 900 liters, what percentage of the tank is filled in 30 minutes?',
      options: ['30%', '40%', '50%', '60%'],
      correctAnswer: 2,
      explanation: 'In 30 mins, filled = 15 * 30 = 450 liters. Percentage = (450 / 900) * 100 = 50%.'
    },
    {
      title: 'Simple Interest Tripling',
      description: 'A sum of money triples itself in 10 years under Simple Interest. What is the annual interest rate?',
      options: ['15%', '20%', '25%', '30%'],
      correctAnswer: 1,
      explanation: 'Interest = 2P. 2P = P * R * 10 / 100 => R = 20%.'
    },
    {
      title: 'LCM and HCF Number Pairs',
      description: 'The product of two numbers is 2,028 and their HCF is 13. How many possible pairs of such numbers exist?',
      options: ['1 pair', '2 pairs', '3 pairs', '4 pairs'],
      correctAnswer: 1,
      explanation: '13a * 13b = 2028 => ab = 12. Co-prime pairs for (a,b) are (1,12) and (3,4) => 2 pairs.'
    }
  ];

  return aptitudeData.map((q, idx) => ({
    id: `q-apt-${idx + 1}`,
    categoryId: 'cat-aptitude',
    categoryName: 'Aptitude',
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
