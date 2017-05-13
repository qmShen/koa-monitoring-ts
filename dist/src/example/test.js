// function f1(callback) {
//     setTimeout(function () {

//         callback();
//     }, 1000);
//     console.log('init')
// }
// function f2(){
//     console.log('done');
// }
// f1(f2)

function f1() {
    let p = new Promise();
    setTimeout(function () {
        p.resolve();
    }, 1000);
    return p;
}
// function f2(){
//     console.log('done');
// }
// f1(f2)
f1()