function sum() {
  console.log(1);
  return [].reduce.call(arguments, (acc, el) => acc += el);
}

const prom = x => new Promise(res => {
  console.log(2);
  setTimeout(res, 2000, x);
})

function pow() {
  console.log(3);
  return [].reduce.call(arguments, (acc, el) => acc *= el);
}

const arr = [1, 2, 3, 4]

function* gen() {
  const a = yield sum.bind(null, ...arr);
  const b = yield prom(a);
  const c = yield pow.bind(null, ...arr);
  const d = yield arr;
  yield a + b + c + d;
}

const iterator = gen();

function runner(iterator) {
  const arrRes = [];

  return new Promise((resolve) => {
    function exeq(iterator, data) {
      const { value, done } = iterator.next(data);

      if (done) {
        return resolve(arrRes);
      }
      if (value instanceof Promise){
        return value.then(result => {
          arrRes.push(result);
          exeq(iterator, result);
        });
      }else if ( typeof value === 'function'){
        arrRes.push(value());
        return exeq(iterator, value())
      }

      arrRes.push(value);
      exeq(iterator, value);
    }

    exeq(iterator)
  });
}

runner(gen()).then(data => console.log(data.pop() === '441,2,3,4' ? "Good Job" : "You are fail this task"))
