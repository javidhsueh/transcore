google.maps.LatLng.prototype.distanceFrom = function(latlng) {
    var lat = [this.lat(), latlng.lat()];
    var lng = [this.lng(), latlng.lng()];
    var R = 6378137;
    var dLat = (lat[1]-lat[0]) * Math.PI / 180;
    var dLng = (lng[1]-lng[0]) * Math.PI / 180;
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat[0] * Math.PI / 180 ) * Math.cos(lat[1] * Math.PI / 180 ) *
    Math.sin(dLng/2) * Math.sin(dLng/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c;
    return Math.round(d);
};

function bearing( from, to ) {
    var dir=((Math.atan2(to.lng()-from.lng(), to.lat()-from.lat())*180)/Math.PI)+360,
        angle=((dir-(dir%3))%120);
    return angle;
}

// Array.prototype.contains = function(obj) {
//     var i = this.length;
//     while (i--) {
//         if (this[i] === obj) {
//             return true;
//         }
//     }
//     return false;
// };

function loadOptions(selection_name, candidates, selected_option_value){
    var el_select = $(selection_name);
    for(var idx = 0, max= candidates.length; idx<max; idx+=1){
        var option_value = candidates[idx];
        var setting = {value: option_value, text : Label[option_value]};
        if(option_value === selected_option_value)
            setting["selected"] = "selected";
        el_select.append($('<option>', setting));
    }
}

String.prototype.toHHMMSS = function () {
    var sec_num = parseInt(this, 10); // don't forget the second param
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    var time    = hours+':'+minutes+':'+seconds;
    return time;
};

window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame   ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        function(/* function */ callback, /* DOMElement */ element){
            return window.setTimeout(callback, 1000 / 60);
        };
})();

window.cancelRequestAnimFrame = ( function() {
    return window.cancelAnimationFrame          ||
        window.webkitCancelRequestAnimationFrame    ||
        window.mozCancelRequestAnimationFrame       ||
        window.oCancelRequestAnimationFrame     ||
        window.msCancelRequestAnimationFrame        ||
        clearTimeout;
} )();