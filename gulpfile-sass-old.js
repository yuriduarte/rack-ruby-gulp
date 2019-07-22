var gulp          = require('gulp'),
    sass          = require('gulp-sass'),
    sourcemaps    = require('gulp-sourcemaps'),
    autoprefixer  = require('gulp-autoprefixer'),
    rename        = require('gulp-rename'),
    concat        = require('gulp-concat'),
    uglify        = require('gulp-uglify');
 
gulp.task('styles', function () {
  return gulp.src('src/scss/style.scss')
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
  .pipe(sourcemaps.write('/', { // escreva style.min.css.map no mesmo diretório que style.min.css
    includeContent: false,
    sourceRoot: '../../public/scss' // em relação à localização da saída minificada
  }))
  .pipe(gulp.dest('public/css/')) // informa tarefa qual diretório para saída CSS minificada
});

gulp.task('scripts', function(){
  return gulp.src([ // A ordem em que você lista os arquivos nessa matriz É IMPORTANTE !!
      'src/js/main.js',
    ])
  .pipe(concat('scripts.min.js')) // concatena os arquivos JS listados acima em um arquivo chamado scripts.min.js
  .pipe(uglify({
      output: {
          comments: /^\!/ // manter comentários que começam com "/*!"
      }
  })) // minifies scripts.min.js
  .pipe(gulp.dest('public/js/')) // informa à tarefa qual diretório gera scripts scripts.min.js uglificados (minificados)
});

gulp.task('default', ['styles', 'scripts'], function() {  // inclua uma série de tarefas para executá-las na execução inicial de 'gulp' no terminal
  gulp.watch('src/scss/**/*.scss', ['styles']); // Assista os arquivos sass para mudanças
  gulp.watch('src/js/**.*', ['scripts']); // Assista os arquivos JS para mudanças
});