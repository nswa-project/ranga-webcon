var utils = {};

utils.formatBytes = (bytes, decimals) =>  {
    if (bytes == 0) return '0 Bytes';
    var k = 1024;
    var dm = decimals <= 0 ? 0 : decimals || 2;
    //var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    var sizes = ['字节', '千字节', '兆字节', '吉字节', '太字节', '拍字节', '艾字节', '泽字节', '尧字节'];
    var i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
