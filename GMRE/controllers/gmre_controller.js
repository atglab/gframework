/**
 * [GMRE] gmre_controller.js
 * 
 * Module used to provide GMRE API
 * 
 * @author JungHyun
 * @version 0.1
 */
var logger = require(global.rootPath + '/utils/logger');

var pointBaseMan = require(global.rootPath + '/resources/gmredata/baseM.json');
var pointBaseWoman = require(global.rootPath + '/resources/gmredata/baseW.json');
var pointBaseBoth = require(global.rootPath + '/resources/gmredata/baseB.json');

var playerPrefer = require(global.rootPath + '/resources/gmredata/player_prefer.json');
var gmBase = require(global.rootPath + '/resources/gmredata/gm_base.json');

function scoreGameMecanics(points, scoreMap, player, step1){
	var preferArray = playerPrefer[player];
	
	var index, gmID, prefer, cnt;
	for(index = 0; index < preferArray.length; ++index){
		
		// prefer score function by rank
		prefer = 1 + (1 / preferArray[index].rank);
		gmID = preferArray[index].gmId;
		
		cnt = gmBase[gmID].cnt;
		// Filtering game mechanics by step 1
		if(gmBase[gmID].costfilter > step1.s1_q1){
			cnt = 0;
		}
		if(gmBase[gmID].periodfilter > step1.s1_q2){
			cnt = 0;
		}
		prefer = prefer * cnt * points[player];
		
		if(!scoreMap.hasOwnProperty(gmID)){
			scoreMap[gmID] = prefer;
		}else{
			scoreMap[gmID] += prefer;
		}
	}
}

function webSiteArea(step0_q1_value, step0_q2_value1, step0_q2_value2, step0_q2_value3, step0_q2_value4){
		
	var step0_q2_value;	
	
	var siteArea;
	
	switch(step0_q1_value) {
		case "1":
			step0_q2_value = step0_q2_value1;		
			
			if(step0_q2_value == 1) {
				siteArea = "1. 의류 관련";
			} else if(step0_q2_value == 2) { 	
				siteArea = "2. 음악 관련";
			} else if(step0_q2_value == 3) { 	
				siteArea = "3. 자동차 관련";
			} else if(step0_q2_value == 4) { 	
				siteArea = "4. 게임 관련";
			} else if(step0_q2_value == 5) { 	
				siteArea = "7. 부동산 및 건물";
			} else if(step0_q2_value == 6) { 	
				siteArea = "11. 기본";
			}			
			
			break;
		case "2":
			step0_q2_value = step0_q2_value2;	
			
			if(step0_q2_value == 1) {
				siteArea = "9. 블로그 관련";
			} else if(step0_q2_value == 2) { 	
				siteArea = "10. 종교 및 비영리 관련";
			} else if(step0_q2_value == 3) { 	
				siteArea = "11. 기본";
			}
			
			break;
		case "3":
			step0_q2_value = step0_q2_value3;
			
			if(step0_q2_value == 1) {
				siteArea = "5. 여행 관련";
			} else if(step0_q2_value == 2) { 	
				siteArea = "6. 놀이동산 관련";
			} else if(step0_q2_value == 3) { 	
				siteArea = "8. 영화 및 공연 관련";
			} else if(step0_q2_value == 4) { 	
				siteArea = "11. 기본";
			}
			
			break;
		case "4":
			step0_q2_value = step0_q2_value4;
			
			if(step0_q2_value == 1) {
				siteArea = "11. 기본";
			} 
			
			break;
	}
	
	
	return siteArea;	
	
}

function adjustPoint(points, answer, player){
	switch(answer){
	case "1":	// -1
		points[player] -= 1; break;
	case "2": // -0.5
		points[player] -= 0.5; break;
	case "3": // + 0
		break;
	case "4": // +0.5
		points[player] += 0.5; break;
	case "5": // +1
		points[player] += 1; break;
	}
}

exports.doAnalyze = function(req, res, next){
	
	//logger.log('debug','gmre_controller.js', req.body);
	//1) parsing request data
	var step0 = JSON.parse(req.body.step0);
	var step1 = JSON.parse(req.body.step1);
	var step2 = JSON.parse(req.body.step2);
	var step3 = JSON.parse(req.body.step3);
	
	//1-1) selet webSite area
	var siteArea = webSiteArea(step0.s0_q1, step0.s0_q2_1, step0.s0_q2_2, step0.s0_q2_3, step0.s0_q2_4);
	console.log(siteArea);
	
	//2-1) load base points based on gender
	var pointsBase;
	switch(step2.s2_q2){
	case "1":	// for man
		pointsBase = JSON.parse(JSON.stringify(pointBaseMan)); break;
	case "2":	// for woman
		pointsBase = JSON.parse(JSON.stringify(pointBaseWoman)); break;
	case "3":	// for both
		pointsBase = JSON.parse(JSON.stringify(pointBaseBoth)); break;
	}
	
	//2-2) select points based on age
	var points;
	switch(step2.s2_q1){
	case "1": // 10 ~ 18
		points = pointsBase.age10; break;
	case "2": // 19 ~ 29
		points = pointsBase.age20; break;
	case "3": // 30 ~ 39
		points = pointsBase.age30; break;
	case "4":	// 40 ~ 49
		points = pointsBase.age40; break;
	case "5": // 50 ~ 59
		points = pointsBase.age50; break;
	}
		
	//2-3) adjust points by answers in the step3
	adjustPoint(points, step3.s3_q1, "socialiser");
	adjustPoint(points, step3.s3_q2, "disruptor");
	adjustPoint(points, step3.s3_q3, "achiever");
	adjustPoint(points, step3.s3_q4, "freespirit");
	adjustPoint(points, step3.s3_q5, "philanthropist");
	adjustPoint(points, step3.s3_q6, "player");
	adjustPoint(points, step3.s3_q7, "freespirit");
	adjustPoint(points, step3.s3_q8, "player");
	adjustPoint(points, step3.s3_q9, "achiever");
	adjustPoint(points, step3.s3_q10, "disruptor");
	adjustPoint(points, step3.s3_q11, "socialiser");
	adjustPoint(points, step3.s3_q12, "philanthropist");
	
	//3-1) Scoring game mechanics
	var preferMap = {};
	scoreGameMecanics(points, preferMap, "socialiser", step1);
	scoreGameMecanics(points, preferMap, "freespirit", step1);
	scoreGameMecanics(points, preferMap, "achiever", step1);
	scoreGameMecanics(points, preferMap, "philanthropist", step1);
	scoreGameMecanics(points, preferMap, "player", step1);
	scoreGameMecanics(points, preferMap, "disruptor", step1);
	
	//console.log(preferMap);
	//3-2) sorting game mechanics by score
	var n = 0, index = 1, topN = 10, numGM = 47;
	var highGMID, highPrefer = 0, gmID="";
	var topNGM = [];
	for(n = 0; n < topN; n++){		
		for(index = 1; index <= numGM; index++){
			gmID = "gm" + index;
			//console.log(gmID);
			if(preferMap.hasOwnProperty(gmID)){
				if( highPrefer < preferMap[gmID]){
					//console.log(preferMap[gmID]);
					highPrefer = preferMap[gmID];
					highGMID = gmID;
					//console.log(highGMID);
				}
			}else{
				continue;
			}
		}
		if(highPrefer > 0){
			//topNGM[n] = {Name:gmBase[highGMID].nameE, Prefer:highPrefer, Description: gmBase[highGMID].discriptionE + "<br>" + gmBase[highGMID].discriptionK};
			topNGM[n] = {Name:gmBase[highGMID].nameK, Prefer:highPrefer, Description: gmBase[highGMID].discriptionK};
			delete preferMap[highGMID];
			highGMID = "";
			highPrefer = 0;
		}else{
			break;
		}
	}
	
	//3-3) Recommending top N game mechanics
	//console.log(topNGM);
	
	res.statusCode = 200;
	res.setHeader('Content-Type', 'application/json');
	res.json({success:true, players: points, mechanics: topNGM, siteArea: siteArea});
	res.end();
	
	logger.log('info', "app.js", 'Request is completed');
	//next();
};

