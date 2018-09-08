var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var ngConstant = require('gulp-ng-constant');
var jeditor = require("gulp-json-editor");
var gp_concat = require('gulp-concat');
var removeCode = require('gulp-remove-code');
/*var browserSync = require('browser-sync');
 var runSequence = require('run-sequence');

 var $ = require('gulp-load-plugins')({
 pattern: ['gulp-*', 'lazypipe', 'del', 'run-sequence']
 });*/
var paths = {
    sass: ['./scss/**/*.scss']
};

gulp.task('serve:before', ['watch']);

var env = 'prod';
var config = {
    dev: {
        jpush_key: '2cfa6af6bae2fb85a3c2a341'
    },
    uat: {
        jpush_key: '2cfa6af6bae2fb85a3c2a341'
    },
    prod: {
        jpush_key: '2cfa6af6bae2fb85a3c2a341'
    }
};
gulp.task('dev', ['set-dev-node-env', 'sass', 'config', 'update-jpush-key', 'icon', 'server']);
gulp.task('uat', ['set-uat-node-env', 'sass', 'config', 'update-jpush-key', 'icon', 'server']);
gulp.task('prod', ['set-prod-node-env', 'sass', 'config', 'update-jpush-key', 'icon', 'server']);
gulp.task('default', ['set-dev-node-env', 'sass', 'config', 'update-jpush-key', 'icon', 'server']);

gulp.task('set-dev-node-env', function () {
    env = 'dev';
});
gulp.task('set-uat-node-env', function () {
    env = 'uat';
});
gulp.task('set-prod-node-env', function () {
    env = 'prod';
});

gulp.task('server', function (done) {
    var notEnv = {"notDev": true, "notUat": true, "notProd": true};
    for (var key in notEnv) {
        if (key.toLowerCase().indexOf(env) !== -1) {
            notEnv[key] = false;
            break;
        }
    }
    gulp.src('config/server.js')
        //这个插件将会删除注释里面的代码，以及注释。
        .pipe(removeCode({notDev: notEnv.notDev}))
        .pipe(removeCode({notUat: notEnv.notUat}))
        .pipe(removeCode({notProd: notEnv.notProd}))
        .pipe(gulp.dest('www/scripts/'))
});

gulp.task('config', function (done) {
    gulp.src('config/config-' + env + '.json')
        .pipe(ngConstant({deps: false})) //一个数组，用于指定模块应具有的默认依赖关系。要将常量添加到现有模块，
        // 可以将其设置为false。此属性将覆盖deps输入json文件中定义的任何属性。
        .pipe(rename('app.constants.js'))
        .pipe(gulp.dest('./www/scripts'))
        .on('end', done);
});
gulp.task('icon', function (done) {
    gulp.src('resources/icon-' + env + '.png')
        .pipe(rename('icon.png'))
        .pipe(gulp.dest('./resources'))
        .on('end', done);
});
gulp.task('piwik', function (done) {
    gulp.src(['./www/scripts/app.constants.js', './www/scripts/piwik.tracking.js'])
        .pipe(gp_concat('app.constants.js'))
        .pipe(gulp.dest('./www/scripts'))
});
gulp.task('sentry', function (done) {
    gulp.src(['./www/scripts/app.constants.js', './www/scripts/sentry.prod.js'])
        .pipe(gp_concat('app.constants.js'))
        .pipe(gulp.dest('./www/scripts'))
});
gulp.task('sentry-demo', function (done) {
    gulp.src(['./www/scripts/app.constants.js', './www/scripts/sentry.demo.js'])
        .pipe(gp_concat('app.constants.js'))
        .pipe(gulp.dest('./www/scripts'))
});
gulp.task('sass', function (done) {
    gulp.src(paths.sass)              // sass: ['./scss/**/*.scss'] 该文件下所有的 .scss文件
        .pipe(sass())                 // 将sass预处理为css  需要gulp 插件gulp-sass
        .on('error', sass.logError)   //其中要加error事件的处理，这样才能在SASS代码语法出错时知道是哪里错
        .pipe(gulp.dest('./www/css/'))   //将处理好的文件放置该文件下(目录结构都会保持一致)
        .pipe(minifyCss({              //根据文件来源路径 压缩css文件
            keepSpecialComments: 0    //保留所有特殊前缀 当你用autoprefixer生成的浏览器前缀，
                                      // 如果不加这个参数，有可能将会删除你的部分前缀
        }))
        .pipe(rename({extname: '.min.css'})) //给文件添加 扩展名
        .pipe(gulp.dest('./www/css/'))
        .on('end', done);                //侦听一个'end'事件
});

gulp.task('watch', function () {
    gulp.watch(paths.sass, ['sass']);
    //  gulp.watch('.www/scripts/**/*.*',['default']);
});


gulp.task('install', ['git-check'], function () {
    return bower.commands.install()
        .on('log', function (data) {
            gutil.log('bower', gutil.colors.cyan(data.id), data.message);
        });
});

gulp.task('git-check', function (done) {
    if (!sh.which('git')) {
        console.log(
            '  ' + gutil.colors.red('Git is not installed.'),
            '\n  Git, the version control system, is required to download Ionic.',
            '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
            '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
        );
        process.exit(1);
    }
    done();
});
gulp.task('update-jpush-key', function (done) {
    gulp.src('./package.json')
        .pipe(jeditor(process), { //执行process函数返回json对象.再对对象进行格式处理
            'indent_char': ' ',
            'indent_size': 4
        })
        .pipe(gulp.dest('./'))
        .on('end', done);
});
var process = function (packageJson) {
    for (var i = 0; i < packageJson.cordovaPlugins.length; i++) {
        var plugin = packageJson.cordovaPlugins[i];
        if (plugin.variables && plugin.variables.API_KEY) {
            plugin.variables.API_KEY = config[env].jpush_key;   //修改packgae.json文件中极光推送的api_key值
        }
    }
    return packageJson;
}
