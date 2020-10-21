import _ from "lodash";

export function justifyText(text, maxLineWidth) {
  const words = text.split(" ").filter((word) => word.length);
  const formattedWords = [];

  for (const word of words) {
    if (word.length > maxLineWidth) {
      const wordChunks = _.chunk(word, maxLineWidth - 1).map(
        (chunk, index, array) => {
          let wordChunk = chunk.join("");
          if (index !== array.length - 1) wordChunk += "-";
          return wordChunk;
        }
      );
      formattedWords.push(...wordChunks);
    } else formattedWords.push(word);
  }

  const lines = [];
  let currentLine = { lineLength: 0, words: [] };
  for (const word of formattedWords) {
    const potentialAddedLength = currentLine.words.length
      ? word.length + 1
      : word.length;
    if (currentLine.lineLength + potentialAddedLength > maxLineWidth) {
      lines.push(currentLine);
      currentLine = { lineLength: 0, words: [] };
    }
    currentLine.lineLength += potentialAddedLength;
    currentLine.words.push(word);
  }
  lines.push(currentLine);

  console.log(lines);

  const stringLines = lines.map((line, index) => {
    const nbRemainingSpaces = maxLineWidth - line.lineLength;
    // console.log(nbRemainingSpaces);
    if (line.words.length === 1)
      return line.words[0] + " ".repeat(nbRemainingSpaces);
    else if (index === lines.length - 1)
      return line.words.join(" ") + " ".repeat(nbRemainingSpaces);
    else {
      const spacesQuotient = nbRemainingSpaces / (line.words.length - 1);
      const spacesRemainder = nbRemainingSpaces % (line.words.length - 1);
      const wsh = line.words.reduce((lineString, word, index, array) => {
        let spaceAfterWord = "";
        if (index < array.length - 1) {
          spaceAfterWord = " ".repeat(spacesQuotient);
          if (spacesRemainder > 0) {
            spacesRemainder--;
            spaceAfterWord += " ";
          }
        }
        return lineString + word + spaceAfterWord;
      }, "");
      console.log(wsh);
      return wsh;
    }
  });
  console.log(stringLines);
}

justifyText(
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce lobortis turpis tortor, nec varius diam accumsan eget. Suspendisse dapibus urna eget lectus gravida congue. Integer tempus consectetur lacus sed congue. Duis tincidunt fermentum risus quis vestibulum. Duis id euismod mauris. Sed fermentum varius enim, ultrices lacinia nulla vulputate et. Sed volutpat malesuada odio faucibus varius. Interdum et malesuada fames ac ante ipsum primis in faucibus. Nullam id bibendum nunc. Phasellus a lorem erat. Donec nisi mi, posuere vitae auctor non, mollis ac odio. Nullam vitae purus posuere, pulvinar lacus a, malesuada tortor. Donec quis lorem in mi lobortis convallis nec ac tortor. Proin pulvinar in est vel blandit.",
  20
);
