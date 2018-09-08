#!/usr/bin/env node

// Add Platform Class
// v1.0
// Automatically adds the platform class to the body tag
// after the `prepare` command. By placing the platform CSS classes
// directly in the HTML built for the platform, it speeds up
// rendering the correct layout/style for the specific platform
// instead of waiting for the JS to figure out the correct classes.

var fs = require('fs');
var path = require('path');


var rootdir = process.argv[2];

//正则表达式替换文本
function replace_string_in_file(filename, to_replace, replace_with) {
  var data = fs.readFileSync(filename, 'utf8');
  var result = data.replace(to_replace, replace_with);
  fs.writeFileSync(filename, result, 'utf8');
  console.log("替换成功");
}


//获取应用名（因为在ios平台中plist配置文件在应用名文件夹目录下）
function get_data_in_configxmlfile(filename, to_replace) {
  var data = fs.readFileSync(filename, 'utf8');
  return data.match(to_replace)[1];
}
//复制目录中的所有文件
function copyDirFile(src, dst) {
  console.log('src:' + src);
  console.log('dst:' + dst);
  fs.readdir(src, function (err, paths) {
    if (err) {
      console.log("读取文件夹错误");
    } else {
      paths.forEach(function (path) {
        console.log('path:' + path);

        var _src = src + '/' + path,
          _dst = dst + '/' + path,
          readable, writeable;
        if (fs.existsSync(_dst)) {
            console.log('文件已存在：'+_dst);
        } else {
          readable = fs.createReadStream(_src);
          writeable = fs.createWriteStream(_dst);
          readable.pipe(writeable);
        }
      });
    }
  });
}

if (rootdir) {

  // go through each of the platform directories that have been prepared
  var platforms = (process.env.CORDOVA_PLATFORMS ? process.env.CORDOVA_PLATFORMS.split('@') : []);

  for (var x = 0; x < platforms.length; x++) {

    try {
      var platform = platforms[x].trim().toLowerCase();
      var indexPath;
      console.log("010_add_config platform:" + platform);
      if (platform === 'android') {
        var sourcePath ,targetPath ;
        // 复制签名配置文件
        sourcePath = path.join('publish','signing');
        targetPath = path.join('platforms',platform);
        copyDirFile(sourcePath, targetPath, 'utf-8');
      } else if (platform === 'ios') {

      }
    }
    catch (e) {
      process.stdout.write(e);
    }
  }
}
