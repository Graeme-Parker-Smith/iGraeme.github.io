  let cardNames = [];
  for(let i = 1; i < 14; i++){
    let add;
    switch(i) {
      case 1:
        add = ["AD", "AH", "AC", "AS"];
        cardNames.push(...add);
        break;
      case 11:
        add = ["JD", "JH", "JC", "JS"];
        cardNames.push(...add);
        break;
      case 12:
        add = ["QD", "QH", "QC", "QS"];
        cardNames.push(...add);
        break;
      case 13:
        add = ["KD", "KH", "KC", "KS"];
        cardNames.push(...add);
        break;
      default:
        add = [`${i}D`,`${i}H`,`${i}C`,`${i}S`];
        cardNames.push(...add);
        break;
    }
  }