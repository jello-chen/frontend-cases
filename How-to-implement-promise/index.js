const MPromise = require('./MPromise');
//const MPromise = Promise;
const promise = new MPromise((resolve, reject) => {
    setTimeout(() => {
        //resolve('resolved');
        reject('rejected');
    }, 1000);
});
promise
.then(res => {
    console.log('res 2', res);
    return new MPromise(rs => {
        console.log(21);
    }, rj => {
        console.log(22);
    });
}, err => {
    console.error('error 2', err);
})
.then(res => {
    console.log('res 3', res);
    return 31;
}, err => {
    console.error('error 3', err);
}).then(res => {
    console.log('res 4', res);
}, err => {
    console.error('error 4', err);
});
