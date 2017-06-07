'use strict';

const gulp = require('gulp');
const rigger = require('gulp-rigger');
const stylus = require('gulp-stylus');
const cleanCSS = require('gulp-clean-css');
const urlAdjuster = require('gulp-css-url-adjuster');
const uglify = require('gulp-uglify');
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const debug = require('gulp-debug');
const gulpIf = require('gulp-if');
const filter = require('gulp-filter');
const del = require('del');
const newer = require('gulp-newer');
const browserSync = require('browser-sync').create();
const reload = browserSync.reload;
const notify = require('gulp-notify');
const combiner = require('stream-combiner2').obj;
const pug = require('gulp-pug');
const path = require('path');
const rename = require("gulp-rename");
const map = require('map-stream');
const imagemin = require('gulp-imagemin');
const imageminPngquant = require('imagemin-pngquant');
const imageminJpegoptim = require('imagemin-jpegoptim');
const iconfont = require('gulp-iconfont');
const iconfontCss = require('gulp-iconfont-css');
const htmlparser = require("htmlparser2");
const posthtml = require('gulp-posthtml');
const autoprefixer = require('autoprefixer-stylus');
const emitty = require('emitty').setup('markup', 'pug');
const realFavicon = require('gulp-real-favicon');
const fs = require('fs');
const zip = require('gulp-zip');
const merge = require('merge-stream');
const cache = require('gulp-cached');
const remember = require('gulp-remember');
const posthtmlBemSugar = require('posthtml-bem-sugar');
const posthtmlBem = require('posthtml-bem');
const getClassesFromHtml = require('get-classes-from-html');

global.isDevelopment = process.env.NODE_ENV !== 'production';
global.depsObj = {};
global.depsArr = [];

const browsers = ['last 2 versions', 'ie >= 9'];

const pkgData = 'package.json';
const depsData = 'deps.json';
const FAVICON_DATA_FILE = 'markup/static/favicon/faviconData.json';

gulp.task('generate-favicon', function(done) {
    realFavicon.generateFavicon({
        masterPicture: 'markup/static/favicon/like.svg',
        dest: 'build/',
        iconsPath: '/',
        design: {
            ios: {
                pictureAspect: 'backgroundAndMargin',
                backgroundColor: '#ffffff',
                margin: '14%',
                assets: {
                    ios6AndPriorIcons: false,
                    ios7AndLaterIcons: false,
                    precomposedIcons: false,
                    declareOnlyDefaultIcon: true
                }
            },
            desktopBrowser: {},
            windows: {
                pictureAspect: 'whiteSilhouette',
                backgroundColor: '#6f9d39',
                onConflict: 'override',
                assets: {
                    windows80Ie10Tile: false,
                    windows10Ie11EdgeTiles: {
                        small: false,
                        medium: true,
                        big: false,
                        rectangle: false
                    }
                }
            },
            androidChrome: {
                pictureAspect: 'shadow',
                themeColor: '#ffffff',
                manifest: {
                    name: 'Хобби-таемый остров',
                    display: 'standalone',
                    orientation: 'notSet',
                    onConflict: 'override',
                    declared: true
                },
                assets: {
                    legacyIcon: false,
                    lowResolutionIcons: false
                }
            },
            safariPinnedTab: {
                pictureAspect: 'silhouette',
                themeColor: '#6f9d39'
            }
        },
        settings: {
            scalingAlgorithm: 'Mitchell',
            errorOnImageTooSmall: false
        },
        markupFile: FAVICON_DATA_FILE
    }, function() {
        done();
    });
});

// Inject the favicon markups in your HTML pages. You should run
// this task whenever you modify a page. You can keep this task
// as is or refactor your existing HTML pipeline.
gulp.task('inject-favicon-markups', function() {
    return gulp.src([ 'TODO: List of the HTML files where to inject favicon markups' ])
        .pipe(realFavicon.injectFaviconMarkups(JSON.parse(fs.readFileSync(FAVICON_DATA_FILE)).favicon.html_code))
        .pipe(gulp.dest('TODO: Path to the directory where to store the HTML files'));
});

// Check for updates on RealFaviconGenerator (think: Apple has just
// released a new Touch icon along with the latest version of iOS).
// Run this task from time to time. Ideally, make it part of your
// continuous integration system.
gulp.task('check-for-favicon-update', function(done) {
    var currentVersion = JSON.parse(fs.readFileSync(FAVICON_DATA_FILE)).version;
    realFavicon.checkForUpdates(currentVersion, function(err) {
        if (err) {
            throw err;
        }
    });
});

function getDepsObj(file) {
    Array.isArray(depsObj[file.stem]) ? depsObj[file.stem].splice(0, depsObj[file.stem].length) : depsObj[file.stem] = [];

    getClassesFromHtml(file.contents.toString()).forEach(function (className, i, arr) {
        (depsObj[file.stem].indexOf(className) === -1) && (className.indexOf('__') === -1) && (className.indexOf('_') === -1) && depsObj[file.stem].push(className);
    });

    return file;
}

gulp.task('html', gulp.series(
    function getHTML() {
        return combiner(
            gulp.src(['markup/pages/*.pug']),
            gulpIf(global.isWatch, emitty.stream(global.emittyChangedFile)),
            pug({
                pretty: true,
                locals: {
                    isDevelopment: global.isDevelopment,
                    pkg: JSON.parse(fs.readFileSync(pkgData)),
                    faviconCode: JSON.parse(fs.readFileSync(FAVICON_DATA_FILE)).favicon.html_code
                }
            }),
            posthtml([
                posthtmlBemSugar({
                    blockPrefix: '-',
                    elemPrefix: '__',
                    modPrefix: '_',
                    modDlmtr: '_'
                }),
                posthtmlBem()
            ]),
            map(function (file, cb) {cb(null, getDepsObj(file))}),
            debug({title: 'HTML'}),
            gulp.dest('build/')
        ).on('error', notify.onError(function(err) {
            return {
                title: 'HTML',
                message: err.message
            }
        }));
    },
    function getDepsArr(done) {
        depsArr.splice(0, depsArr.length);
        for (var prop in depsObj) if (depsObj.hasOwnProperty(prop)){
            depsObj[prop].forEach(function (className) {
                (depsArr.indexOf('markup/components/' + className) === -1) && depsArr.push('markup/components/' + className);
            });
        }
        console.log(depsObj);
        console.log(depsArr);
        done();
    }
));

gulp.task('css:components', function () {
    var deps = JSON.parse(fs.readFileSync(depsData));
    const filterStyl = filter('**/*.styl', {restore: true});
    return combiner(
        gulp.src(deps.css_src),
        sourcemaps.init(),
        filterStyl,
        concat({path: 'components.styl'}),
        stylus({
            'include css': true,
            use: [autoprefixer({
                browsers: browsers,
                cascade: false
            })]
        }),
        filterStyl.restore,
        concat({path: 'components.css'}),
        sourcemaps.write(),
        debug({title: 'CSS:components'}),
        gulp.dest('build/static/css/')
    ).on('error', notify.onError(function(err) {
        return {
            title: 'CSS:components',
            message: err.message
        }
    }));
});

gulp.task('css:blocks', function () {
    return combiner(
        gulp.src(depsArr.map(function (dep) {return path.join(dep, '*.styl');}))
            .on('data', function (file) {
                file.dirname = file.cwd;
                //console.log(file.relative);
            }),
        sourcemaps.init(),
        cache('stylus'),
        debug({title: 'CSS:blocks-after-cache'}),
        stylus({
            'include css': true,
            import: ['app_components/bootstrap/css/variables.styl', 'app_components/bootstrap/css/mixins.styl'],
            use: [autoprefixer({
                browsers: browsers,
                cascade: false
            })]
        }),
        remember('stylus'),
        debug({title: 'CSS:blocks-after-remember'}),
        concat({path: 'blocks.css'}),
        sourcemaps.write(),
        debug({title: 'CSS:blocks'}),
        gulp.dest('build/static/css/')
    ).on('error', notify.onError(function(err) {
        return {
            title: 'CSS:blocks',
            message: err.message
        }
    }));
});

gulp.task('css:main', function () {
    return combiner(
        gulp.src(['build/static/css/components.css', 'build/static/css/blocks.css']),
        concat({path: 'main.min.css'}),
        cleanCSS({level: 1}),
        debug({title: 'CSS:main'}),
        gulp.dest('build/static/css/')
    ).on('error', notify.onError(function(err) {
        return {
            title: 'CSS:main',
            message: err.message
        }
    }));
});

gulp.task('js:components', function () {
    var deps = JSON.parse(fs.readFileSync(depsData));
    return combiner(
        gulp.src(deps.js_src),
        sourcemaps.init(),
        concat({path: 'components.js'}),
        sourcemaps.write(),
        debug({title: 'JS:components'}),
        gulp.dest('build/static/js/')
    ).on('error', notify.onError(function(err) {
        return {
            title: 'JS:components',
            message: err.message
        }
    }));
});

gulp.task('js:blocks', function () {
    return combiner(
        gulp.src(depsArr.map(function (dep) {return path.join(dep, '*.js');})),
        sourcemaps.init(),
        concat({path: 'blocks.js'}, {newLine: '\n\n'}),
        sourcemaps.write(),
        debug({title: 'JS:blocks'}),
        gulp.dest('build/static/js/')
    ).on('error', notify.onError(function(err) {
        return {
            title: 'JS:blocks',
            message: err.message
        }
    }));
});

gulp.task('js:main', function () {
    return combiner(
        gulp.src(['build/static/js/components.js', 'build/static/js/blocks.js']),
        concat({path: 'main.min.js'}),
        uglify(),
        debug({title: 'JS:main'}),
        gulp.dest('build/static/js/')
    ).on('error', notify.onError(function(err) {
        return {
            title: 'JS:main',
            message: err.message
        }
    }));
});

gulp.task('img', function() {
    return combiner(
        gulp.src(['markup/static/img/content/**/*.{png,jp*g,gif,svg}'].concat(depsArr.map(function (dep) {return path.join(dep, '*.{png,jp*g,gif,svg}');}))),
        newer('build/static/img/content/'),
        newer('build/static/img/general/'),
        imagemin([
            imagemin.gifsicle({interlaced: true}),
            imageminJpegoptim({progressive: true, max: 80}),
            imagemin.optipng({optimizationLevel: 5}),
            imagemin.svgo({plugins: [{removeViewBox: false}]})
        ]),
        debug({title: 'IMG'}),
        gulp.dest(function (file) {
            return file.base.indexOf(path.resolve('markup/static/img/content/')) !== -1 ? 'build/static/img/content/' : 'build/static/img/general/';
        })
    ).on('error', notify.onError(function(err) {
        return {
            title: 'IMG',
            message: err.message
        }
    }));
});

gulp.task('fonts', function(done) {
    var deps = JSON.parse(fs.readFileSync(depsData));
    if (deps.fonts_src.length) {
        return combiner(
            gulp.src(deps.fonts_src.map(function (dep) {return path.join(dep, '*.{woff*,ttf,eot,svg}');}), {base: path.resolve("markup/static/fonts/")}),
            debug({title: 'FONTS'}),
            gulp.dest('build/static/fonts/')
        ).on('error', notify.onError(function(err) {
            return {
                title: 'FONTS',
                message: err.message
            }
        }));
    }
    else {
        done();
    }
});

gulp.task('fontawesome', gulp.parallel(
    function() {
        return combiner(
            gulp.src(['./node_modules/fa-stylus/fonts/*.{woff*,ttf,eot,svg}']),
            debug({title: 'FONTAWESOME'}),
            gulp.dest('build/static/fonts/font-awesome/')
        ).on('error', notify.onError(function(err) {
            return {
                title: 'FONTAWESOME',
                message: err.message
            }
        }));
    },
    function() {
        return combiner(
            gulp.src(['markup/static/fonts/font-awesome/font-awesome.styl']),
            stylus({
                use: [require('fa-stylus')()]
            }),
            debug({title: 'FONTAWESOME'}),
            gulp.dest('markup/static/fonts/font-awesome/')
        ).on('error', notify.onError(function(err) {
            return {
                title: 'FONTAWESOME',
                message: err.message
            }
        }));
    }
));

gulp.task('glyphicons', function(){
    return combiner(
        gulp.src(['markup/static/fonts/glyphicons/icons/*.svg']),
        iconfontCss({
            fontName: 'glyphicons',
            targetPath: '../../../../markup/static/fonts/glyphicons/glyphicons.css',
            fontPath: '../fonts/glyphicons/',
            cssClass: 'gly',
            path: 'markup/static/fonts/glyphicons/.css_tmp'
        }),
        iconfont({
            fontName: 'glyphicons',
            prependUnicode: true,
            formats: ['woff2', 'woff', 'ttf', 'eot', 'svg'],
            fontHeight: 600, //creating the icons larger allows for better rendering at sizes greater than 100px
            normalize: true
        }),
        debug({title: 'GLYPHICONS'}),
        gulp.dest('build/static/fonts/glyphicons/'),
        reload({stream: true})
    ).on('error', notify.onError(function(err) {
        return {
            title: 'GLYPHICONS',
            message: err.message
        }
    }));
});

gulp.task('misc', function() {
    return combiner(
        gulp.src(['markup/static/misc/**/*.*']),
        newer('build/'),
        debug({title: 'MISC'}),
        gulp.dest('build/'),
        reload({stream: true})
    ).on('error', notify.onError(function(err) {
        return {
            title: 'MISC',
            message: err.message
        }
    }));
});

gulp.task('clean', function() {
    return del(['build/']);
});

gulp.task('build', gulp.series('clean', gulp.parallel(/*'generate-favicon', */'glyphicons'),
    'html', 'img', gulp.parallel('css:components', 'css:blocks', 'js:components', 'js:blocks', 'fonts', 'misc')));

gulp.task('reloadGlobal', function() {
    return gulp.src('build/**/*.html', {since: gulp.lastRun('reloadGlobal')})
        .pipe(reload({stream: true}));
});

//Watchers
gulp.task('watch', function() {
    global.isWatch = true;

    //Global
    gulp.watch('markup/**/*.pug', gulp.series('html', 'img', gulp.parallel('css:blocks', 'js:blocks'), 'reloadGlobal'))
        .on('all', function(event, filepath) {
            global.emittyChangedFile = filepath;
        });
    gulp.watch([pkgData, depsData], gulp.series('html', gulp.parallel('css:components', 'css:blocks', 'js:components', 'js:blocks', 'fonts'), 'reloadGlobal'));

    //CSS
    gulp.watch(['app_components/**/*.{css,styl}', 'markup/static/**/*.{css,styl}'], gulp.series('css:components', function reloadCSS_components(done) {
        reload('build/static/css/components.css'); done();
    }));
    gulp.watch(['app_components/bootstrap/css/variables.styl', 'app_components/bootstrap/css/mixins.styl', 'markup/components/**/*.styl'], gulp.series('css:blocks', function reloadCSS_blocks(done) {
        reload('build/static/css/blocks.css'); done();
    })).on('change', function (event) {
        if (event.type === 'deleted') { // if a file is deleted, forget about it
            delete cache.caches['stylus'][event.path];
            remember.forget('stylus', event.path);
        }
    });

    //JS
    gulp.watch(['app_components/**/*.js'], gulp.series('js:components', function reloadJS_components(done) {
        reload('build/static/js/blocks.js'); done();
    }));
    gulp.watch(['markup/components/**/*.js'], gulp.series('js:blocks', function reloadJS_blocks(done) {
        reload('build/static/js/blocks.js'); done();
    }));

    //IMG
    gulp.watch(['markup/static/img/content/**/*.{png,jp*g,gif,svg}', 'markup/components/**/*.{png,jp*g,gif,svg}'], gulp.series('img', function reloadIMG(done) {
        reload('build/static/img/**/*.{png,jp*g,gif,svg}'); done();
    }));

    //GLYPHICONS
    gulp.watch(['markup/static/fonts/glyphicons/icons/*.svg'], gulp.series('glyphicons'));

    //MISC
    gulp.watch(['markup/static/misc/**/*.*'], gulp.series('misc'));
});

gulp.task('server', function() {
    browserSync.init({
        server: {
            baseDir: 'build/'
        },
        tunnel: false,
        host: 'localhost',
        port: 3000,
        logPrefix: 'AlSKra'
    });

    //browserSync.watch('build/**/*.*').on('change', browserSync.reload);
});

gulp.task('zip', function () {
    var pkg = JSON.parse(fs.readFileSync(pkgData));
    return gulp.src('build/**/*.*')
        .pipe(zip(pkg.name.toLowerCase() + '-' + pkg.version + '.zip'))
        .pipe(gulp.dest('build/'));
});

gulp.task('dev',
    gulp.series('build', gulp.parallel('watch', 'server'))
);

gulp.task('prod', gulp.series(
    function (done) {
        global.isDevelopment = false;
        done();
    },
    gulp.series('build', gulp.parallel('css:main', 'js:main'), gulp.parallel('zip', 'server'))
));

