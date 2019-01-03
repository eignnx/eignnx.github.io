
class Word {
  constructor(txt, pos, parent) {
    if (txt == EOL) {
      this.txt = "";
      this.ele = createElement("br");
      this.posTag = "sym";
    } else if (!partsOfSpeech.hasOwnProperty(pos)) {
      this.txt = txt;
      this.posTag = "sym";
      this.ele = createSpan(txt);
      this.ele.class("punct");
    } else {
      this.txt = txt.toLowerCase();
      this.originalTxt = this.txt;
      this.used = new Set([this.txt]);

      this.capitalized = isUpperCase(txt.charAt(0));
      this.ele = createSpan(txt);
      this.posTag = pos;

      this.ele.class("word");
      this.ele.style("color", "#000");

      this.prevColor = null;

      this.ele.mousePressed(() => this.replaceWord()); // Late binding.

      this.ele.mouseOver(() => {
        const origTxt = this.matchCapitalization(this.originalTxt);
        this.prevColor = this.ele.style("color");
        if (origTxt != this.ele.html()) {
          this.ele.style("color", "#aaa");
        }
        this.ele.style("text-decoration", "underline");
        this.ele.html(origTxt);
        displayBox.html(this.posText);
      });

      this.ele.mouseOut(() => {
        this.ele.style("color", this.prevColor);
        this.ele.style("text-decoration", "initial");
        this.ele.html(this.matchCapitalization(this.txt));
        displayBox.html("");
      });
    }

    this.posText = readablePos(pos);
    this.ele.parent(parent);
  }

  matchCapitalization(str) {
    if (this.capitalized) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    } else {
      return str;
    }
  }

  replaceWord() {
    let word;

    console.log(this.txt);
    console.log(RiTa.getSyllables(this.txt));

    let rhymes =
      RiTa.rhymes(this.originalTxt)
          .filter(rhyme => !this.used.has(rhyme))
          .flatMap(rhyme => Array(rhymeScore(rhyme, this.txt)).fill(rhyme));
          //.filter(rhyme => RiTa.getPosTags(rhyme).includes(this.posTag))
          //.filter(rhyme => sameSyllableCount(rhyme, this.txt));

      console.log(rhymes);

    if (rhymes.length > 0) {
      word = random(rhymes);
      this.prevColor = "#3a3";
      this.ele.style("color", this.prevColor);
    } else {
      let similarWords =
        RiTa.similarBySound(this.originalTxt, SIMILARITY_DIST)
            .filter(w => w != this.txt)
            .filter(w => RiTa.getPosTags(w).includes(this.posTag));

      if (similarWords.length > 0) {
        word = random(similarWords);
        this.prevColor = "#5aa";
        this.ele.style("color", this.prevColor);
      } else {
        let attempts = 10;
        do {
          word = RiTa.randomWord(this.posTag, syllableCount(this.txt));
        } while (word != this.txt && --attempts > 0);
        this.prevColor = "#722";
        this.ele.style("color", this.prevColor);
      }
    }

    this.used.add(word);

    if (this.capitalized) {
      this.txt = word.charAt(0).toUpperCase() + word.slice(1);
    } else {
      this.txt = word;
    }

    if (word == this.originalTxt) {
      this.ele.style("color", "#000");
    }
    
    this.ele.html(this.txt);
  }

  remove() {
    this.ele.remove();
  }
}

function isUpperCase(ch) {
  return ch == ch.toUpperCase();
}

function posSimilarityScore(word1, word2) {
  const MAX_REPEAT = 15;
  const s1 = RiTa.getPosTags(word1);
  const s2 = RiTa.getPosTags(word2);
  const n = s1.filter(pos => s2.includes(pos)).length;
  return ceil(MAX_REPEAT / (sq(n) + 1));
}

function syllableScore(word1, word2) {
  const MAX_REPEAT = 30;
  const s1 = syllableCount(word1);
  const s2 = syllableCount(word2);
  return ceil(MAX_REPEAT / (sq(s1 - s2) + 1));
}

function rhymeScore(word1, word2) {
  let total = 0;
  total += syllableCount(word1, word2);
  total += posSimilarityScore(word1, word2);
  return total;
}

function syllableCount(word) {
  const ss = RiTa.getSyllables(word);
  return ss.split("/").length;
}

function sameSyllableCount(word1, word2) {
  const s1 = syllableCount(word1);
  const s2 = syllableCount(word2);
  return abs(s1 - s2) <= RHYME_DIST;
}