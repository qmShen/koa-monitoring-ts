// let c1 = { 'id': 1, 'school': 'nyu' }
// let c2 = { 'name': 'c2', 'school': 'scu' }
// Object.assign(c1, c2)
// console.log('c1mc2', c1, c2)
const interval = setInterval(
    () => {
        console.log('t');
    },
    0.5 * 1000);

interval.unref();

console.log('tt');
// setTimeout(function () {
//     console.log('stop');

// }, 2000);
// console.log('tt2');