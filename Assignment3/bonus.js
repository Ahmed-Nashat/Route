

function longestCommonPrefix(list) {
  let lcp = "";

  for (let i = 0; i < list[0].length; i++) {
    for (let j = 0; j < list.length; j++) {
      if (list[j][i] !== list[0][i]) {
        return lcp;
      }
    }

    lcp += list[0][i];
  }

  return lcp;
}

console.log(longestCommonPrefix(["flower", "flow", "flight"]));
