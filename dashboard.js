fetch('https://linode.cobaltrisen.com:3000/data').then(res => res.json()).then(data => {
    console.log(data)
})