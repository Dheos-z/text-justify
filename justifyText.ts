import _ from "lodash";

type Line = { lineLength: number; words: string[] };

export function justifyText(text: string, maxLineWidth: number): string {
  const words: string[] = text.split(" ").filter((word) => word.length);
  const formattedWords: string[] = formatWords(words, maxLineWidth);
  const lines: Line[] = computeLines(formattedWords, maxLineWidth);
  const formattedLines: string[] = formatLines(lines, maxLineWidth);
  return formattedLines.join("\n");
}

function formatWords(words: string[], maxLineWidth: number): string[] {
  const formattedWords: string[] = [];
  for (const word of words) {
    if (word.length > maxLineWidth) {
      const wordChunks: string[] = _.chunk(word, maxLineWidth - 1).map(
        (chunk: string[], index, array) => {
          let wordChunk: string = chunk.join("");
          if (index !== array.length - 1) wordChunk += "-";
          return wordChunk;
        }
      );
      formattedWords.push(...wordChunks);
    } else formattedWords.push(word);
  }
  return formattedWords;
}

function computeLines(words: string[], maxLineWidth: number): Line[] {
  const lines: Line[] = [];
  let currentLine: Line = { lineLength: 0, words: [] };
  for (const word of words) {
    let lengthToAdd: number =
      currentLine.words.length > 0 ? " ".length + word.length : word.length;
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

function formatLines(lines: Line[], maxLineWidth: number): string[] {
  const formattedLines: string[] = lines.map((line, index, array) => {
    const remainingSpaces: number = maxLineWidth - line.lineLength;
    if (line.words.length === 1)
      return line.words[0] + " ".repeat(remainingSpaces);
    else if (index === array.length - 1)
      return line.words.join(" ") + " ".repeat(remainingSpaces);
    else {
      const spacesQuotient: number = remainingSpaces / (line.words.length - 1);
      let spacesRemainder: number = remainingSpaces % (line.words.length - 1);
      return line.words.reduce((lineString, word, index, array) => {
        let spaceAfterWord = "";
        if (index < array.length - 1) {
          spaceAfterWord = " " + " ".repeat(spacesQuotient);
          if (spacesRemainder > 0) {
            spacesRemainder--;
            spaceAfterWord += " ";
          }
        }
        return lineString + word + spaceAfterWord;
      }, "");
    }
  });
  return formattedLines;
}
