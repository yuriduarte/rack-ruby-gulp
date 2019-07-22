var gulp          = require('gulp'),
    imagemin      = require ('gulp-imagemin'),
    clean         = require ('gulp-clean'),
    sass          = require('gulp-sass'),
    sourcemaps    = require('gulp-sourcemaps'),
    autoprefixer  = require('gulp-autoprefixer'),
    rename        = require('gulp-rename'),
    concat        = require('gulp-concat'),
    uglify        = require('gulp-uglify'),
    jshint        = require('gulp-jshint'),
    jshintStylish = require('jshint-stylish'),
    browserSync   = require('browser-sync').create();

gulp.task('copy', ['clean'], function () {
  return gulp.src('src/**/*')
    .pipe(gulp.dest('public'));
});

gulp.task('clean', function () {
  return gulp.src('public')
    .pipe(clean());
});

gulp.task('build-img', function () {
  return gulp.src('public/images/**/*')
    .pipe(imagemin())
    .pipe(gulp.dest('public/images'))
});

gulp.task('styles', ['copy'], function () {
  return gulp.src(['node_modules/bootstrap/scss/bootstrap.scss', 'src/scss/*.scss'])
  .pipe(sourcemaps.init())
  .pipe(sass({
    errLogToConsole: true,
    outputStyle: 'expanded' // compila SASS para CSS
  }))
  .pipe(autoprefixer())
  .pipe(rename('style.min.css')) // ainda não foi minificada neste momento, apenas compilada [opcional]
  .pipe(gulp.dest('src/css/')) // informa tarefa qual diretório para saída CSS compilado [opcional]
  .pipe(sass({
    errLogToConsole: true,
    outputStyle: 'compressed' // minifica style.min.css
  }))
  .pipe(gulp.dest('public/css/')) 
  .pipe(sourcemaps.write('/', { // escreva style.min.css.map no mesmo diretório que style.min.css
    includeContent: false,
    sourceRoot: '../../public/scss' // em relação à localização da saída minificada
  }))
  .pipe(gulp.dest('public/css/')) // informa tarefa qual diretório para saída CSS minificada
});

gulp.task('scripts', function(){
  return gulp.src([ // A ordem em que você lista os arquivos nessa matriz É IMPORTANTE !!
    'node_modules/jquery/dist/jquery.min.js', 
    'node_modules/popper.js/dist/umd/popper.js',
    'node_modules/bootstrap/dist/js/bootstrap.min.js',
    'src/js/main.js'
    ])
  .pipe(gulp.dest("src/js"))
  .pipe(concat('scripts.min.js')) // concatena os arquivos JS listados acima em um arquivo chamado scripts.min.js
  .pipe(uglify({
      output: {
          comments: /^\!/ // manter comentários que começam com "/*!"
      }
  })) // minifies scripts.min.js
  .pipe(gulp.dest('public/js/')) // informa à tarefa qual diretório gera scripts scripts.min.js uglificados (minificados)
  .pipe(browserSync.stream());
});

gulp.task('server', ['styles'], function () {
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

  gulp.watch(['node_modules/bootstrap/scss/bootstrap.scss', 'src/scss/*.scss'], ['sass']);

  gulp.watch('src/css/*.css').on('change', function (event) {
    gulp.src(event.path)
      .pipe(csslint())
      .pipe(csslint.reporter())
  });  
    
  gulp.watch('src/**/*.*').on('change', browserSync.reload);
});

gulp.task('default', ['styles', 'scripts', 'build-img', 'server'], function() {  // inclua uma série de tarefas para executá-las na execução inicial de 'gulp' no terminal
  gulp.watch(['node_modules/bootstrap/scss/bootstrap.scss', 'src/scss/**/*.scss'], ['styles']); // Assista os arquivos sass para mudanças
  gulp.watch('src/js/**.*', ['scripts']); // Assista os arquivos JS para mudanças
});