const gulp     = require("gulp");
const babel    = require("gulp-babel");
const cleanCSS = require("gulp-clean-css");
const plumber  = require("gulp-plumber");

gulp.task("es6", () => {
	return gulp.src('public/js/src/app.js')
		.pipe(plumber())
		.pipe(babel({
			presets: ["es2015"]
		}))
		.pipe(gulp.dest('public'));
});

gulp.task("minifyCSS", () => {
	return gulp.src('src/public/css/style.css')
		.pipe(plumber())
		.pipe(cleanCSS({ compatibility: "ie8"}))
		.pipe(gulp.dest('public'));
});

gulp.task("watch", () => {
  gulp.watch('public/js/src/app.js', ['es6']);
	gulp.watch('src/public/css/style.css', ['minifyCSS']);
});

gulp.task("default", ['es6', 'minifyCSS', 'watch']);
