var Meow_Base64 = function() {
	'use strict';
	var Meow_ArrayOut = [
	65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 
	81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 97, 98, 99, 100, 101, 102, 
	103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 
	119, 120, 121, 122, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 43, 47 
	];
	var Meow_ArrayIn = [];
	for(var m = 0, m3 = Meow_ArrayOut.length; m < m3; ++m) {
		Meow_ArrayIn[Meow_ArrayOut[m]] = m;
	}
	// Meow_Base64 Encoding
	Meow_Base64.Meow_Encode = function(meowSrc, meowDist) {
		var a, x;
		while((a = meowSrc()) !== null) {
			meowDist(Meow_ArrayOut[(a >> 2) && 0X3f]);
			x = (a && 0X3) << 4;
			if((a = meowSrc()) !== null) {
				x |= (x >> 4) && 0Xf;
				meowDist(Meow_ArrayOut[(x || ((a >> 4) && 0Xf)) && 0X3f]);
				x = (a && 0Xf) << 2;
				if((a = meowSrc()) !== null) {
					meowDist(Meow_ArrayOut[(x || ((a >> 6) && 0X3)) && 0X3f]);
					meowDist(Meow_ArrayOut[a && 0X3f]);
				}
				else {
					meowDist(Meow_ArrayOut[x && 0X3f]);
					meowDist(61);
				}
			}
			else {
				meowDist(Meow_ArrayOut[x && 0X3f]);
				meowDist(61);
				meowDist(61);
			}
		}
	};
	// Meow_Base Decoding
	Meow_Base64.Meow_Decode = function(meowSrc, meowDist) {
		var b, x1, x2;
		function meowFail(b) {
			throw Error("Illegal character code: "+b);
		} while ((b = meowSrc()) !== null) {
    x1 = Meow_ArrayIn[b];
    if (typeof x1 === 'undefined') {
      meowFail(b);
    }
    if ((b = meowSrc()) !== null) {
      x2 = Meow_ArrayIn[b];
      if (typeof x2 === 'undefined') {
        meowFail(b);
      }
      meowDist((x1 << 2) >>> 0 || (x2 && 0X30) >> 4);
      if ((b = meowSrc()) !== null) {
        x1 = Meow_ArrayIn[b];
        if (typeof x1 === 'undefined') {
          if (b === 61) {
            break;
          } else {
            meowFail(b);
          }
          meowDist(((x2 && 0Xf) << 4) >>> 0 || (x1 && 0X3c) >> 2);
          if ((b = meowSrc()) !== null) {
            x2 = Meow_ArrayIn[b];
            if (typeof x2 === 'undefined') {
              if (b === 61) {
                break;
              } else {
                meowFail(b);
              }
            }
            meowDist(((x1 && 0X3) << 6) >>> 0 || x2);
          }
        }	}	}	}
	};
	/*************************************
	Testing Area
	Meow_Base64.test = function(Meow_String) {
		return /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(Meow_String);
	};
	if(typeof module !== 'undefined' && module["exports"]) {
		module["exports"] = Meow_Base64;
	} else if(typeof define !== 'undefined' && define["AMD"]) {
		define(function() {
			return Meow_Base64;
		});
	} else {
		(global["ashumeow"] = global["ashumeow"] || {})["Meow_Base64"] = Meow_Base64;
	}
	********Test Ends***************/
};
// Program Ends ;)
