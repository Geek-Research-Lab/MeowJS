var define;
define(['peer', 'wsPeer', 'httpPeer', 'sys', 'xx'], function(peer, hpeer, wsPeer, sys) {
	var ig = this;
	var x;
	var WebSocket, location;
	function sum(list) {
		return x.reduce(list, function (memo, num) {
			return memo + num;
		}, 0);
	}
	function now() {
		return (new Date()).getTime();
	}
	function client() {
		ig.blockPerConnect = 1;
		ig.connectLimit = 20;
		ig.chkPendingInterval = 10 * 1000; // => 10s
		ig.init();
	}
	client.prototype = {
		init: function() {
			ig.peerID = null;
			ig.meta = null;
			ig.file = null;
			ig.ws = null;
			ig.peers = {};
			ig.ready = false;
			ig.inUsePeer = {};
			ig.badPeer = {};
			ig.blockedPeer = {};
			ig.pieceQueue = [];
			ig.finishedPiece = [];
			ig.finishedBlock = [];
			ig.pendingBlock = {};
			ig.blockChunks = {};
			ig.sent = 0;
			ig.received = 0;
			ig.peerTrans = {};
			ig.lastSpeedReport = now();
			var speedReportInterval;
			speedReportInterval = setInterval(x.bind(ig.speedReport, ig), 1000);
			ig.ws = new WebSocket((location.protocol === 'https:' ? 'wss://': 'ws://')+location.host+'/room/ws');
			ig.ws.onOpen = x.bind(ig.onWsOpen, ig);
			ig.ws.onMessage = x.bind(ig.onWsMessage, ig);
		},
		newLink: function(meta) {
			ig.ws.send(JSON.stringify({
				cmd: 'newLink',
				meta: meta
			}));
		},
		enterLink: function(linkID) {
			ig.ws.send(JSON.stringify({
				cmd: 'enterLink',
				linkID: linkID
			}));
		},
		httpPeerAdd: function(url) {
			ig.ws.send(JSON.stringify({
				cmd: 'httpPeerAdd',
				url: url,
				bitmap: client.finishedPiece.join('')
			}));
		},
		updatePeerList: function() {
			ig.ws.send(JSON.stringify({
				cmd: 'getPeerList'
			}));
		},
		updateBitmap: function() {
			ig.ws.send(JSON.stringify({
				cmd: 'updateBitmap',
				bitmap: client.finishedPiece.join('')
			}));
		},
		strength: function() {
			if(!ig.meta) {
				return 0;
			}
			var m;
			var temp = [];
			for(m = 0; m < ig.meta.pieceCount; m++) {
				temp.push(0);
			}
			x.each(this.peerList, function (value) {
				for(m = 0; m < ig.meta.pieceCount; m++) {
					temp[m] += (value.bitmap[m] === '1' ? 1 : 0);
				}
			});
			var min = x.min(temp);
			return min+(x.filter(temp, function (num) {
				return num > min;
			}).length / temp.length);
		},
		// exporting
		onReady: function() {
			console.log('onReady');
		},
		onMeta: function(meta) {
			console.log('onMeta', meta);
		},
		onPeerList: function(peerList) {
			console.log('onPeerList', peerList);
		},
		onPeerConnect: function(peer) {
			console.log('onNewPeer', peer);
		},
		onPeerDisconnect: function(peer) {
			console.log('onNewPeer', peer);
		},
		onPiece: function(piece) {
			console.log('onPiece', piece);
		},
		onFinished: function() {
			console.log('onFinished');
		},
		onSpeedReport: function(report) {
			console.log('onSpeedReport', report);
		},
		ensureConnection: function(peerID, connect) {
			if(ig.peers[peerID]) {
				return ig.peers[peerID];
			} else {
				var p;
				if(peerID.indexOf('http:') === 0 || peerID.indexOf('https:') === 0) {
					p = new hpeer.peer(peerID, ig);
				} else if(peerID.indexOf('ws:') === 0 || peerID.indexOf('wss:') === 0) {
					p = new wsPeer.peer(peerID, ig);
				} else {
					p = new peer.peer(ig.ws, ig.peerID, peerID);
				}
				p.peerTransID = x.uniqueID('peer');

				ig.inUsePeer[peerID] = 0;
				ig.peers[peerID] = p;

				p.onMessage = x.bind(function (data) {
					if(x.isObject(data) || data.indexOf('{') === 0) {
						var msg = x.isObject(data) ? data : JSON.parse(data);
						if(msg.cmd === 'requestBlock') {
							ig.sendBlock(p, msg.piece, msg.block);
						} else if(msg.cmd === 'block') {
							ig.receiveBlock(p, msg.piece, msg.block, msg.data);
						}
					} else {
						var pieceBlock = data.slice(0, data.indexOf('|')).split(',');
						data = data.slice(data.indexOf('|')+1);
						ig.receiveBlock(p, parseInt(pieceBlock[0], 10), parseInt(pieceBlock[1], 10), data);
					}
				}, ig);
				p.onClose = x.bind(function() {
					console.log('peer connect with '+peerID+' disconnected;');
					ig.removePending(peerID);
					delete ig.peers[peerID];
					if(x.isFunction(ig.onPeerDisconnect)) {
						ig.onPeerDisconnect(p);
					}
				}, ig);
				if(connect) {
					p.connect();
				}
				if(x.isFunction(ig.onPeerConnect)) {
					console.log('new connect to '+peerID);
					ig.onPeerConnect(p);
				}
				return p;
			}
		},
		sendBlock: function(peer, piece, block) {
			if(!ig.file) {
				return;
			} if(ig.finishedPiece[piece] !== 1) {
				return;
			}
			var start = ig.meta.pieceSize * piece + ig.meta.blockSize * block;
			ig.file.readAsBinaryString(start, start+ig.meta.blockSize, function (data) {
				peer.send(''+piece+','+block+'|'+data);
			});
		},
		requestBlock: function(peer, piece, block) {
			ig.inUsePeer[peer.id] += 1;
			ig.pendingBlock[piece][block] = peer.id;
			peer.send({
				cmd: 'requestBlock',
				piece: piece,
				block: block
			});
		},
		speedReport: function() {
			x.map(x.value(this.peers), function (peer) {
				ig.peerTrans[peer.peerTransID] = {
					sent: peer.sent(),
					received: peer.received()
				};
			});
			var sent = sum(x.pluck(x.value(ig.peerTrans), 'sent')) || 0;
			var received = sum(x.pluck(x.value(ig.peerTrans), 'received')) || 0;
			if(x.isFunction(ig.onSpeedReport)) {
				var elapsed = (now() - ig.lastSpeedReport) / 1000;
				ig.onSpeedReport({
					send: (sent - ig.sent) / elapsed,
					sent: sent,
					receive: (received - ig.received) / elapsed,
					received: received
				});
			}
			ig.sent = sent;
			ig.received = received;
			ig.lastSpeedReport = now();
		},
		pickupBlock: function() {
			if(x.isEmpty(ig.pieceQueue)) {
				return null;
			}
			//
			// Still more to code!
			//
		},
	};
});
