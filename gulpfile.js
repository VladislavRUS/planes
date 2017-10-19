var gulp        = require('gulp');
var browserSync = require('browser-sync').create();

// Static server
gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
});

gulp.task('watch', () => {
    gulp.watch('./scripts/*.js', browserSync.reload);
});

gulp.task('default', ['watch', 'browser-sync']);