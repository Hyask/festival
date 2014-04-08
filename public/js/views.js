var postTimeout = {
    tracks: null,
    nowPlaying: null,
    albums: null
};

function showExtendedControls() {
    $("#player .loader").hide();
    $('#player .controls .showmore').siblings().removeClass('hidden-xs');
    $('#player .controls .next, #player .controls .prev').removeClass('hidden-xs');
    $('#player .controls .showmore span').html('Less');
}

function hideExtendedControls() {
    $("#player .loader").show();
    $('#player .controls .showmore').siblings().addClass('hidden-xs');
    $('#player .controls .next, #player .controls .prev').addClass('hidden-xs');
    $('#player .controls .showmore span').html('More');
}

function hideLoadingOverlay(applyOn) {
    $(applyOn).find('.overlay').remove();
}

function showLoadingOverlay(applyOn) {
    var overlayHtml = "<div class='overlay'><div class='spinner'>"+
        "<div class='rect1'></div><div class='rect2'></div><div class='rect3'>"+
        "</div><div class='rect4'></div><div class='rect5'></div></div></div>";
    $(overlayHtml).appendTo($(applyOn));
}

function hideVolume(){
    $('#player .controls .volume').removeClass("active");
    $('.volume-wrapper').addClass('hidden');
}

function setPlayingTrack(uniqid){
    $(".track.playing").removeClass("playing");
    if (!!uniqid) {
        $('[data-track-uniqid="'+uniqid+'"]').addClass("playing");
    }
}

function setTrackInfo(uniqid){
    var tracks = $.store('get', 'tracks'),
        track = tracks[uniqid];
    $("#player .info .name").html("<span class='title'>" + track.name + "</span><span class='album'>" + track.album + "</span><span class='artist'>" + track.artist + "</span>");
}

function setPlayIcon(){
    $('.control.play').removeClass("pause").attr("title", "Play");
}

function setPauseIcon(){
    $('.control.play').addClass("pause").attr("title", "Pause");
}

function setElapsedTime(val){
    $('.elapsed-time').html(utils.format_duration(val));
}

function setTotalTime(val){
    $('.total-time').html(utils.format_duration(val));
}

function showPanel(panel){
    var current = $(".wrapper:visible");
    if (current.length === 1) { // mobile devices
        var prev = current.prevAll(":not(.hidden)"),
            next = current.nextAll(":not(.hidden)");
        if (panel === "next"){
            current.addClass("hidden-xs hidden-sm").removeClass("current left right");
            next.first().removeClass("hidden-xs hidden-sm").addClass("current left");
        }else if (panel === "prev"){
            current.addClass("hidden-xs hidden-sm").removeClass("current left right");
            prev.first().removeClass("hidden-xs hidden-sm").addClass("current right");
        }else{
            if(prev.filter(panel).length > 0){
                current.addClass("hidden-xs hidden-sm").removeClass("current left right");
                $(panel).removeClass("hidden-xs hidden-sm").addClass("current right");
            }else if (next.filter(panel).length > 0){
                current.addClass("hidden-xs hidden-sm").removeClass("current left right");
                $(panel).removeClass("hidden-xs hidden-sm").addClass("current left");
            }
        }
    }
}

function showNextPanel(){
    showPanel("next");
}

function showPreviousPanel(){
    showPanel("prev");
}

function showTracks(artist, album){
    var filter = {artist: ""+artist};
    if (album) {
        filter.album = ""+album;
    }
    clearTimeout(postTimeout.tracks);
    postTimeout.tracks = setTimeout(function(){
        $.get('ajax/list/tracks',{
            filters: JSON.stringify(filter)
        }, function(data){
            $("#selection").html(Templates["views/tab/playlist"]({tracks: data, filters: filter}));
            $(".playlists-tabs .selection a").tab('show');
            showPanel('.wrapper-playlists');
        }, "json")
        .fail(function(jqXHR, textStatus){
            console.log(textStatus);
            console.log(jqXHR.responseText);
        });
    }, 200);
}

function addNowPlaying(artist, album, trackId, callback){
    var filter = {artist: ""+artist};
    if (album) {
        filter.album = ""+album;
    }
    if (!album && !artist){
        filter = {_id: ""+trackId};
    }
    clearTimeout(postTimeout.nowPlaying);
    postTimeout.nowPlaying = setTimeout(function(){
        $.get('ajax/list/tracks',{
            filters: JSON.stringify(filter)
        }, function(data){
            $("#playing .list-group").append($(Templates["views/tab/playlist"]({tracks: data, playing: true, filters: filter})).find(".list-group-item"));
            $(".playlists-tabs .playing a").tab('show');
            if (typeof callback === 'function'){
                callback(data);
            }
        }, "json")
        .fail(function(jqXHR, textStatus){
            console.log(textStatus);
            console.log(jqXHR.responseText);
        });
    }, 200);
}

function showNowPlayingData(data, playing){
    $("#playing").html(Templates["views/tab/playlist"]({tracks: data, playing: !!playing}));
    $(".playlists-tabs .playing a").tab('show');
    showPanel('.wrapper-playlists');
}

function showNowPlaying(artist, album, trackId, callback){
    var filter = {artist: ""+artist};
    if (album) {
        filter.album = ""+album;
    }
    if (!album && !artist){
        filter = {_id: ""+trackId};
    }
    clearTimeout(postTimeout.nowPlaying);
    postTimeout.nowPlaying = setTimeout(function(){
        $.get('ajax/list/tracks',{
            filters: JSON.stringify(filter)
        }, function(data){
            showNowPlayingData(data, true);
            if (typeof callback === 'function'){
                 callback(data);
            }
        }, "json")
        .fail(function(jqXHR, textStatus){
            console.log(textStatus);
            console.log(jqXHR.responseText);
        });
    }, 200);
}

function showAlbums(html){
    $(".albums .panel-body").html(html);
    showPanel('.wrapper-albums');
}

function showAlbumsByArtist(artist){
    var filter = {artist: ""+artist};
    clearTimeout(postTimeout.albums);
    postTimeout.albums = setTimeout(function(){
        showLoadingOverlay('.wrapper-albums');
        $.get('ajax/list/albumsbyartists',{
            filters: JSON.stringify(filter)
        }, function(data){
            showAlbums(Templates["views/tab/albums"]({artists: data, filters: filter}));
        }, "json")
        .fail(function(jqXHR, textStatus){
            console.log(textStatus);
            console.log(jqXHR.responseText);
        })
        .always(function(jqXHR, textStatus){
            hideLoadingOverlay('.wrapper-albums');
        });
    }, 200);
}