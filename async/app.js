console.log("debut");

// getMember()
//     .then((member) => getArticles(member))
//     .then((article) => console.log(article))
//     .catch((err) => console.log(err.message))

async function viewArticles(){
    let member = await getMember()
    let articles = await getArticles()
    console.log(articles);
}

viewArticles();

function getMember() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve("member 1")
        }, 1500);
    })
}

function getArticles() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve([1, 2, 3])
        }, 1500);
    })
}

console.log("fin");



























// console.log("debut");

// let p1 = new Promise((resolve, reject) => {
//     setTimeout(() => {
//         resolve("resolve 1")
//     }, 1000);
// })

// let p2 = new Promise((resolve, reject) => {
//     setTimeout(() => {
//         resolve("resolve 2")
//     }, 1500);
// })

// Promise.race([p1, p2]).then(result => console.log(result))

// console.log("fin");










// console.log("debut");

// getMember()
//     .then((member) => getArticles(member))
//     .then((article) => console.log(article))
//     .catch((err) => console.log(err.message))

// function getMember() {
//     return new Promise((resolve, reject) => {
//         setTimeout(() => {
//             console.log("member 1 clg");
//             // resolve("member 1")
//             reject(new Error("Une erreur ..."))
//         }, 1500);
//     })
// }

// function getArticles(member) {
//     return new Promise((resolve, reject) => {
//         setTimeout(() => {
//             resolve([1, 2, 3])
//         }, 1500);
//     })
// }

// console.log("fin");














// console.log("debut");

// let p = new Promise((resolve, reject) => {
//     setTimeout(() => {
//         // resolve("C'est bon !")
//         reject(new Error("C'est une erreur !"))
//     }, 1500)
// })
//     .then((message) => console.log(message))
//     .catch((err) => console.log(err.message))

// console.log("fin");








// console.log("debut");

// getMember((member) => {
//     console.log(member)
//     getArticles(member, (articles) => {
//         console.log(articles);
//     })
// });

// console.log("fin");

// function getMember(callback){
//     setTimeout(() => {
//         callback("member 1")
//     }, 1500);
// }

// function getArticles(member, callback){
//     setTimeout(() => {
//         callback([1,2,3])
//     }, 1500);
// }