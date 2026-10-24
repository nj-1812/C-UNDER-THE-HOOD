/* =========================================================
   SYNTAX SQUAD — GAME CONTENT
   Edit questions, explanations and timings here.
   Inside JS strings, write a C newline as \\n (shows as \n).
   ========================================================= */
window.SQ = {};

/* ---------- HEROES (all original characters) ---------- */
SQ.HEROES = {
  rookie:    { name: 'ROOKIE',    glyph: '>_', color: '#22D3EE', dark: '#0E5566', accent: '#E0FBFF', concept: 'That\'s you!',
               bio: 'A first-year cadet with zero powers and unlimited curiosity. Every mission you clear makes the squad stronger — and makes you a real programmer.' },
  header:    { name: 'HEADER',    glyph: '#',  color: '#E3262F', dark: '#5E0A10', accent: '#22D3EE', concept: '#include <stdio.h>',
               bio: 'Keeper of the stdio toolbox. Without HEADER, nobody in a program can speak or listen — printf and scanf live in the box he carries.' },
  fullstop:  { name: 'FULLSTOP',  glyph: ';',  color: '#F59E0B', dark: '#6B3B02', accent: '#FFF7E0', concept: 'The semicolon ;',
               bio: 'She ends every instruction cleanly. Wherever FULLSTOP is missing, two commands crash into one confusing sentence.' },
  architect: { name: 'ARCHITECT', glyph: '{}', color: '#8B5CF6', dark: '#2E1765', accent: '#EDE4FF', concept: 'main() and { }',
               bio: 'Builds every program in the right order: toolbox first, front door next, walls around the work, and a safe report at the end.' },
  vault:     { name: 'VAULT',     glyph: '▦',  color: '#10B981', dark: '#064E3B', accent: '#D1FAE5', concept: 'Variables & data types',
               bio: 'Guardian of the RAM wall. VAULT hands out labelled boxes — but only the right kind of box for the right kind of value.' },
  blink:     { name: 'BLINK',     glyph: '&',  color: '#38BDF8', dark: '#0B3F5E', accent: '#E0F2FE', concept: 'scanf and &',
               bio: 'Teleports values straight into memory. Give BLINK an address and the package arrives instantly. Give only a name and BLINK gets lost.' },
  seer:      { name: 'SEER',      glyph: '◉',  color: '#EC4899', dark: '#5E1239', accent: '#FCE7F3', concept: 'Predicting output',
               bio: 'Reads code like a prophecy and sees the output before it runs. Train your eyes to see what SEER sees.' },
  segfault:  { name: 'SEGFAULT',  glyph: '✖',  color: '#FF1F3D', dark: '#2A0007', accent: '#FF8A9B', villain: true, concept: 'The final boss',
               bio: 'A glitch-born villain who crashes careless programs. Only a complete, correct program can defeat him.' }
};
SQ.SQUAD_ORDER = ['header', 'fullstop', 'architect', 'vault', 'blink', 'seer', 'segfault', 'rookie'];

/* ---------- ROUNDS (minutes = default timer) ---------- */
SQ.ROUNDS = [
  { id: 'r1', hero: 'header', title: 'THE MISSING TOOLBOX', level: 'Easy', minutes: 10,
    concept: '#include · main() · { } · return 0;',
    origin: 'A brand-new robot has just powered up, but it cannot say a single word. HEADER holds the toolbox that gives programs a voice. Build the robot\'s first program one line at a time — and discover <b>why</b> every line exists.' },
  { id: 'r2', hero: 'fullstop', title: 'SEMICOLON HUNT', level: 'Easy', minutes: 10,
    concept: ';   " "   ( )   { }   \\n',
    origin: 'Bugs have broken into the code base! FULLSTOP needs sharp eyes. Find the broken line in each program, then pick the right fix. Fast answers and streaks multiply your points.' },
  { id: 'r3', hero: 'architect', title: 'CODE JIGSAW', level: 'Easy', minutes: 10,
    concept: 'Program structure & order',
    origin: 'ARCHITECT\'s blueprints got shuffled. Rebuild each program in the right order — toolbox first, front door next, the work inside the walls, and the report at the end.' },
  { id: 'r4', hero: 'vault', title: 'MEMORY BOXES', level: 'Medium', minutes: 10,
    concept: 'int · float · char · %d %f %c',
    origin: 'Values are falling onto the RAM wall! Help VAULT store each one in the right type of box, then match the format codes that let printf read them.' },
  { id: 'r5', hero: 'blink', title: 'COURIER MISSION', level: 'Medium', minutes: 10,
    concept: 'scanf · &',
    origin: 'The user typed something, and BLINK must teleport it into memory. But BLINK only travels to <b>addresses</b>. Write scanf lines that get every package delivered.' },
  { id: 'r6', hero: 'seer', title: 'PREDICT THE OUTPUT', level: 'Medium', minutes: 8,
    concept: 'Everything so far',
    origin: 'SEER sees the output before the code runs. You get 15 seconds per question — the faster you see it, the more points you earn.' },
  { id: 'boss', hero: 'segfault', title: 'BOSS: SEGFAULT', level: 'Boss', minutes: 10, boss: true,
    concept: 'Your first complete program',
    origin: 'SEGFAULT has crashed the city\'s computers. Only a complete, correct program can stop him. Every correct part you write drains his health. Write it from scratch — you already have every power you need.' }
];

/* ---------- WHY CARDS ---------- */
SQ.CARDS = {
  printf: { title: 'printf', code: 'printf("Hi");',
    why: '<code>printf</code> prints text on the screen. The <b>f</b> stands for <b>formatted</b> — it can mix your text with values from variables. The text goes inside double quotes.',
    analogy: 'printf is the announcer on the college mic: whatever you hand it, it announces to everyone.',
    exam: 'printf() is a standard library function, declared in stdio.h, that writes formatted output to the standard output (the screen).' },
  include: { title: '#include <stdio.h>', code: '#include <stdio.h>',
    why: '<code>printf</code> and <code>scanf</code> are not built into C. They live in a toolbox called <code>stdio.h</code> — <b>St</b>andar<b>d</b> <b>I</b>nput <b>O</b>utput, the tools for talking to the keyboard and screen. <code>.h</code> means header file: a menu card listing the tools. <code>#include</code> copies that toolbox into your program, and the <code>#</code> marks it as an instruction for the <b>preprocessor</b>, a helper that prepares your code before compiling.',
    analogy: 'You can\'t make tea in a kitchen with no stove. #include brings the stove into your kitchen.',
    exam: '#include is a preprocessor directive that inserts the contents of the header file stdio.h, which declares standard input/output functions such as printf() and scanf().' },
  main: { title: 'int main()', code: 'int main()',
    why: 'Every C program needs exactly one starting point. When you run a program, the computer looks for <code>main</code> and starts there. <code>int</code> means main hands back a whole number when it finishes. The <code>()</code> is where main could receive information — you\'ll use that later.',
    analogy: 'main is the front door of your house. Every guest comes in through the front door.',
    exam: 'main() is the entry point of a C program; execution begins at main. Its return type int indicates that it returns an integer status to the operating system.' },
  braces: { title: 'Curly braces { }', code: '{  ...  }',
    why: '<code>{</code> and <code>}</code> mark the start and end of main\'s work. Every instruction between them belongs to main. They always come in pairs.',
    analogy: 'Braces are the walls of a room. Anything inside the walls is in that room.',
    exam: 'Curly braces define a block (compound statement); here they enclose the body of the function main().' },
  semicolon: { title: 'The semicolon ;', code: ';',
    why: 'A semicolon tells the compiler where one instruction ends. Without it, the compiler reads two lines as one long, confusing sentence and complains.',
    analogy: 'The semicolon is the full stop of C. Every sentence needs one.',
    exam: 'In C, the semicolon is a statement terminator. Every simple statement must end with a semicolon.' },
  return: { title: 'return 0;', code: 'return 0;',
    why: '<code>return 0;</code> is main\'s report to the operating system. <b>0 means "everything went fine"</b>. Any other number signals that something went wrong.',
    analogy: 'Like messaging your mom "Reached safely!" after a trip.',
    exam: 'return 0; terminates main() and returns exit status 0 to the operating system, indicating successful execution.' },
  newline: { title: 'Newline \\n', code: 'printf("Hi\\n");',
    why: '<code>\\n</code> is a special code that means "move to the next line". Without it, the next output gets glued onto the same line. It goes <b>inside</b> the quotes and uses a <b>back</b>slash.',
    analogy: 'Pressing Enter at the end of a line while typing a message.',
    exam: '\\n is an escape sequence representing the newline character.' },
  case: { title: 'C is case-sensitive', code: 'printf ≠ Printf',
    why: 'To C, <code>printf</code> and <code>Printf</code> are completely different names. Keywords like <code>int</code>, <code>return</code> and library names like <code>printf</code> are all lowercase.',
    analogy: '"Ram" and "ram" can be two different usernames on Instagram.',
    exam: 'C is a case-sensitive language: identifiers that differ only in letter case are treated as distinct.' },
  variable: { title: 'Variables', code: 'int marks = 95;',
    why: 'Your computer\'s RAM is a huge wall of tiny boxes. A variable is a box you reserve and label, so you can store a value and use it later. <code>int marks = 95;</code> reserves a box named <code>marks</code> and puts 95 inside.',
    analogy: 'A labelled tiffin box: the label is the name, the food inside is the value.',
    exam: 'A variable is a named memory location used to store data. It must be declared with a data type before it is used.' },
  types: { title: 'Data types', code: 'int · float · char',
    why: 'The data type tells the computer how big the box is and how to read what\'s inside. <code>int</code> = whole numbers, <code>float</code> = numbers with a decimal point, <code>char</code> = one single character in single quotes.',
    analogy: 'A tumbler for water, a plate for rice, a small cup for chutney. Each container fits one kind of thing.',
    exam: 'Data types specify the kind and size of data a variable can hold: int (integer), float (single-precision floating point), char (single character).' },
  format: { title: 'Format codes %d %f %c', code: 'printf("%d", age);',
    why: 'printf doesn\'t know what type your value is. Format codes tell it: <code>%d</code> for int, <code>%f</code> for float, <code>%c</code> for char. The value goes after the comma and replaces the code.',
    analogy: 'The canteen token says "Dosa" so the counter knows exactly what to hand you.',
    exam: 'Format specifiers such as %d, %f and %c specify the type of data to be printed by printf() or read by scanf().' },
  ampersand: { title: 'The & in scanf', code: 'scanf("%d", &age);',
    why: 'scanf has to <b>put</b> a value into your box, so it needs the box\'s <b>address</b>, not just its name. <code>&</code> means "address of", so <code>&age</code> means "the address of the box called age".',
    analogy: 'A courier needs your house address, not just your name, to deliver the parcel.',
    exam: '& is the address-of operator. scanf() requires the addresses of the variables in which it stores the input values.' },
  intdiv: { title: 'Integer division', code: '7 / 2  →  3',
    why: 'When both numbers are <code>int</code>, division throws away the decimal part: 7 / 2 gives 3, not 3.5. Use float values if you need the decimals.',
    analogy: 'Sharing 7 laddoos between 2 friends without breaking any: each gets 3.',
    exam: 'In C, dividing one integer by another performs integer division, which truncates the fractional part of the result.' },
  modulo: { title: 'Remainder %', code: '10 % 3  →  1',
    why: 'Between two numbers, <code>%</code> gives the <b>remainder</b> after division: 10 % 3 is 1.',
    analogy: 'The one laddoo left over after sharing equally.',
    exam: 'The modulus operator % yields the remainder of an integer division.' },
  if: { title: 'if / else', code: 'if (sum > 100) { ... }',
    why: '<code>if</code> lets your program make a decision. The code under it runs only when the condition inside <code>( )</code> is true. <code>else</code> runs when it\'s false.',
    analogy: 'If it\'s raining, take an umbrella; else, take sunglasses.',
    exam: 'The if statement executes a statement or block only when its condition evaluates to true (non-zero); the optional else part executes otherwise.' }
};

/* ---------- ROUND 1: "What if I remove it?" lab ---------- */
SQ.BREAK = [
  { line: '#include <stdio.h>', why: 'The toolbox is gone, so the computer no longer knows printf. Compiler: <i>implicit declaration of function \'printf\'</i>.' },
  { line: 'int main() {', why: 'No front door! The program has no starting point. Linker: <i>undefined reference to \'main\'</i>.' },
  { line: '    printf("Hi\\n");', why: 'The program compiles and runs perfectly… and says nothing. The screen stays empty.' },
  { line: '    return 0;', why: 'Modern compilers quietly assume <code>return 0</code> for main, but writing it is good practice: main should always report "all good" to the operating system.' },
  { line: '}', why: 'Main\'s room has no closing wall. Compiler: <i>expected \'}\' at end of input</i>.' }
];

/* ---------- ROUND 2: SEMICOLON HUNT ---------- */
SQ.R2 = [
  { lines: ['#include <stdio.h>', 'int main() {', '    printf("Hello")', '    return 0;', '}'], bug: 2,
    options: ['printf("Hello");', 'printf(Hello);', 'printf "Hello";'], answer: 0,
    why: 'Every statement ends with <code>;</code> — the full stop of C. Without it the compiler reads two lines as one sentence.', card: 'semicolon' },
  { lines: ['#include <stdio.h>', 'int main() {', '    printf("Hi);', '    return 0;', '}'], bug: 2,
    options: ['printf("Hi");', 'printf(Hi);', 'printf("Hi)";'], answer: 0,
    why: 'Text needs a <b>pair</b> of double quotes: one to open, one to close.' },
  { lines: ['#include <stdio.h>', 'int main()', '    printf("Hi");', '    return 0;', '}'], bug: 1,
    options: ['int main() {', 'int main();', 'main() int'], answer: 0,
    why: 'There\'s a closing wall <code>}</code> but no opening wall <code>{</code>. Braces always come in pairs.', card: 'braces' },
  { lines: ['#include <stdio.h>', 'int main() {', '    print("Welcome");', '    return 0;', '}'], bug: 2,
    options: ['printf("Welcome");', 'print("Welcome")', 'echo("Welcome");'], answer: 0,
    why: 'The function is <code>printf</code> — print + f for <b>formatted</b>. C only knows the exact name.', card: 'printf' },
  { lines: ['#include <stdio.h>', 'int main() {', '    Printf("Hi");', '    return 0;', '}'], bug: 2,
    options: ['printf("Hi");', 'PRINTF("Hi");', 'Printf("Hi")'], answer: 0,
    why: 'C is case-sensitive. <code>Printf</code> and <code>printf</code> are different names, and library names are lowercase.', card: 'case' },
  { lines: ['include <stdio.h>', 'int main() {', '    printf("Hi");', '    return 0;', '}'], bug: 0,
    options: ['#include <stdio.h>', 'include stdio.h', '#include stdio'], answer: 0,
    why: 'The <code>#</code> marks an instruction for the preprocessor. Without it, the compiler sees a strange word and gets confused.', card: 'include' },
  { lines: ['#include <stdio>', 'int main() {', '    printf("Hi");', '    return 0;', '}'], bug: 0,
    options: ['#include <stdio.h>', '#include <studio.h>', '#include "stdio"'], answer: 0,
    why: 'The toolbox file is <code>stdio.h</code>: standard input output, and <code>.h</code> marks a header file. (Not "studio"!)' },
  { lines: ['#include <stdio.h>', 'int mian() {', '    printf("Hi");', '    return 0;', '}'], bug: 1,
    options: ['int main() {', 'int Main() {', 'int mian {'], answer: 0,
    why: 'The computer looks for a door named exactly <code>main</code>. Misspell it and there\'s no starting point.', card: 'main' },
  { note: 'The output came out as <code>HelloWorld</code>, but we wanted two separate lines.',
    lines: ['#include <stdio.h>', 'int main() {', '    printf("Hello");', '    printf("World");', '    return 0;', '}'], bug: 2,
    options: ['printf("Hello\\n");', 'printf("Hello"\\n);', 'printf("Hello/n");'], answer: 0,
    why: '<code>\\n</code> means "move to a new line". It goes <b>inside</b> the quotes, and it\'s a <b>back</b>slash.', card: 'newline' },
  { lines: ['#include <stdio.h>', 'int main() {', "    printf('Hello');", '    return 0;', '}'], bug: 2,
    options: ['printf("Hello");', "printf('Hello')", 'printf(`Hello`);'], answer: 0,
    why: 'Text (a string) always uses double quotes. Single quotes are only for <b>one</b> character, like <code>\'A\'</code>.' },
  { lines: ['#include <stdio.h>', 'int main() {', '    printf "Hi";', '    return 0;', '}'], bug: 2,
    options: ['printf("Hi");', 'printf["Hi"];', 'printf{"Hi"};'], answer: 0,
    why: 'Functions take their input inside round brackets <code>( )</code>.' },
  { lines: ['#include <stdio.h>', 'int main(); {', '    printf("Hi");', '    return 0;', '}'], bug: 1,
    options: ['int main() {', 'int main(); {}', 'int main;'], answer: 0,
    why: 'A <code>;</code> after <code>main()</code> ends it right there, so the door shuts before the room begins. No semicolon on that line!' }
];

/* ---------- ROUND 3: CODE JIGSAW ----------
   k = line kind (used for explanations), g = lines with the same g may swap places */
const L_INC = { t: '#include <stdio.h>', k: 'inc' };
const L_MAIN = { t: 'int main() {', k: 'main' };
const L_RET = { t: '    return 0;', k: 'ret' };
const L_CLOSE = { t: '}', k: 'close' };
SQ.R3 = [
  { goal: 'Build the classic first program.', output: 'Hello, Squad!',
    lines: [L_INC, L_MAIN, { t: '    printf("Hello, Squad!\\n");', k: 'print' }, L_RET, L_CLOSE] },
  { goal: 'Print two lines — in the right order.', output: 'Hello!\nI am learning C.',
    lines: [L_INC, L_MAIN, { t: '    printf("Hello!\\n");', k: 'print' }, { t: '    printf("I am learning C.\\n");', k: 'print' }, L_RET, L_CLOSE] },
  { goal: 'Create a box, then print what\'s inside.', output: 'Marks: 95',
    lines: [L_INC, L_MAIN, { t: '    int marks = 95;', k: 'decl' }, { t: '    printf("Marks: %d\\n", marks);', k: 'print' }, L_RET, L_CLOSE] },
  { goal: 'Two boxes of different types.', output: 'Age: 18\nHeight: 5.700000',
    lines: [L_INC, L_MAIN, { t: '    int age = 18;', k: 'decl', g: 'd' }, { t: '    float height = 5.7;', k: 'decl', g: 'd' },
            { t: '    printf("Age: %d\\n", age);', k: 'print' }, { t: '    printf("Height: %f\\n", height);', k: 'print' }, L_RET, L_CLOSE] },
  { goal: 'Ask the user, read the answer, then show it.', output: 'Enter a number: 7\nYou typed 7',
    lines: [L_INC, L_MAIN, { t: '    int num;', k: 'decl', g: 'x' }, { t: '    printf("Enter a number: ");', k: 'prompt', g: 'x' },
            { t: '    scanf("%d", &num);', k: 'scan' }, { t: '    printf("You typed %d\\n", num);', k: 'print' }, L_RET, L_CLOSE] }
];
SQ.JIG_MSG = {
  inc: 'The toolbox <code>#include &lt;stdio.h&gt;</code> must be the very first line — before anything uses printf.',
  main: 'After the toolbox comes the front door: <code>int main() {</code>. All the work happens after it.',
  decl: 'A box must be created (declared) before you can store, read or print its value.',
  prompt: 'Ask first, then read: the question printf comes before scanf so the user knows what to type.',
  scan: 'You must read the value with scanf before you can print it.',
  print: 'Output appears top to bottom, in the order of your printf lines. Compare with the target output.',
  ret: '<code>return 0;</code> is main\'s final report — it comes after all the work, just before the closing <code>}</code>.',
  close: 'The closing wall <code>}</code> must be the very last line — everything belongs inside main\'s room.'
};

/* ---------- ROUND 4: MEMORY BOXES ---------- */
SQ.TYPE_DESC = { int: 'whole numbers', float: 'decimal numbers', char: "one character in ' '" };
SQ.R4 = [
  { kind: 'classify', v: '18', t: 'int', why: '18 is a whole number, so it goes in an <code>int</code> box.' },
  { kind: 'classify', v: '3.14', t: 'float', why: '3.14 has a decimal point, so it needs a <code>float</code> box.' },
  { kind: 'classify', v: "'A'", t: 'char', why: 'One character in single quotes is a <code>char</code>.' },
  { kind: 'classify', v: '99.5', t: 'float', why: 'Marks like 99.5 have a decimal part, so <code>float</code>.' },
  { kind: 'classify', v: '-7', t: 'int', why: 'Negative whole numbers are still <code>int</code>.' },
  { kind: 'classify', v: "'z'", t: 'char', why: 'One character in single quotes = <code>char</code>.' },
  { kind: 'classify', v: '2.0', t: 'float', why: 'Tricky! 2.0 has a decimal point, so C treats it as a decimal number: <code>float</code>.' },
  { kind: 'classify', v: '0', t: 'int', why: '0 is a whole number: <code>int</code>.' },
  { kind: 'mcq', card: 'format', q: 'Fill the blank so printf shows the age:', code: 'int age = 18;\nprintf("Age: ___", age);',
    options: ['%d', '%f', '%c'], answer: 0, hint: 'd stands for decimal integer.', why: '<code>%d</code> is the format code for an <code>int</code>.' },
  { kind: 'mcq', q: 'Fill the blank so printf shows the price:', code: 'float price = 49.5;\nprintf("Price: ___", price);',
    options: ['%d', '%f', '%c'], answer: 1, hint: 'Which letter starts the type name?', why: '<code>%f</code> is for <code>float</code> values.' },
  { kind: 'mcq', q: 'Fill the blank so printf shows the grade:', code: "char grade = 'A';\nprintf(\"Grade: ___\", grade);",
    options: ['%d', '%f', '%c'], answer: 2, hint: 'c for character.', why: '<code>%c</code> is for a single <code>char</code>acter.' },
  { kind: 'mcq', q: 'Which type fits this box?', code: '___ marks = 95;', options: ['int', 'float', 'char'], answer: 0,
    hint: 'Is there a decimal point?', why: '95 is a whole number, so <code>int</code>.' },
  { kind: 'mcq', q: 'Which type fits this box?', code: "___ section = 'B';", options: ['int', 'float', 'char'], answer: 2,
    hint: 'Look at the single quotes.', why: "'B' is one character in single quotes, so <code>char</code>." },
  { kind: 'mcq', q: 'Which type fits this box?', code: '___ temperature = 36.6;', options: ['int', 'float', 'char'], answer: 1,
    hint: 'Is there a decimal point?', why: '36.6 has a decimal part, so <code>float</code>.' },
  { kind: 'mcq', q: 'Which declaration is correct?', code: '', options: ['int 2marks = 90;', 'int marks = 90;', 'int marks = 90'], answer: 1,
    hint: 'Check how the name starts, and how the line ends.', why: 'Names cannot start with a digit, and every statement ends with <code>;</code>.' }
];

/* ---------- ROUND 5: COURIER MISSION ---------- */
SQ.R5 = [
  { decl: 'int age;', story: 'The user will type their age. Write the <code>scanf</code> line that delivers it into the box <code>age</code>.',
    typed: '18', expect: [{ t: 'd', v: 'age' }], vals: ['18'], answer: 'scanf("%d", &age);' },
  { decl: 'float height;', story: 'Now the user types their height in feet. Deliver it into <code>height</code>.',
    typed: '5.7', expect: [{ t: 'f', v: 'height' }], vals: ['5.7'], answer: 'scanf("%f", &height);' },
  { decl: 'char grade;', story: 'The user types a single letter grade. Deliver it into <code>grade</code>.',
    typed: 'A', expect: [{ t: 'c', v: 'grade' }], vals: ["'A'"], answer: 'scanf("%c", &grade);' },
  { decl: 'int a, b;', story: 'Double delivery! The user types two numbers. Deliver the first into <code>a</code> and the second into <code>b</code> — using <b>one</b> scanf.',
    typed: '10 20', expect: [{ t: 'd', v: 'a' }, { t: 'd', v: 'b' }], vals: ['10', '20'], answer: 'scanf("%d %d", &a, &b);' }
];

/* ---------- ROUND 6: PREDICT THE OUTPUT (15 s each) ---------- */
SQ.R6_SECONDS = 15;
SQ.R6 = [
  { code: 'printf("%d", 7 / 2);', options: ['3.5', '3', '4', '3.0'], answer: 1,
    hint: 'Both 7 and 2 are int. Can an int box hold a decimal?', why: 'Both numbers are <code>int</code>, so the decimal part is thrown away: 7 / 2 = 3.', card: 'intdiv' },
  { code: 'printf("Hi");\nprintf("Bye");', options: ['Hi Bye', 'HiBye', 'Hi\nBye', 'Error'], answer: 1,
    hint: 'Do you see any \\n?', why: 'No <code>\\n</code>, so the second output is glued to the first: <code>HiBye</code>.' },
  { code: 'printf("%d", 10 % 3);', options: ['3', '1', '0', '3.33'], answer: 1,
    hint: 'Between two numbers, % is not percentage.', why: '<code>%</code> gives the remainder: 10 ÷ 3 = 3 remainder <b>1</b>.', card: 'modulo' },
  { code: 'printf("%f", 5.0 / 2);', options: ['2.5', '2.500000', '2', '2.0'], answer: 1,
    hint: 'How many decimal places does %f show by default?', why: '5.0 is a decimal number, so the result is 2.5 — and <code>%f</code> shows 6 decimal places by default: 2.500000.' },
  { code: "printf(\"%c\", 'A');", options: ['A', "'A'", '65', '%c'], answer: 0,
    hint: '%c prints the character itself.', why: '<code>%c</code> prints the character, without quotes: A.' },
  { code: 'printf("Sum = %d", 2 + 3);', options: ['Sum = 2 + 3', 'Sum = 5', '5', 'Sum = %d'], answer: 1,
    hint: 'The value after the comma replaces %d.', why: 'The text prints as-is and <code>%d</code> is replaced by the value of 2 + 3, which is 5.' },
  { code: 'int x = 5;\nx = x + 1;\nprintf("%d", x);', options: ['5', '6', '51', 'Error'], answer: 1,
    hint: 'Take what\'s in the box, add 1, put it back.', why: '<code>x = x + 1</code> takes the value from the box (5), adds 1, and stores 6 back in the box.' },
  { code: "char c = 'A';\nprintf(\"%d\", c);", options: ['A', '65', '1', 'Error'], answer: 1,
    hint: 'Inside the computer, characters are stored as numbers.', why: 'Characters are stored as numbers (ASCII codes). Printing \'A\' with <code>%d</code> shows its code: 65.' },
  { code: 'printf("%d", 2 + 3 * 4);', options: ['20', '14', '24', '9'], answer: 1,
    hint: 'Remember BODMAS.', why: 'Multiplication happens first: 3 × 4 = 12, then 2 + 12 = 14.' },
  { code: 'int a = 10;\nif (a > 5)\n    printf("Big");\nelse\n    printf("Small");', options: ['Big', 'Small', 'BigSmall', 'Error'], answer: 0,
    hint: 'Is 10 greater than 5?', why: '10 > 5 is true, so only the <code>if</code> part runs: Big.', card: 'if' }
];

/* ---------- HOST PANEL ---------- */
SQ.HOST_PIN = '2026';
