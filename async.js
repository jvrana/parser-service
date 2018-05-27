const files = [
    "AGGGA",
    "GGGGGG"
];
const filenames = [
    "myseq.fasta",
    "myseq2.fasta"
];

let asyncOperation = function(time) {
    return new Promise(function (resolve, reject) {
        setTimeout( () => {
            resolve(time);
        }, time);
    });
};


let promises = [1000, 2000, 3000].map((x) => asyncOperation(x));

(async () => {
    console.log(await Promise.all(promises))
})();

