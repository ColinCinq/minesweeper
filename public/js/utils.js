Array.prototype.containsArray = function (val) {
    let hash = {}
    for (let ii = 0; ii < this.length; ii++) {
        hash[this[ii]] = ii
    }
    return hash.hasOwnProperty(val)
}

Array.prototype.indexOfArray = function (val) {
    let hash = {}
    for (let ii = 0; ii < this.length; ii++) {
        hash[this[ii]] = ii
    }
    return (hash.hasOwnProperty(val)) ? hash[val] : -1
}

Array.prototype.substractArray = function (arrOfArr) {
    let subArray = []
    this.forEach(elem => {
        if (!arrOfArr.containsArray(elem))
            subArray.push(elem)
    })
    return subArray
}

Array.prototype.intersectArray = function (arrOfArr) {
    let subArray = []
    this.forEach(elem => {
        if (arrOfArr.containsArray(elem))
            subArray.push(elem)
    })
    return subArray
}