Array.prototype.indexOfArray = function(val) {
    let hash = {}    
    for (let ii = 0; ii < this.length; ii++) {
        hash[this[ii]] = ii
    }
    return (hash.hasOwnProperty(val)) ? hash[val] : -1
}