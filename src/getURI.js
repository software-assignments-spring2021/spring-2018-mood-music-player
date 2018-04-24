const x = require('./getURI.json');

let arr = x.items.map(function(item) {
	return {
		name: item.track.name, 
		id: item.track.id
	}
});

function uniq(arr) {
    let dic = {};
    return arr.filter(function(item) {
        return dic.hasOwnProperty(item.id) ? false : (dic[item.id] = true)
    });
}

arr = uniq(arr); 

id_arr = arr.map(function(item) {
	return item.id;
});

// console.log(id_arr.slice(0,100).toString());
console.log(id_arr.slice(100).toString());

