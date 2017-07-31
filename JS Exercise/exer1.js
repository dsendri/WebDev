function printReverse(arr){

	for (var i = arr.length-1; i>=0 ; i--){
		console.log(arr[i]);
	}

}

printReverse(["a","b","d","e"]);

function isUniform(arr) {
	
	var temp = arr[0];

	for (var i = 1 ; i < arr.length; i++){
		
		if (temp !== arr[i])
			return false;

	}


	return true;

}

isUniform([0,0,0,0])

function sumArray(arr){

	var result = 0;

	for (var i = 0 ; i < arr.length; i++){
		
		result = result + arr[i];

	}

	return result;
}

sumArray([1,2,3]);

function max(arr){

	var max = 0;

	arr.forEach(function(element){
		if (element > max) max = element;
	})

	return max;
}

max([0,2,5,0,1,3]);