# Node Internals

## Q1:

A mechanism that allows Node.js to perform non-blocking asynchronous operations despite JavaScript being single-threaded. Heavy tasks like file system (`fs`) operations and network requests are delegated to internal C++ `libuv` worker threads.

---

## Q2:

A multi-platform C library that provides Node.js with an asynchronous, non-blocking I/O architecture. It allows the single JavaScript thread to handle thousands of simultaneous operations concurrently.

---

## Q3:

By default, Node.js creates **4 worker threads** in `libuv` for asynchronous/heavy operations. Every heavy operation (like file I/O, crypto, or compression) is delegated to a worker thread for execution.

---

## Q4:

### 1. Call Stack

- **Approach:** Last In, First Out (LIFO).
- Executes synchronous code immediately.
- JavaScript has a single Call Stack, so it can only execute one thing at a time.

### 2.

- **Approach:** First In, First Out (FIFO).
- Holds callbacks ready to be executed after their asynchronous operations complete.
- **Priority:** Microtasks Queue (Promises, `process.nextTick`) has higher priority than the Callback/Macrotask Queue.
- Runs callbacks only after the Call Stack is clear.

### 3.

- **Mechanism:** Continuous loop running constantly in the background.
- Monitors both the Call Stack and the Event Queue.
- Controls when the Event Queue's callbacks can move to the Call Stack for execution.

---

## Q5:

Background worker threads provided by `libuv` handle heavy, blocking asynchronous tasks so they don't freeze the main Event Loop.

### Setting Thread Pool Size

**Windows (CMD/PowerShell):**

```cmd
set UV_THREADPOOL_SIZE=8 && node app.js
```

**Windows:**

```powershell
$env:UV_THREADPOOL_SIZE=8; node app.js
```

---

## Q6:

- **Blocking:** Node.js has to wait for an operation to complete before moving to the next line of code.
- **Non-Blocking:** Node.js starts an operation and immediately continues doing other work instead of waiting.
