/**
 * @param {string} s
 * @return {number}
 */
var lengthOfLongestSubstring = function(s) {
    // strings=[]
    lengths=[]
    new_string=''
    length_s=0
    for (let x in s){
        console.log(new_string)
         if(new_string.includes(s[x])){
            // strings.push(new_string)
            new_string=s[x]
            lengths.push(length_s)
            length_s=1
         }
         else{
             new_string+=s[x];
             length_s++;
         }
    }
    lengths.push(length_s)
    max_index=0
    max_num=lengths[0]
    for(let x in lengths){
        if(lengths[x]>max_num)
        {
            max_num=lengths[x];
            max_index=x;
        }
    }

    console.log(lengths)

    return max_index;
};

console.log(lengthOfLongestSubstring('abcdab'))
console.log('abcd'.includes('a'))
