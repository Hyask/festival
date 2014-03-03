$(document).ready(function() {
    /* Fastsearch */
    $('#search').fastsearch({
        source: "ajax/search/artists",
        recipient: ".search .list-group",
        delay: 300
    });
    
    /* Player */
    $("#player").player()
    .on('playerload', function(e, obj){
        $('.progressbar input').data('slider').max = Math.floor(obj.duration / 1000);
        $('.progressbar input').slider('setValue', 0);
        setTotalTime(Math.floor(obj.duration / 1000));
    })
    .on('playerplaying', function(e, obj){
        $('.progressbar input').slider('setValue', obj.position / 1000);
        setElapsedTime(Math.floor(obj.position / 1000));
    })
    .on('playerstop playerfinish', function(e, obj){
        setElapsedTime(0);
    })
    .on('playerstop playerpause playerfinish', function(e, obj){
        setPlayIcon();
    })
    .on('playerplay playerresume', function(e, obj){
        setPauseIcon();
    });
    
    /* Events */
    $(document).hammer().on('tap', "[data-role='play']", function(e){
        var artist = $(e.currentTarget).data("artist"),
            trackUniqid = $(e.currentTarget).data("trackUniqid"),
            trackId = $(e.currentTarget).data("trackId"),
            album = $(e.currentTarget).data("album");
        if (!artist && !album){
            $("#player").player('play', trackUniqid);
        }else{
            // Set in "Now playing" tab
            showNowPlaying(artist, album, trackId, function(tracks){
                if (tracks){
                    $("#player").player('add', tracks, true);
                }
            });
        }
    });
    
    $(document).hammer().on('tap', "[data-role='add']", function(e){
        var artist = $(e.currentTarget).data("artist"),
            trackId = $(e.currentTarget).data("trackId"),
            album = $(e.currentTarget).data("album");
        addNowPlaying(artist, album, trackId, function(tracks){
            if (tracks){
                $("#player").player('add', tracks);
            }
        });
    });
    
    $(document).hammer().on('tap', "[data-role='show-tracks']", function(e){
        var artist = $(e.currentTarget).data("artist"),
            album = $(e.currentTarget).data("album");
        showTracks(artist, album);
    });
    
    $(document).hammer().on('tap', "[data-role='show-albums']", function(e){
        var artist = $(e.currentTarget).data("artist");
        if (artist){
            showAlbumsByArtist(artist);
        }
    });
    
    $('.control.play').hammer().on('tap', function(e){
        $('#player').player('togglePlayPause');
    });
    
    $('.control.next').hammer().on('tap', function(e){
        $('#player').player('next');
    });
    
    $('.control.prev').hammer().on('tap', function(e){
        $('#player').player('prev');
    });
    
    /* Swipe */
    $("body").hammer().on('swipeleft', function(e){
        showNextPanel();
    }).on('swiperight', function(e){
        showPreviousPanel();
    });
    
    /* Progress bar */
    $('.progressbar input').slider({
        formater: function(value) {
            return utils.format_duration(value);
        }
    })
    .removeClass("hidden")
    .on('slide', function(e){
        var pos = parseInt(e.value, 10) * 1000,
            cur = $("#player").data('player').currentSound;
        if (!!cur && cur.readyState > 2) {
            cur.setPosition(pos);
        }
    });
    
    /*
    
    /* Volume *
    $('#volume-max').slider({
        orientation: "vertical",
        range: "min",
        max: 100,
        value: 100,
        create: function( event, ui ) {
            $('#volume-max a').remove();
        },
        slide: function( event, ui ) {
            $player.player('setVolume', $('#volume-max').slider('value'));
        }
    });
    
    var timeoutvolume = null;
    $("#volume-wrapper, #volume").hover(
        function() {
            if (timeoutvolume) {
                clearTimeout(timeoutvolume);
                timeoutvolume = null;
            }
        },
        function() {
            timeoutvolume = setTimeout(function() {
                timeoutvolume = null;
                $player.player('hideVolume');
            }, 800);
        }
    );
    
    $('#volume-max').on('mousemove', function(e){
        var cursorPositionRelative = Math.round((e.pageY - $('#volume-max').offset().top)),
            cursorPosition = 100 - Math.floor((cursorPositionRelative/$('#volume-max').height()) * 100);
        tooltipVol.setContent(cursorPosition);
        /*Position*
        $('.tooltip-volume').position({
            my: "right-15 top+" + (cursorPositionRelative - 8),
            at: "left top",
            of: $("#volume-max"),
            collision: "flipfit"
        });
    });
    
    /* Actions *
    $(document).on('mouseenter mouseleave', '.wrapper li, .album_list_element, #tabs-playlist tr', function(){
        $(this).find('.actionhandler').toggleClass('active_hover');
    });
    
    /* Shortcuts *
    $(document).on('keydown.space', function() {
        $player.player('togglePlayPause');
    });
    $(document).on('keydown.ctrl_right', function() {
        $player.player('next');
    });
    $(document).on('keydown.ctrl_left', function() {
        $player.player('prev');
    });
    */
});
