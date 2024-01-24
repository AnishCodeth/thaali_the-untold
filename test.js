const a={
    b:3,
    c:2
}

const b=((Object.values(a)).map((a1)=>{
    return a1==null
})).includes(true)
const c=(Object.values(a)).map((a1)=>{
    return a1==null
})
console.log(b,c)
