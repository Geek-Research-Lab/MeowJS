var xx = ['xx.js'];
var ig = this;
ig.onMessage = function(xEvent) {
	var XMLHttpRequest;
	var data = xEvent.data;
	var req = new XMLHttpRequest();
	req.open('GET', data.blob, false);
	req.responseType = 'ArrayBuffer';
	req.send(null);
	ig.postMessage({
		id: data.id,
		hash: xx.hash(req.response),
		blob: data.blob
	});
	req.response = null;
};

//////////////////////////<3//////////////////////////////////


////////////////////////            ///////////////////
////////(^_^)///////////          ///////////////////////
////////////////////////        ///////////////////////////
        /////                 ///////
        /////                 ///////
        /////                 ///////
        /////                 ///////
        /////                 ///////
        /////                 ///////
        /////                 ///////         /////////////////
        /////                 ///////         /////////////////
        /////                 ///////         /////////////////
        /////                 ///////         ///////     /////
////////////////////////      ///////////////////////     /////
////////////////////////      ///////////////////////     /////
////////////////////////      ///////////////////////     /////


///////////////////////////<3//////////////////////////////////
