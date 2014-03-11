var postTimeout = {
    tracks: null,
    nowPlaying: null,
    albums: null
};

function setPlayIcon(){
    $('.control.play>.glyphicon').removeClass("glyphicon-pause").addClass("glyphicon-play");
}

function setPauseIcon(){
    $('.control.play>.glyphicon').removeClass("glyphicon-play").addClass("glyphicon-pause");
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
    var filter = {artist: artist};
    if (album) {
        filter.album = album;
    }
    clearTimeout(postTimeout.tracks);
    postTimeout.tracks = setTimeout(function(){
        $.get('ajax/list/tracks',{
            filters: JSON.stringify(filter)
        }, function(data){
            $("#selection").html(Templates.tab.playlist({tracks: data, filters: filter}));
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
    var filter = {artist: artist};
    if (album) {
        filter.album = album;
    }
    if (!album && !artist){
        filter = {_id: trackId};
    }
    clearTimeout(postTimeout.nowPlaying);
    postTimeout.nowPlaying = setTimeout(function(){
        $.get('ajax/list/tracks',{
            filters: JSON.stringify(filter)
        }, function(data){
            $("#playing .list-group").append($(Templates.tab.playlist({tracks: data, playing: true, filters: filter})).find(".list-group-item"));
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

function showNowPlaying(artist, album, trackId, callback){
    var filter = {artist: artist};
    if (album) {
        filter.album = album;
    }
    if (!album && !artist){
        filter = {_id: trackId};
    }
    clearTimeout(postTimeout.nowPlaying);
    postTimeout.nowPlaying = setTimeout(function(){
        $.get('ajax/list/tracks',{
            filters: JSON.stringify(filter)
        }, function(data){
            $("#playing").html(Templates.tab.playlist({tracks: data, playing: true, filters: filter}));
            $(".playlists-tabs .playing a").tab('show');
            showPanel('.wrapper-playlists');
        }, "json")
        .fail(function(jqXHR, textStatus){
            console.log(textStatus);
            console.log(jqXHR.responseText);
        });
        
        if (typeof callback === 'function'){
            $.get('ajax/list/tracks',{
                filters: JSON.stringify(filter)
            }, function(data){
                callback(data);
            }, "json")
            .fail(function(jqXHR, textStatus){
                console.log(textStatus);
                console.log(jqXHR.responseText);
            });
        }
    }, 200);
}

function showAlbums(html){
    $(".albums .panel-body").html(html);
    showPanel('.wrapper-albums');
}

function showAlbumsByArtist(artist){
    var filter = {artist: artist};
    clearTimeout(postTimeout.albums);
    postTimeout.albums = setTimeout(function(){
        $.get('ajax/list/albumsbyartists',{
            filters: JSON.stringify(filter)
        }, function(data){
            showAlbums(Templates.tab.albums({artists: data, filters: filter}));
        }, "json")
        .fail(function(jqXHR, textStatus){
            console.log(textStatus);
            console.log(jqXHR.responseText);
        });
    }, 200);
}