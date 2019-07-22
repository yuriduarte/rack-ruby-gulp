var
  gulp = require('gulp'),
  imagemin = require('gulp-imagemin'),
  clean = require('gulp-clean'),
  concat = require('gulp-concat'),  
  uglify = require('gulp-uglify'),
  usemin = require('gulp-usemin'),
  cssmin = require('gulp-cssmin'),
  jshint = require('gulp-jshint'),
  jshintStylish = require('jshint-stylish'),
  csslint = require('gulp-csslint'),
  autoprefixer = require('gulp-autoprefixer'),
  sass = require('gulp-sass'),
  browserSync = require('browser-sync').create();

gulp.task('default', ['copy'], function () {
  gulp.start('build-img', 'usemin', 'js', 'server');
});

gulp.task('copy', ['clean'], function () {
  return gulp.src('src/**/*')
    .pipe(gulp.dest('public'));
});

gulp.task('clean', function () {
  return gulp.src('public')
    .pipe(clean());
});

gulp.task('build-img', function () {
  gulp.src('public/images/**/*')
    .pipe(imagemin())
    .pipe(gulp.dest('public/images'))
});

gulp.task('usemin', function () {
  gulp.src('public/**/*.html')
    .pipe(usemin({
      'js': [uglify],
      'css': [autoprefixer, cssmin]
    }))
    .pipe(gulp.dest('public'))
});

// Compile sass into CSS & auto-inject into browsers.
gulp.task('sass', function () {
  return gulp.src(['node_modules/bootstrap/scss/bootstrap.scss', 'src/scss/*.scss'])
    .pipe(sass({
      outputStyle: 'expanded' // compila SASS para CSS
    }))
    .pipe(gulp.dest('src/css'))
    .pipe(sass({
      outputStyle: 'compressed' // minifica style.min.css
    }))
    .pipe(gulp.dest('public/css/'))
    .pipe(browserSync.stream());
})

// Move the javascript files into our /public/js and /src/js folders.
gulp.task('js', function(){
  return gulp.src([ // A ordem em que você lista os arquivos nessa matriz É IMPORTANTE !!
    'node_modules/jquery/dist/jquery.min.js', 
    'node_modules/popper.js/dist/umd/popper.js',
    'node_modules/bootstrap/dist/js/bootstrap.min.js',
    'src/js/main.js'
    ])
  .pipe(concat('scripts.min.js')) // concatena os arquivos JS listados acima em um arquivo chamado scripts.min.js
  .pipe(gulp.dest("src/js"))
  .pipe(uglify({
      output: {
          comments: /^\!/ // manter comentários que começam com "/*!"
      }
  })) // minifies scripts.min.js
  .pipe(gulp.dest('public/js/')) // informa à tarefa qual diretório gera scripts scripts.min.js uglificados (minificados)
  .pipe(browserSync.stream());
});

gulp.task('server', ['sass'], function () {
  browserSync.init({
    server: {
      baseDir: "src"
    }
  });

  gulp.watch('src/js/*.js').on('change', function (event) {
    gulp.src(event.path)
      .pipe(jshint())
      .pipe(jshint.reporter(jshintStylish))
  });

  // gulp.watch('src/css/*.css').on('change', function (event) {
    //   gulp.src(event.path)
    //     .pipe(csslint())
    //     .pipe(csslint.reporter())
    // });  
    
  gulp.watch(['node_modules/bootstrap/scss/bootstrap.scss', 'src/scss/*.scss'], ['sass']);
  gulp.watch('src/**/*.*').on('change', browserSync.reload);
});