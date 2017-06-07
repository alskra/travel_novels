// ObjectFit
function objectFit(img) {
    var style = img.style;
    style.visibility = 'visible';
    if (document.documentElement.style.objectFit === undefined) {
        style.backgroundImage = 'url("' + img.src + '")';
        style.paddingLeft = '100%';
    }
}
