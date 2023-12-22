function functionA() {
    function functionB() {
      console.trace('Printing stack trace:');
    }
    
    functionB();
  }
  
  functionA();
  