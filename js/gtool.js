/**
 *  gtool.js Copyright (C) 2022-2023 Wojciech Polak
 *
 *  This program is free software; you can redistribute it and/or modify it
 *  under the terms of the GNU General Public License as published by the
 *  Free Software Foundation; either version 3 of the License, or (at your
 *  option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License along
 *  with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

(function() {
    const Notes = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'];
    const IntervalsMapping = ['1', 'b2', '2', 'b3', '3', '4', 'b5', '5', 'b6', '6', 'b7', '7'];
    const IntervalsDesc = [
        'Unison',
        'Minor Second',
        'Major Second',
        'Minor Third',
        'Major Third',
        'Perfect Fourth',
        'Tri-Tone',
        'Perfect Fifth',
        'Minor Sixth',
        'Major Sixth',
        'Minor Seventh',
        'Major Seventh',
    ];
    const MajorChordsProgression = [
        ['I', ''],
        ['ii', 'm'],
        ['iii', 'm'],
        ['IV', ''],
        ['V', ''],
        ['vi', 'm'],
        ['vii', 'dim']
    ];
    const MinorChordsProgression = [
        ['i', 'm'],
        ['ii', 'dim'],
        ['III', ''],
        ['iv', 'm'],
        ['v', 'm'],
        ['VI', ''],
        ['VII', '']
    ];
    const PentatonicMajorChordsProgression = [
        ['I', ''],
        ['ii', 'sus2'],
        ['iii', '5'],
        ['V', 'sus4'],
        ['vi', 'm'],
    ];
    const PentatonicMinorChordsProgression = [
        ['i', 'm'],
        ['III', ''],
        ['iv', 'm7'],
        ['v', 'm7'],
        ['VII', '5']
    ];
    const Scales = {
        Major: {
            intervals: '1, 2, 3, 4, 5, 6, 7',
            progression: MajorChordsProgression,
        },
        Minor: {
            intervals: '1, 2, b3, 4, 5, b6, b7',
            progression: MinorChordsProgression,
        },
        PentatonicMajor: {
            intervals: '1, 2, 3, 5, 6',
            progression: PentatonicMajorChordsProgression,
        },
        PentatonicMinor: {
            intervals: '1, b3, 4, 5, b7',
            progression: PentatonicMinorChordsProgression,
        },
        PentatonicBlues: {
            intervals: '1, b3, 4, b5, 5, b7',
            progression: MinorChordsProgression,
        },
        Dorian: {
            intervals: '1, 2, b3, 4, 5, 6, b7',
            progression: [
                ['i', 'm'],
                ['ii', 'm'],
                ['III', ''],
                ['IV', ''],
                ['v', 'm'],
                ['vi', 'dim'],
                ['VII', ''],
            ]
        },
        Phrygian: {
            intervals: '1, b2, b3, 4, 5, b6, b7',
            progression: [
                ['i', 'm'],
                ['II', ''],
                ['III', ''],
                ['iv', 'm'],
                ['v', 'dim'],
                ['VI', ''],
                ['vii', 'm'],
            ]
        },
        Lydian: {
            intervals: '1, 2, 3, #4, 5, 6, 7',
            progression: [
                ['I', ''],
                ['II', ''],
                ['iii', 'm'],
                ['iv', 'dim'],
                ['V', ''],
                ['vi', 'm'],
                ['vii', 'm'],
            ]
        },
        Mixolydian: {
            intervals: '1, 2, 3, 4, 5, 6, b7',
            progression: [
                ['I', ''],
                ['ii', 'm'],
                ['iii', 'dim'],
                ['IV', ''],
                ['v', 'm'],
                ['vi', 'm'],
                ['VII', ''],
            ]
        },
        Locrian: {
            intervals: '1, b2, b3, 4, b5, b6, b7',
        }
    };

    function main() {
        fillKeySelector();
        onKeySelectorChange();
    }

    function fillKeySelector() {
        const el = document.getElementById('keySelector');
        for (let note of Notes) {
            let opt = document.createElement('option');
            opt.text = note;
            opt.value = note;
            if (note === 'C') {
                opt.selected = true;
            }
            el.appendChild(opt);
        }
        el.onchange = onKeySelectorChange;
        document.getElementById('scaleSelector').onchange = onKeySelectorChange;
    }

    function onKeySelectorChange() {
        const keySelector = document.getElementById('keySelector').value;
        const scaleSelector = document.getElementById('scaleSelector').value;
        clearLog();

        let noteIdx = Notes.indexOf(keySelector);
        log(keySelector + 'm=' + getNote(noteIdx + 3));
        log(keySelector + '=' + getNote(noteIdx - 3) + 'm');
        let scale = Scales[scaleSelector];

        let intervals = [];
        let notes = [];
        let notesNumbers = [];
        let notesOrder = 1;
        let intervalsRoot;

        if (scale.intervals) {
            intervalsRoot = scale.intervals.split(',').map(item => {
                return IntervalsMapping.indexOf(item.trim());
            });
        }

        for (let i of intervalsRoot) {
            let n = getNote(noteIdx + i);
            notes.push(n.padStart(2, ' '));
            notesNumbers.push((notesOrder++ + '').padStart(2, ' '));
            intervals.push('<span class="help" title="' +
                IntervalsDesc[i] + '">' + IntervalsMapping[i] + '</span>');
        }

        log();
        log('Intervals:');
        log(intervals.join(', '));

        log();
        log('Notes:');
        log(notes.join(', '));
        log(notesNumbers.join('  '));

        if (scale.progression) {
            log();
            log('Chords in Key:');
            let chords = [];
            let pos = 0;
            for (let i of intervalsRoot) {
                let n = getNote(noteIdx + i);
                let prog = scale.progression[pos++];
                let chord = n + '' + prog[1];
                let chordLink = `<a href="https://www.scales-chords.com/chord/guitar/${encodeURIComponent(chord)}" target="_blank">${chord}</a>`;
                log(prog[0].padStart(3, ' ') + ' ' + chordLink);
                chords.push(chord);
            }
            log();
            let randomProg = getRandomChordProgression(chords);
            log('random: ' + randomProg.join(', '));
        }

        log()
        const ss = document.getElementById('scaleSelector');
        let scaleSelectorText = ss.options[ss.selectedIndex].text;
        let query = `backing track in ${keySelector} ${scaleSelectorText}`;
        let url = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
        log(`<a href="${url}" target="_blank">YouTube backing tracks</a>`);
    }

    function getNote(i = 0) {
        let len = Notes.length;
        let pos = (i % len + len) % len;
        return Notes[pos];
    }

    function getRandomChordProgression(arr, max) {
        max = max || 4;
        let newArr = [...arr];
        shuffleArray(newArr);
        return newArr.slice(0, max);
    }

    /* Randomize array in-place using Durstenfeld shuffle algorithm */
    function shuffleArray(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            let temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }
    }

    function log(msg) {
        msg = msg || '';
        const el = document.getElementById('log');
        el.innerHTML += msg + '<br/>';
    }

    function clearLog() {
        const el = document.getElementById('log');
        el.innerHTML = '';
    }

    document.addEventListener('DOMContentLoaded', main);
}());
