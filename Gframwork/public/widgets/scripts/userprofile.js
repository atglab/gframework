$.urlParam = function(name, url) {
    if (!url) {
        url = window.location.href;
    }
    var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(url);
    if (!results) {
        return undefined;
    }
    return results[1] || undefined;
};

jQuery.timeago.settings.strings = {
    suffixAgo: "전",
    suffixFromNow: "후",
    seconds: "1분 이내",
    minute: "1분",
    minutes: "%d분",
    hour: "1시간",
    hours: "%d시간",
    day: "하루",
    days: "%d일",
    month: "한달",
    months: "%d달",
    year: "1년",
    years: "%d년"
};

function setUserBasicInfo(userBasic){
    $('#userName').append('<b></b>').text(userBasic.name);
    $('#userNickName').text(userBasic.nickname);
    $('#userGender').text(userBasic.gender === 1? '남성' : userBasic.gender===2? '여성' : '기타');
    $('#userprofile').attr('src', userBasic.profile);

    var timeStamp = new Date(userBasic.birthday*1000);
    //var timeStamp = convertLocalDateToUTCDate(birthday, false);
    $('#userBirthday').text(timeStamp.getFullYear() + "-" + timeStamp.getMonth() +"-" +timeStamp.getDate());
}

function setBadgeInfo(badges){
    var badgeTable = $('#badgeTable');
    var row = $('<tr></tr>');
    badgeTable.append(row);

    for(var i = 0; i<badges.length; i++){
        var col = $('<td></td>');

        var img, caption;
        if(badges[i].state === 1){
            img = $("<img class='badgeImg'>");
            caption = $("<div class='imgCaption'></div>");
        }else{
            img = $("<img class='badgeImg transparentImg'>");
            caption = $("<div class='transparentImgCaption'></div>");
        }
        img.attr('src', badges[i].icon);
        img.attr('alt', badges[i].name);
        col.append(img);

        caption.text(badges[i].name);
        col.append(caption);

        var timeCaption = $("<div class='timeCaption'></div>");
        var date = $("<abbr class='timeago'></abbr>");

        if(badges[i].date != null){
            //var timeStamp = new Date(badges[i].date);
            var timeStamp = convertLocalDateToUTCDate(badges[i].date, true);
            var dateTime = timeStamp.toISOString();

            date.attr('title', dateTime);
            date.text(dateTime);
        }
        timeCaption.append(date);
        col.append(timeCaption);

        row.append(col);
    }
}

function setMissionInfo(missions){
    var missionList = $('#missionList');

    for(var i = 0; i< missions.length; i++){
        var item = $("<li class='list-group-item'></li>");
        missionList.append(item);

        var table = $("<table width='100%'></table>");
        item.append(table);

        var firstRow = $('<tr></tr>');
        table.append(firstRow);

        var name = $("<td class='missionName'></td>");
        name.text(missions[i].name);
        firstRow.append(name);

        var options = $("<td class='missionOptions'></td>");
        if(missions[i].isRepeatable){
            //var tempHtml = "<a href='#' data-toggle='tooltip' title='Some tooltip text!'>" +
            var repeatIcon = $("<span class='glyphicon glyphicon-repeat' aria-hidden='false'></span>");
            options.append(repeatIcon);
        }
        if(missions[i].useConstraint){
            //var tempHtml = "<a href='#' data-toggle='tooltip' title='Some tooltip text!'>" +
            var constraintIcon = $("<span class='glyphicon glyphicon-forward' aria-hidden='false'></span>");
            options.append(constraintIcon);
        }
        if(missions[i].useExpiration){
            //var tempHtml = "<a href='#' data-toggle='tooltip' title='Some tooltip text!'>" +
            var expirationIcon = $("<span class='glyphicon glyphicon-hourglass' aria-hidden='false'></span>");
            options.append(expirationIcon);
        }
        firstRow.append(options);

        var secondRow = $('<tr></tr>');
        table.append(secondRow);

        var progressCol = $("<td colspan='2'></td>");
        var progressDiv = $("<div class='progress'></div>");
        var progress = $("<div class='progress-bar' role='progressbar'>");

        var ratio = ( missions[i].state / missions[i].exit_condition ) * 100;
        progress.attr('aria-valuenow', ratio);
        progress.attr('aria-valuemin', 0);
        progress.attr('aria-aria-valuemax', 100);
        progress.attr('style', "width:" + ratio +"%;");
        progress.text(ratio + '%');
        progressDiv.append(progress);
        progressCol.append(progressDiv);
        secondRow.append(progressCol);

        var thirdRow = $('<tr></tr>');
        table.append(thirdRow);

        var activityName = $('<td></td>');
        activityName.text(missions[i].activityName);
        thirdRow.append(activityName);

        var status = $("<td class='missionState'></td>");
        status.text(missions[i].state + "/" + missions[i].exit_condition);
        thirdRow.append(status);
    }
}

function setPointReward(reward, table){

    var firstRow = $('<tr></tr>');
    table.append(firstRow);

    var iconCol = $("<td class='rewardIcon' rowspan='2'></td>");
    var iconImg = $("<img class='rewardIconImg'>");
    iconImg.attr('src', reward.icon);
    iconCol.append(iconImg);
    firstRow.append(iconCol);

    var name = $("<td class='rewardName'></td>");
    name.text(reward.name);
    firstRow.append(name);

    var state = $("<td class='rewardState'></td>");
    state.text(reward.state + "/" + reward.max);
    firstRow.append(state);

    var rank = $("<td rowspan='2' class='rewardRank'></td>");
    rank.text(reward.rank);
    firstRow.append(rank);

    var secondRow = $('<tr></tr>');
    table.append(secondRow);

    var progressCol = $("<td colspan='2'></td>");
    var progressDiv = $("<div class='progress'></div>");
    var progress = $("<div class='progress-bar' role='progressbar'>");

    var ratio = ( reward.state / reward.max ) * 100;
    progress.attr('aria-valuenow', ratio);
    progress.attr('aria-valuemin', 0);
    progress.attr('aria-aria-valuemax', 100);
    progress.attr('style', "width:" + ratio +"%;");
    progress.text(ratio + '%');
    progressDiv.append(progress);
    progressCol.append(progressDiv);
    secondRow.append(progressCol);
}

function setStatusReward(reward, table){

    var firstRow = $('<tr></tr>');
    table.append(firstRow);

    var secondRow = $('<tr></tr>');
    table.append(secondRow);

    var name = $("<td class='rewardName' rowspan='2'></td>");
    name.text(reward.name);
    firstRow.append(name);

    for(var i = 0; i < reward.classes.length; i++){

        var col = $("<td style='text-align: center'></td>");

        var img, caption;
        if(reward.classes[i].state){
            img = $("<img class='rewardIconImg'>");
            caption = $("<td class='imgCaption'></td>");
        }else{
            img = $("<img class='rewardIconImg transparentImg'>");
            caption = $("<td class='transparentImgCaption'></td>");
        }
        img.attr('src', reward.classes[i].icon);
        img.attr('alt', reward.classes[i].name);
        col.append(img);
        firstRow.append(col);

        caption.text(reward.classes[i].name);
        secondRow.append(caption);
    }

    var rank = $("<td rowspan='2' class='rewardRank'></td>");
    rank.text(reward.rank);
    firstRow.append(rank);
}

function setRewardInfo(rewards){
    var rewardList = $('#rewardList');

    for(var i = 0; i< rewards.length; i++){

        var item = $("<li class='list-group-item'></li>");
        rewardList.append(item);

        var table = $("<table width='100%'></table>");
        item.append(table);

        switch(rewards[i].type){
            case 'point_type':
                setPointReward(rewards[i], table);
                break;
            case 'level_type':
                setPointReward(rewards[i], table);
                break;
            case 'status_type':
                setStatusReward(rewards[i], table);
                break;
        }

    }
}
function convertLocalDateToUTCDate(date, toUTC) {
    date = new Date(date);
    //Local time converted to UTC
    //console.log("Time: " + date);
    var localOffset = date.getTimezoneOffset() * 60000;
    var localTime = date.getTime();
    if (toUTC) {
        date = localTime + localOffset;
    } else {
        date = localTime - localOffset;
    }
    date = new Date(date);
    //console.log("Converted time: " + date);
    return date;
}

function setActivityInfo(activities){
    var activityList = $('#activityList');

    for(var i = 0; i< activities.length; i++){
        var item = $("<li class='list-group-item'></li>");
        activityList.append(item);

        var message = $('<div></div>');
        //message.text(activities[i].name);
        message.html("<b>" + activities[i].name +"</b>" + "을(를) 수행하였습니다")
        item.append(message);

        var timeCaption = $("<div class='activityTimeCaption'></div>");
        var date = $("<abbr class='timeago'></abbr>");

        //var timeStamp = new Date(activities[i].date);
        var timeStamp = convertLocalDateToUTCDate(activities[i].date, true);
        var dateTime = timeStamp.toISOString();

        date.attr('title', dateTime);
        date.text(dateTime);

        timeCaption.append(date);
        item.append(timeCaption);
    }
}

$(document).ready(function(){

    $.ajax({
        url: '/api/userprofile?id=' + $.urlParam('id'),
        dataType:'json',
        success:function(data){
            //1) Set Basic Information
            setUserBasicInfo(data.data.user);

            //2) Set Mission Information
            setMissionInfo(data.data.missions);

            //3) Set Badge Information
            setBadgeInfo(data.data.badges);

            //4) Set Reward Information
            setRewardInfo(data.data.rewards);

            //5) Set Activity Information
            setActivityInfo(data.data.activities);

            $("abbr.timeago").timeago();

            // initialize scroll bar
            $('.scroll-lion').lionbars({
                autohide: true
            });

        },
        error: function(err){
            alert(err.responseText);
        }
    })
});
