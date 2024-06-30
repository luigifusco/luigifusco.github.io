var times_failed = 0;

function perform_checks(data, i, j) {
    let seen = new Array(9).fill(false);
    // check square
    let ii = Math.floor(i / 3);
    let jj = j % 3;
    for (let i_iter = 0; i_iter < 3; i_iter++) {
        for (let j_iter = 0; j_iter < 3; j_iter++) {
            let val = data[ii*3*9 + jj*3 + i_iter*9 + j_iter];
            if (val > 0 && seen[val]) {
                return false;
            }
            seen[val] = true;
        }
    }

    // check row
    seen.fill(false);
    for (let j_iter = 0; j_iter < 9; ++j_iter) {
        let val = data[i*9+j_iter];
        if (val > 0 && seen[val]) {
            return false;
        }
        seen[val] = true;
    }

    // check col
    seen.fill(false);
    for (let i_iter = 0; i_iter < 9; ++i_iter) {
        let val = data[i_iter*9+j];
        if (val > 0 && seen[val]) {
            return false;
        }
        seen[val] = true;
    }

    return true;
}

function get_next(i, j) {
    if (i == 8 && j == 8) return [true, 0, 0];
    j++;
    if (j > 8) {
        j = 0;
        i++;
    }

    return [false, i, j];
}

function solve_sudoku_recursive(data, ref, i, j) {
    const [is_last, new_i, new_j] = get_next(i, j);
    if (data[i*9+j] == 0) {
        // if need to fill in: check every value
        for (let val = 1; val <= 9; ++val) {
            data[i*9+j] = val;
            if (!perform_checks(data, i, j)) {
                times_failed++;
                if (times_failed % 648391 == 0) postMessage(times_failed);
                continue;
            }
            if (is_last) return true;
            if (solve_sudoku_recursive(data, ref, new_i, new_j)) {
                return true;
            }
        }
    } else {
        // simply go to next
        if (is_last) return true;
        if (solve_sudoku_recursive(data, ref, new_i, new_j)) {
            return true;
        }
    }

    // all failed
    data[i*9+j] = ref[i*9+j];
    return false;
}

function solve_sudoku(ref) {
    data = Array.from(ref);

    solve_sudoku_recursive(data, ref, 0, 0);

    return data;
}

onmessage = (e) => {
    let solved = solve_sudoku(e.data);
    postMessage(times_failed);
    postMessage(solved);
}