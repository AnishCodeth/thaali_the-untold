const a=(b)=>{
return ()=>{
     return b()
}
}

const b=a( ()=>{
    return 'ansih';
})

const c= ()=>{
console.log(b())

}
c()



