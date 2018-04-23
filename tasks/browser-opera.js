/*
 * Opera build is the same as Chromium build but includes it own filters.
 * This task is running after Chromium build, so we need to copy Chromium folder
 * and include Opera filters files. To zip Opera build folder if release.
 */

/* global process */
import path from 'path';
import gulp from 'gulp';
import {BUILD_DIR, BRANCH_RELEASE} from './consts';
import {version} from './parse-package';
import zip from 'gulp-zip';

const paths = {
    filtersOpera: path.join('Extension/filters/opera/**/*'),
    chromium: path.join(BUILD_DIR, process.env.NODE_ENV || '', `chrome-${version}`),
    dest: path.join(BUILD_DIR, process.env.NODE_ENV || '', `opera-${version}`)
};

const dest = {
    filters: path.join(paths.dest, 'filters'),
    inner: path.join(paths.dest, '**/*'),
    buildDir: path.join(BUILD_DIR, process.env.NODE_ENV || '')
};

// copy chromium build dir
const copyChromiumFiles = () => gulp.src(paths.chromium).pipe(gulp.dest(paths.dest));

// replace chromium filters by opera filters
const copyFiltersOpera = () => gulp.src(paths.filtersOpera).pipe(gulp.dest(dest.filters));

const createOperaArchive = (done) => {
    if (process.env.NODE_ENV !== BRANCH_RELEASE) {
        return done();
    }

    return gulp.src(dest.inner)
        .pipe(zip(`opera-${version}.zip`))
        .pipe(gulp.dest(dest.buildDir));
};

export default gulp.series(copyChromiumFiles, copyFiltersOpera, createOperaArchive);
