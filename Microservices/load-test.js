const autocannon = require('autocannon');

const apis = [
    'http://localhost:3000',
    'http://localhost:3001/about',
    'http://localhost:3002/contact'
];

function runTest(url){
    return new Promise((resolve) => {
        const result = {url,success:0}
        const instance = autocannon({url,connections:300,duration:60});

        instance.on('response',(_,statusCode)=> {
            if(statusCode >= 200 && statusCode < 300) {
                result.success++;
            }
        })

        instance.on('done',()=> resolve(result));
    })
}

async function main(){
    const results = await Promise.all(apis.map(runTest));;

    // sum only successful requests
    const totalSuccess = results.reduce((sum, result) => sum + result.success, 0);
    console.log('Total successful requests:', totalSuccess);
}
main();