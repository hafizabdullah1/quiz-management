const fs = require('fs');

const questions = [
  // HTML (10)
  {
    question_text: "What does the HTML <template> element do?",
    option_a: "It renders its content immediately on page load.",
    option_b: "It holds client-side content that is not to be rendered when a page is loaded but may subsequently be instantiated during runtime.",
    option_c: "It creates a grid layout template automatically.",
    option_d: "It defines a new custom web component.",
    correct_answer: "B",
    category: "HTML",
    difficulty: "Medium"
  },
  {
    question_text: "Which attribute specifies that an input field must be filled out before submitting the form?",
    option_a: "validate",
    option_b: "placeholder",
    option_c: "required",
    option_d: "important",
    correct_answer: "C",
    category: "HTML",
    difficulty: "Easy"
  },
  {
    question_text: "In HTML5, which element is used to specify a footer for a document or section?",
    option_a: "<bottom>",
    option_b: "<section>",
    option_c: "<footer>",
    option_d: "<end>",
    correct_answer: "C",
    category: "HTML",
    difficulty: "Easy"
  },
  {
    question_text: "What is the correct HTML element for playing video files?",
    option_a: "<movie>",
    option_b: "<media>",
    option_c: "<video>",
    option_d: "<play>",
    correct_answer: "C",
    category: "HTML",
    difficulty: "Easy"
  },
  {
    question_text: "Which HTML attribute is used to define inline styles?",
    option_a: "class",
    option_b: "font",
    option_c: "styles",
    option_d: "style",
    correct_answer: "D",
    category: "HTML",
    difficulty: "Easy"
  },
  {
    question_text: "What is the semantic meaning of the <mark> element?",
    option_a: "Defines text that has been deleted",
    option_b: "Highlights text for reference or relevance",
    option_c: "Creates a bookmark link",
    option_d: "Bolds the text for visual emphasis only",
    correct_answer: "B",
    category: "HTML",
    difficulty: "Medium"
  },
  {
    question_text: "How do you specify an alternate text for an image, if the image cannot be displayed?",
    option_a: "alt",
    option_b: "title",
    option_c: "src",
    option_d: "longdesc",
    correct_answer: "A",
    category: "HTML",
    difficulty: "Easy"
  },
  {
    question_text: "Which HTML5 API allows you to store data locally within the user's browser with no expiration time?",
    option_a: "SessionStorage",
    option_b: "Cookies",
    option_c: "LocalStorage",
    option_d: "WebSQL",
    correct_answer: "C",
    category: "HTML",
    difficulty: "Medium"
  },
  {
    question_text: "Which of the following is NOT a valid HTML5 input type?",
    option_a: "color",
    option_b: "date",
    option_c: "email",
    option_d: "ip_address",
    correct_answer: "D",
    category: "HTML",
    difficulty: "Medium"
  },
  {
    question_text: "What does the 'defer' attribute do when used in a <script> tag?",
    option_a: "It blocks HTML parsing until the script is fully downloaded and executed.",
    option_b: "It delays the execution of the script until the HTML parser has finished.",
    option_c: "It prevents the script from executing.",
    option_d: "It executes the script asynchronously as soon as it is downloaded.",
    correct_answer: "B",
    category: "HTML",
    difficulty: "Hard"
  },

  // CSS & Tailwind (10)
  {
    question_text: "In Tailwind CSS, how do you apply a class only on hover?",
    option_a: "onhover:bg-blue-500",
    option_b: "hover-bg-blue-500",
    option_c: "hover:bg-blue-500",
    option_d: "active:bg-blue-500",
    correct_answer: "C",
    category: "CSS & Tailwind",
    difficulty: "Easy"
  },
  {
    question_text: "What is the CSS property used to control the space between flex items?",
    option_a: "margin",
    option_b: "padding",
    option_c: "gap",
    option_d: "spacing",
    correct_answer: "C",
    category: "CSS & Tailwind",
    difficulty: "Medium"
  },
  {
    question_text: "Which of the following CSS selectors targets all <p> elements that are direct children of a <div>?",
    option_a: "div p",
    option_b: "div > p",
    option_c: "div + p",
    option_d: "div ~ p",
    correct_answer: "B",
    category: "CSS & Tailwind",
    difficulty: "Medium"
  },
  {
    question_text: "In Tailwind CSS, what does the class 'md:flex' signify?",
    option_a: "Apply display: flex only on mobile devices.",
    option_b: "Apply display: flex on screens equal to or larger than the 'md' breakpoint.",
    option_c: "Apply display: flex on screens smaller than the 'md' breakpoint.",
    option_d: "Create a flex container that is medium-sized.",
    correct_answer: "B",
    category: "CSS & Tailwind",
    difficulty: "Easy"
  },
  {
    question_text: "What is the default position value of an HTML element in CSS?",
    option_a: "relative",
    option_b: "fixed",
    option_c: "absolute",
    option_d: "static",
    correct_answer: "D",
    category: "CSS & Tailwind",
    difficulty: "Easy"
  },
  {
    question_text: "Which Tailwind utility is used to center an absolutely positioned element horizontally and vertically?\\n`top-1/2 left-1/2 ___`",
    option_a: "-translate-x-1/2 -translate-y-1/2",
    option_b: "transform-center",
    option_c: "margin-auto",
    option_d: "flex-center",
    correct_answer: "A",
    category: "CSS & Tailwind",
    difficulty: "Hard"
  },
  {
    question_text: "How do you write a CSS variable (custom property)?",
    option_a: "$main-color: blue;",
    option_b: "@main-color: blue;",
    option_c: "--main-color: blue;",
    option_d: "var main-color = blue;",
    correct_answer: "C",
    category: "CSS & Tailwind",
    difficulty: "Medium"
  },
  {
    question_text: "What is 'z-index' used for in CSS?",
    option_a: "Zooming an image",
    option_b: "Controlling the vertical stacking order of elements that overlap",
    option_c: "Setting the z-axis rotation of a 3D element",
    option_d: "Defining the opacity of an element",
    correct_answer: "B",
    category: "CSS & Tailwind",
    difficulty: "Easy"
  },
  {
    question_text: "What does the Tailwind class 'w-full' translate to in pure CSS?",
    option_a: "width: 100vw;",
    option_b: "width: 100%;",
    option_c: "width: auto;",
    option_d: "width: max-content;",
    correct_answer: "B",
    category: "CSS & Tailwind",
    difficulty: "Easy"
  },
  {
    question_text: "If an element has 'box-sizing: border-box', how is its total width calculated?",
    option_a: "Width = content width + padding + border",
    option_b: "Width = content width (padding and border are included inside this width)",
    option_c: "Width = content width + margin",
    option_d: "Width = content width + padding + border + margin",
    correct_answer: "B",
    category: "CSS & Tailwind",
    difficulty: "Hard"
  },

  // JavaScript (10)
  {
    question_text: "What is the output of the following code?\\n```js\\nconsole.log(typeof null);\\n```",
    option_a: "\"undefined\"",
    option_b: "\"null\"",
    option_c: "\"object\"",
    option_d: "Throws an error",
    correct_answer: "C",
    category: "JavaScript",
    difficulty: "Medium"
  },
  {
    question_text: "Which keyword is used to declare a block-scoped, re-assignable variable in ES6?",
    option_a: "var",
    option_b: "let",
    option_c: "const",
    option_d: "block",
    correct_answer: "B",
    category: "JavaScript",
    difficulty: "Easy"
  },
  {
    question_text: "What is the output of `0 == \"0\"` and `0 === \"0\"` respectively?",
    option_a: "true, true",
    option_b: "false, false",
    option_c: "true, false",
    option_d: "false, true",
    correct_answer: "C",
    category: "JavaScript",
    difficulty: "Medium"
  },
  {
    question_text: "How do you create an arrow function in JavaScript?",
    option_a: "function = () => {}",
    option_b: "() => {}",
    option_c: "=> function() {}",
    option_d: "function() => {}",
    correct_answer: "B",
    category: "JavaScript",
    difficulty: "Easy"
  },
  {
    question_text: "What will this code output?\\n```js\\nconsole.log([] + []);\\n```",
    option_a: "[]",
    option_b: "undefined",
    option_c: "\"\"",
    option_d: "NaN",
    correct_answer: "C",
    category: "JavaScript",
    difficulty: "Hard"
  },
  {
    question_text: "Which array method creates a new array populated with the results of calling a provided function on every element?",
    option_a: "forEach()",
    option_b: "map()",
    option_c: "filter()",
    option_d: "reduce()",
    correct_answer: "B",
    category: "JavaScript",
    difficulty: "Easy"
  },
  {
    question_text: "What is a Closure in JavaScript?",
    option_a: "A function bundled together with its lexical environment.",
    option_b: "A method used to close a database connection.",
    option_c: "The end of a code block denoted by `}`.",
    option_d: "A way to make variables completely public.",
    correct_answer: "A",
    category: "JavaScript",
    difficulty: "Medium"
  },
  {
    question_text: "What does `Promise.all()` do?",
    option_a: "Runs all promises sequentially.",
    option_b: "Returns a single Promise that resolves when all passed Promises have resolved.",
    option_c: "Returns the first Promise that resolves or rejects.",
    option_d: "Cancels all running Promises.",
    correct_answer: "B",
    category: "JavaScript",
    difficulty: "Medium"
  },
  {
    question_text: "What will this code output?\\n```js\\nsetTimeout(() => console.log('A'), 0);\\nconsole.log('B');\\n```",
    option_a: "A, then B",
    option_b: "B, then A",
    option_c: "Simultaneously",
    option_d: "Throws an error",
    correct_answer: "B",
    category: "JavaScript",
    difficulty: "Medium"
  },
  {
    question_text: "What is the result of `1 + \"1\" - 1` in JavaScript?",
    option_a: "1",
    option_b: "11",
    option_c: "10",
    option_d: "NaN",
    correct_answer: "C",
    category: "JavaScript",
    difficulty: "Hard"
  },

  // React (10)
  {
    question_text: "What Hook should be used to perform side effects in a React functional component?",
    option_a: "useContext",
    option_b: "useState",
    option_c: "useEffect",
    option_d: "useReducer",
    correct_answer: "C",
    category: "React",
    difficulty: "Easy"
  },
  {
    question_text: "What is the Virtual DOM in React?",
    option_a: "A direct clone of the actual DOM used for backups.",
    option_b: "A lightweight, in-memory representation of the real DOM.",
    option_c: "A separate browser window.",
    option_d: "A database structure to store React components.",
    correct_answer: "B",
    category: "React",
    difficulty: "Medium"
  },
  {
    question_text: "Why do we need to pass a unique `key` prop when rendering a list of elements in React?",
    option_a: "To style the elements individually.",
    option_b: "To help React identify which items have changed, are added, or are removed.",
    option_c: "To create an ID attribute in the HTML DOM.",
    option_d: "It is required for accessibility purposes.",
    correct_answer: "B",
    category: "React",
    difficulty: "Easy"
  },
  {
    question_text: "What will happen if you call `setState` inside the `render` method of a class component (or directly inside the function body of a functional component without a hook)?",
    option_a: "The state updates normally.",
    option_b: "React ignores the state update.",
    option_c: "It triggers an infinite loop of re-renders.",
    option_d: "It logs a warning but works.",
    correct_answer: "C",
    category: "React",
    difficulty: "Medium"
  },
  {
    question_text: "Consider the code:\\n```jsx\\n<div onClick={() => console.log('div')}>\\n  <button onClick={(e) => { e.stopPropagation(); console.log('btn'); }}>Click</button>\\n</div>\\n```\\nWhat logs when the button is clicked?",
    option_a: "div, btn",
    option_b: "btn, div",
    option_c: "btn",
    option_d: "div",
    correct_answer: "C",
    category: "React",
    difficulty: "Hard"
  },
  {
    question_text: "What is Prop Drilling?",
    option_a: "A new feature in React 18 for faster rendering.",
    option_b: "Passing props deep down the component tree through intermediate components that don't need them.",
    option_c: "A tool used to inspect React components.",
    option_d: "Connecting React to a database.",
    correct_answer: "B",
    category: "React",
    difficulty: "Medium"
  },
  {
    question_text: "Which Hook is best suited for managing complex state objects that involve multiple sub-values?",
    option_a: "useState",
    option_b: "useMemo",
    option_c: "useRef",
    option_d: "useReducer",
    correct_answer: "D",
    category: "React",
    difficulty: "Medium"
  },
  {
    question_text: "How do you conditionally render a component in JSX if `isLoggedIn` is true?",
    option_a: "<if condition={isLoggedIn}><Component /></if>",
    option_b: "{ isLoggedIn && <Component /> }",
    option_c: "<Component v-if={isLoggedIn} />",
    option_d: "{ if (isLoggedIn) <Component /> }",
    correct_answer: "B",
    category: "React",
    difficulty: "Easy"
  },
  {
    question_text: "What is the purpose of `useMemo`?",
    option_a: "To memoize a callback function.",
    option_b: "To cache the result of an expensive calculation between re-renders.",
    option_c: "To persist a mutable value without triggering a re-render.",
    option_d: "To remember the previous route.",
    correct_answer: "B",
    category: "React",
    difficulty: "Hard"
  },
  {
    question_text: "What is React Context used for?",
    option_a: "Routing between pages.",
    option_b: "Sharing data across the component tree without passing props manually at every level.",
    option_c: "Storing data persistently in the browser's LocalStorage.",
    option_d: "Validating prop types.",
    correct_answer: "B",
    category: "React",
    difficulty: "Easy"
  },

  // TypeScript (10)
  {
    question_text: "How do you specify that a parameter is optional in a TypeScript interface?",
    option_a: "prop?: type",
    option_b: "prop: optional type",
    option_c: "prop! type",
    option_d: "optional prop: type",
    correct_answer: "A",
    category: "TypeScript",
    difficulty: "Easy"
  },
  {
    question_text: "What is the 'any' type in TypeScript?",
    option_a: "A type that means the variable must be an array.",
    option_b: "A type that disables type checking for that variable.",
    option_c: "A strict type that only accepts primitive values.",
    option_d: "An alias for the 'unknown' type.",
    correct_answer: "B",
    category: "TypeScript",
    difficulty: "Easy"
  },
  {
    question_text: "What is the difference between an 'interface' and a 'type' alias in TypeScript?",
    option_a: "They are exactly the same with no differences.",
    option_b: "Interfaces can only be used for classes, types for variables.",
    option_c: "Interfaces can be merged (declaration merging), types cannot.",
    option_d: "Types are executed at runtime, interfaces are not.",
    correct_answer: "C",
    category: "TypeScript",
    difficulty: "Hard"
  },
  {
    question_text: "What does the 'readonly' modifier do?",
    option_a: "Prevents a variable from being exported.",
    option_b: "Makes a property immutable after initialization.",
    option_c: "Makes a class impossible to extend.",
    option_d: "Prevents a file from being edited.",
    correct_answer: "B",
    category: "TypeScript",
    difficulty: "Medium"
  },
  {
    question_text: "Which syntax is used to define a Generic type in TypeScript?",
    option_a: "Array(T)",
    option_b: "Array<T>",
    option_c: "Array[T]",
    option_d: "Array{T}",
    correct_answer: "B",
    category: "TypeScript",
    difficulty: "Medium"
  },
  {
    question_text: "What is the return type of a function that does not return any value?",
    option_a: "null",
    option_b: "undefined",
    option_c: "void",
    option_d: "empty",
    correct_answer: "C",
    category: "TypeScript",
    difficulty: "Easy"
  },
  {
    question_text: "In TypeScript, what is a Union Type?",
    option_a: "A type formed by combining multiple types into one object (e.g. A & B).",
    option_b: "A type that can be one of several types (e.g. string | number).",
    option_c: "A type that joins two arrays.",
    option_d: "A built-in data structure.",
    correct_answer: "B",
    category: "TypeScript",
    difficulty: "Medium"
  },
  {
    question_text: "What is a Type Assertion in TypeScript?",
    option_a: "Throwing an error when a type is wrong.",
    option_b: "Letting the compiler know that you know the type of a variable better than it does (e.g. `value as string`).",
    option_c: "A testing library feature to assert expected types.",
    option_d: "Automatically inferring a type based on usage.",
    correct_answer: "B",
    category: "TypeScript",
    difficulty: "Hard"
  },
  {
    question_text: "What does the 'unknown' type represent?",
    option_a: "A type-safe counterpart of 'any' that requires type narrowing before use.",
    option_b: "A type representing a missing value.",
    option_c: "A type used exclusively for unhandled promise rejections.",
    option_d: "A completely unrestricted type, same as 'any'.",
    correct_answer: "A",
    category: "TypeScript",
    difficulty: "Hard"
  },
  {
    question_text: "How do you declare an array of numbers in TypeScript?",
    option_a: "numbers: Array[number]",
    option_b: "numbers: number[]",
    option_c: "numbers: [number]",
    option_d: "numbers: List<number>",
    correct_answer: "B",
    category: "TypeScript",
    difficulty: "Easy"
  },

  // Next.js (10)
  {
    question_text: "In the Next.js App Router, which file is used to define a UI that is shared across multiple routes?",
    option_a: "page.tsx",
    option_b: "route.tsx",
    option_c: "layout.tsx",
    option_d: "template.tsx",
    correct_answer: "C",
    category: "Next.js",
    difficulty: "Easy"
  },
  {
    question_text: "What is the primary difference between a Server Component and a Client Component in Next.js?",
    option_a: "Client components cannot be styled.",
    option_b: "Server components can use React hooks like useState, Client components cannot.",
    option_c: "Server components render on the server and cannot use browser APIs/hooks; Client components run on the client.",
    option_d: "Server components use Express.js syntax.",
    correct_answer: "C",
    category: "Next.js",
    difficulty: "Medium"
  },
  {
    question_text: "Which directive must be added to the top of a file to opt into client-side rendering in the App Router?",
    option_a: "\"use server\"",
    option_b: "\"use client\"",
    option_c: "\"use browser\"",
    option_d: "\"use react\"",
    correct_answer: "B",
    category: "Next.js",
    difficulty: "Easy"
  },
  {
    question_text: "How do you create a dynamic route segment in the Next.js App Router?",
    option_a: "By creating a folder named `:id`",
    option_b: "By creating a folder named `[id]`",
    option_c: "By creating a file named `dynamic.tsx`",
    option_d: "By using the `<DynamicRoute>` component",
    correct_answer: "B",
    category: "Next.js",
    difficulty: "Medium"
  },
  {
    question_text: "What is the purpose of the `next/image` component?",
    option_a: "To draw SVGs dynamically.",
    option_b: "To apply CSS filters to images.",
    option_c: "To provide automatic image optimization, resizing, and lazy loading.",
    option_d: "To store images in the database.",
    correct_answer: "C",
    category: "Next.js",
    difficulty: "Easy"
  },
  {
    question_text: "What is a Next.js Server Action?",
    option_a: "A client-side event listener.",
    option_b: "An asynchronous function executed on the server that can be called directly from components.",
    option_c: "A Redux action used for state management.",
    option_d: "A middleware for routing.",
    correct_answer: "B",
    category: "Next.js",
    difficulty: "Hard"
  },
  {
    question_text: "Which file is used to define API routes in the Next.js App Router?",
    option_a: "api.tsx",
    option_b: "server.ts",
    option_c: "route.ts",
    option_d: "endpoint.ts",
    correct_answer: "C",
    category: "Next.js",
    difficulty: "Medium"
  },
  {
    question_text: "What does `generateStaticParams` do in Next.js App router?",
    option_a: "Fetches static files from the public folder.",
    option_b: "Generates static paths for dynamic routes at build time (similar to getStaticPaths).",
    option_c: "Minifies CSS and JS assets.",
    option_d: "Validates form parameters.",
    correct_answer: "B",
    category: "Next.js",
    difficulty: "Hard"
  },
  {
    question_text: "Which file is used to handle 404 Not Found errors for a specific route segment?",
    option_a: "error.tsx",
    option_b: "not-found.tsx",
    option_c: "404.tsx",
    option_d: "missing.tsx",
    correct_answer: "B",
    category: "Next.js",
    difficulty: "Medium"
  },
  {
    question_text: "In Next.js, what is the 'public' directory used for?",
    option_a: "Storing secret API keys.",
    option_b: "Serving static assets like images and fonts directly at the root URL.",
    option_c: "Defining global CSS files.",
    option_d: "Exporting components for public NPM packages.",
    correct_answer: "B",
    category: "Next.js",
    difficulty: "Easy"
  },

  // Node.js (10)
  {
    question_text: "What is Node.js?",
    option_a: "A JavaScript framework for building user interfaces.",
    option_b: "A JavaScript runtime built on Chrome's V8 JavaScript engine.",
    option_c: "A relational database management system.",
    option_d: "A CSS preprocessor.",
    correct_answer: "B",
    category: "Node.js",
    difficulty: "Easy"
  },
  {
    question_text: "Which core module is used to create an HTTP server in Node.js?",
    option_a: "net",
    option_b: "fs",
    option_c: "http",
    option_d: "server",
    correct_answer: "C",
    category: "Node.js",
    difficulty: "Easy"
  },
  {
    question_text: "What is the purpose of the 'fs' module in Node.js?",
    option_a: "To style front-end components.",
    option_b: "To interact with the file system (read/write files).",
    option_c: "To handle file uploads over HTTP.",
    option_d: "To format strings.",
    correct_answer: "B",
    category: "Node.js",
    difficulty: "Medium"
  },
  {
    question_text: "In Node.js, what does `__dirname` represent?",
    option_a: "The name of the currently executing script file.",
    option_b: "The absolute path of the directory containing the currently executing file.",
    option_c: "The root directory of the operating system.",
    option_d: "The user's home directory.",
    correct_answer: "B",
    category: "Node.js",
    difficulty: "Medium"
  },
  {
    question_text: "What is npm?",
    option_a: "Node Process Manager",
    option_b: "Node Package Manager",
    option_c: "New Project Module",
    option_d: "Network Protocol Manager",
    correct_answer: "B",
    category: "Node.js",
    difficulty: "Easy"
  },
  {
    question_text: "How does Node.js handle concurrency despite being single-threaded?",
    option_a: "By creating a new thread for each request natively.",
    option_b: "By using an Event Loop and asynchronous I/O operations.",
    option_c: "By executing tasks in parallel using the GPU.",
    option_d: "It does not handle concurrency.",
    correct_answer: "B",
    category: "Node.js",
    difficulty: "Hard"
  },
  {
    question_text: "Which of the following is used to import a module in CommonJS (the traditional Node.js module system)?",
    option_a: "import module from 'module'",
    option_b: "include('module')",
    option_c: "require('module')",
    option_d: "load('module')",
    correct_answer: "C",
    category: "Node.js",
    difficulty: "Easy"
  },
  {
    question_text: "What is the role of `package.json` in a Node.js project?",
    option_a: "It stores the source code of the application.",
    option_b: "It stores metadata about the project, including dependencies and scripts.",
    option_c: "It configures the database connection.",
    option_d: "It is an automated testing script.",
    correct_answer: "B",
    category: "Node.js",
    difficulty: "Easy"
  },
  {
    question_text: "Which object is used to emit and listen to custom events in Node.js?",
    option_a: "EventDispatcher",
    option_b: "EventEmitter",
    option_c: "EventTarget",
    option_d: "EventHandler",
    correct_answer: "B",
    category: "Node.js",
    difficulty: "Medium"
  },
  {
    question_text: "What does `process.env` do in Node.js?",
    option_a: "It terminates the Node.js process.",
    option_b: "It provides access to user environment variables.",
    option_c: "It creates a new isolated environment for execution.",
    option_d: "It measures the environmental performance of the app.",
    correct_answer: "B",
    category: "Node.js",
    difficulty: "Medium"
  },

  // Express.js (10)
  {
    question_text: "What is Express.js?",
    option_a: "A fast, unopinionated, minimalist web framework for Node.js.",
    option_b: "A database query language.",
    option_c: "A frontend state management library.",
    option_d: "A tool for bundling JavaScript files.",
    correct_answer: "A",
    category: "Express.js",
    difficulty: "Easy"
  },
  {
    question_text: "In Express, what are Middleware functions?",
    option_a: "Functions that execute database queries exclusively.",
    option_b: "Functions that have access to the request object, response object, and the next middleware function.",
    option_c: "Functions used to connect the frontend and backend servers.",
    option_d: "Functions that validate HTML forms.",
    correct_answer: "B",
    category: "Express.js",
    difficulty: "Medium"
  },
  {
    question_text: "How do you define a route that handles GET requests to the root URL ('/') in Express?",
    option_a: "app.get('/', (req, res) => {})",
    option_b: "app.route('GET', '/', (req, res) => {})",
    option_c: "server.get('/', (req, res) => {})",
    option_d: "express.get('/', (req, res) => {})",
    correct_answer: "A",
    category: "Express.js",
    difficulty: "Easy"
  },
  {
    question_text: "What method is used to send a JSON response in Express?",
    option_a: "res.sendJson()",
    option_b: "res.json()",
    option_c: "res.writeJson()",
    option_d: "req.json()",
    correct_answer: "B",
    category: "Express.js",
    difficulty: "Easy"
  },
  {
    question_text: "How do you extract the parameter 'id' from a URL like `/users/:id` in Express?",
    option_a: "req.query.id",
    option_b: "req.body.id",
    option_c: "req.params.id",
    option_d: "req.url.id",
    correct_answer: "C",
    category: "Express.js",
    difficulty: "Medium"
  },
  {
    question_text: "Which built-in middleware is used to parse incoming JSON payloads in Express 4.16+?",
    option_a: "express.json()",
    option_b: "body-parser.json()",
    option_c: "express.parseJson()",
    option_d: "app.useJson()",
    correct_answer: "A",
    category: "Express.js",
    difficulty: "Medium"
  },
  {
    question_text: "What does the `next()` function do in an Express middleware?",
    option_a: "Skips to the next request.",
    option_b: "Passes control to the next middleware function in the stack.",
    option_c: "Ends the response process.",
    option_d: "Throws an error to the error handler.",
    correct_answer: "B",
    category: "Express.js",
    difficulty: "Hard"
  },
  {
    question_text: "How do you handle 404 errors in an Express app?",
    option_a: "By placing a middleware with no route path at the very end of the route definitions.",
    option_b: "By overriding the default 404 code in process.env.",
    option_c: "By using app.error(404).",
    option_d: "Express handles 404 errors automatically with a custom page.",
    correct_answer: "A",
    category: "Express.js",
    difficulty: "Hard"
  },
  {
    question_text: "What is CORS, and why is it used in Express apps?",
    option_a: "Cross-Origin Resource Sharing; used to allow restricted resources to be requested from another domain.",
    option_b: "Custom Object Request Syntax; used for parsing custom JSON.",
    option_c: "Cross-Origin Routing System; used for load balancing.",
    option_d: "Core Output Response System; used for caching.",
    correct_answer: "A",
    category: "Express.js",
    difficulty: "Medium"
  },
  {
    question_text: "In Express, what is the role of `app.listen()`?",
    option_a: "It listens to user interactions on the frontend.",
    option_b: "It binds and listens for connections on the specified host and port.",
    option_c: "It watches for file changes and restarts the server.",
    option_d: "It listens to database connection events.",
    correct_answer: "B",
    category: "Express.js",
    difficulty: "Easy"
  },

  // MongoDB (10)
  {
    question_text: "What type of database is MongoDB?",
    option_a: "Relational Database (SQL)",
    option_b: "Graph Database",
    option_c: "NoSQL Document-oriented Database",
    option_d: "Key-Value Store",
    correct_answer: "C",
    category: "MongoDB",
    difficulty: "Easy"
  },
  {
    question_text: "In MongoDB, what is a Collection?",
    option_a: "A single row of data.",
    option_b: "A group of MongoDB documents (equivalent to an RDBMS table).",
    option_c: "A set of user permissions.",
    option_d: "A server cluster.",
    correct_answer: "B",
    category: "MongoDB",
    difficulty: "Easy"
  },
  {
    question_text: "What data format does MongoDB use to store documents?",
    option_a: "XML",
    option_b: "BSON (Binary JSON)",
    option_c: "CSV",
    option_d: "YAML",
    correct_answer: "B",
    category: "MongoDB",
    difficulty: "Medium"
  },
  {
    question_text: "Which field is automatically generated by MongoDB as a unique identifier for every document?",
    option_a: "id",
    option_b: "_uid",
    option_c: "uuid",
    option_d: "_id",
    correct_answer: "D",
    category: "MongoDB",
    difficulty: "Easy"
  },
  {
    question_text: "What is Mongoose?",
    option_a: "A GUI client for MongoDB.",
    option_b: "An Object Data Modeling (ODM) library for MongoDB and Node.js.",
    option_c: "A MongoDB hosting service.",
    option_d: "A frontend framework.",
    correct_answer: "B",
    category: "MongoDB",
    difficulty: "Medium"
  },
  {
    question_text: "Which command retrieves all documents from a collection named 'users'?",
    option_a: "db.users.getAll()",
    option_b: "db.users.fetch()",
    option_c: "db.users.find()",
    option_d: "db.users.query()",
    correct_answer: "C",
    category: "MongoDB",
    difficulty: "Easy"
  },
  {
    question_text: "How do you update a single document in MongoDB?",
    option_a: "db.collection.modifyOne()",
    option_b: "db.collection.change()",
    option_c: "db.collection.updateOne()",
    option_d: "db.collection.setOne()",
    correct_answer: "C",
    category: "MongoDB",
    difficulty: "Medium"
  },
  {
    question_text: "What does the MongoDB Aggregation Pipeline do?",
    option_a: "It replicates data across multiple servers.",
    option_b: "It provides a framework for data aggregation, allowing transformation and computation of data (like grouping and sorting).",
    option_c: "It connects MongoDB to SQL databases.",
    option_d: "It compresses the database size.",
    correct_answer: "B",
    category: "MongoDB",
    difficulty: "Hard"
  },
  {
    question_text: "In Mongoose, what is a Schema?",
    option_a: "A visual diagram of the database.",
    option_b: "A document that defines the structure, data types, and constraints of documents in a collection.",
    option_c: "A backup of the database.",
    option_d: "A server configuration file.",
    correct_answer: "B",
    category: "MongoDB",
    difficulty: "Medium"
  },
  {
    question_text: "Which operator is used in MongoDB to filter documents where a value is greater than a specified amount?",
    option_a: "$more",
    option_b: "$gt",
    option_c: "$greater",
    option_d: ">",
    correct_answer: "B",
    category: "MongoDB",
    difficulty: "Hard"
  }
];

function escapeCSV(str) {
  if (/[",\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

const header = "question_text,option_a,option_b,option_c,option_d,correct_answer,category,difficulty\n";
const csvRows = questions.map(q => {
  return [
    escapeCSV(q.question_text),
    escapeCSV(q.option_a),
    escapeCSV(q.option_b),
    escapeCSV(q.option_c),
    escapeCSV(q.option_d),
    escapeCSV(q.correct_answer),
    escapeCSV(q.category),
    escapeCSV(q.difficulty)
  ].join(',');
});

const csvContent = header + csvRows.join('\n');

fs.writeFileSync('visionx_fullstack_bank.csv', csvContent);
console.log('visionx_fullstack_bank.csv created successfully with 90 questions.');
