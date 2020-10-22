"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.justifyText = void 0;
var lodash_1 = __importDefault(require("lodash"));
function justifyText(text, maxLineWidth) {
    var words = text.split(" ").filter(function (word) { return word.length; });
    var formattedWords = formatWords(words, maxLineWidth);
    var lines = computeLines(formattedWords, maxLineWidth);
    var formattedLines = formatLines(lines, maxLineWidth);
    return formattedLines.join("\n");
}
exports.justifyText = justifyText;
function formatWords(words, maxLineWidth) {
    var formattedWords = [];
    for (var _i = 0, words_1 = words; _i < words_1.length; _i++) {
        var word = words_1[_i];
        if (word.length > maxLineWidth) {
            var wordChunks = lodash_1.default.chunk(word, maxLineWidth - 1).map(function (chunk, index, array) {
                var wordChunk = chunk.join("");
                if (index !== array.length - 1)
                    wordChunk += "-";
                return wordChunk;
            });
            formattedWords.push.apply(formattedWords, wordChunks);
        }
        else
            formattedWords.push(word);
    }
    return formattedWords;
}
function computeLines(words, maxLineWidth) {
    var lines = [];
    var currentLine = { lineLength: 0, words: [] };
    for (var _i = 0, words_2 = words; _i < words_2.length; _i++) {
        var word = words_2[_i];
        var lengthToAdd = currentLine.words.length > 0 ? " ".length + word.length : word.length;
        if (currentLine.lineLength + lengthToAdd > maxLineWidth) {
            lines.push(currentLine);
            currentLine = { lineLength: 0, words: [] };
            lengthToAdd = word.length;
        }
        currentLine.lineLength += lengthToAdd;
        currentLine.words.push(word);
    }
    lines.push(currentLine);
    return lines;
}
function formatLines(lines, maxLineWidth) {
    var formattedLines = lines.map(function (line, index, array) {
        var remainingSpaces = maxLineWidth - line.lineLength;
        if (line.words.length === 1)
            return line.words[0] + " ".repeat(remainingSpaces);
        else if (index === array.length - 1)
            return line.words.join(" ") + " ".repeat(remainingSpaces);
        else {
            var spacesQuotient_1 = remainingSpaces / (line.words.length - 1);
            var spacesRemainder_1 = remainingSpaces % (line.words.length - 1);
            return line.words.reduce(function (lineString, word, index, array) {
                var spaceAfterWord = "";
                if (index < array.length - 1) {
                    spaceAfterWord = " " + " ".repeat(spacesQuotient_1);
                    if (spacesRemainder_1 > 0) {
                        spacesRemainder_1--;
                        spaceAfterWord += " ";
                    }
                }
                return lineString + word + spaceAfterWord;
            }, "");
        }
    });
    return formattedLines;
}
