var fs = require("fs");


let uniqueIds = ["1", "2", "3", "4"];

async function extractDocument(id) {
    return new Promise((resolve, reject) => {
        console.log(`\nstart with promise ${id}`);
        setTimeout(() => {
            if (id === "10") {
                reject(new Error(`Ooops something went wrong ${id}!`));
            } else {
                let objectToExtract = {id: id, name: "Hans"};
                //console.log(JSON.stringify(objectToExtract));
                // console.log(`got response for id ${id}`);
                console.log("resolve method");
                resolve(objectToExtract);
            }
        }, 3000);
    });
};

async function extractDocuments(ids) {
    let extractedDocuments = [];

    for (const id of ids) {
        let result = await extractDocument(id);
        extractedDocuments.push(result);
        console.log("proceed after promise was resolved");
    }
    return extractedDocuments;
};

extractDocuments(uniqueIds)
    .then(results => {console.log(`all results ${results}`)})
    .catch((error) => console.log(error));


